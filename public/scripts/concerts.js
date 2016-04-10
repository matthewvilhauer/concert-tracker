
var template;
var $concertsList;
var allConcerts;

$(document).ready(function() {

    console.log('concerts.js loaded!');

    $concertsList = $('#concerts');

    // compile handlebars template
    var source = $('#concert-template').html();
    template = Handlebars.compile(source);

    //Get all Concerts
    $.ajax({
      method: 'GET',
      url: '/api/concerts',
      success: handleConcertSuccess,
      error: handleConcertError
    });

    //Add an Concert
    $('#concert-form').on('submit', function(e) {
      e.preventDefault();
      $.ajax({
        method: 'POST',
        url: '/api/concerts',
        data: $(this).serialize(),
        success: createConcertSuccess,
        error: createConcertError
      });
    });

});

// this function takes a single concert and renders it to the page
function renderConcert(concert) {

  console.log('rendering concert');

  // pass the concert into the template function
  var concertHtml = template({ concert: concert});

  // append html to the view
  $concertsList.append(concertHtml);

  var $band = concert.band;
  $(".concert-band").text($band);
  console.log($band);
  var recordingLink = concert.recording_url;
  console.log("Recording: "+recordingLink);
  renderRecording(recordingLink);
}

//Render all the concerts in the Concerts array
function handleConcertSuccess(concerts) {
  $concertsList.empty();
  console.log("concerts: ", concerts);
  concerts.forEach(function(concert) {
    renderConcert(concert);
    $('.delete-concert-button').on('click', handleDeleteConcertClick);
  });
}

function handleConcertError(e) {
  console.log('Error loading concerts');
  $('#concertTarget').text('Failed to load concerts, is the server working?');
}


// On creation of an Concert, render it
function createConcertSuccess(concert) {
  $('#concert-form input').val('');
  $('#concert-form textarea').val('');
    renderConcert(concert);
    $('.delete-concert-button').on('click', handleDeleteConcertClick);
}
function createConcertError(e) {
  console.log('Error creating concert');
  $('#concertTarget').text('Failed to create concert, is the server working?');
}


// On deletion of an Concert, render new concert list
function handleDeleteConcertClick(e) {
  var concertId = $(this).attr('data-concert-id');
  console.log('someone wants to delete concert id=' + concertId );
  $.ajax({
    method: 'DELETE',
    url: '/api/concerts/' + concertId,
    success: handleConcertSuccess,
    error: deleteConcertError
  });
}
function deleteConcertError(e) {
  console.log('Error deleting concert');
  $('#concertTarget').text('Failed to delete concert, is the server working?');
}


// Create the iFrame HTML from the Recording Link
function renderRecording(link) {
  iframe_link = '<iframe src='+link+'&playlist=1 frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen></iframe>';
  console.log("iFrame Link: "+iframe_link);
  $('.music-player').html(iframe_link);
}

// GET Request from Archive.org
function getRecordingLink() {

  var archiveEndpoint = "https://archive.org/embed/";
  var outputJSON = "?output=json";

  $.ajax({
    method: "GET",
    header: {'Access-Control-Allow-Origin':'Access-Control-Allow-Origin'},
    url: archiveEndpoint,
    data: outputJSON,
    success: onRecordingSuccess,
    error: onRecordingError
  });

  function onRecordingSuccess(archiveJSON) {
    var concertIdentifier = archiveJSON.metadata.identifier;
    console.log(concertIdentifier);
    var concertLink = archiveEndpoint+concertIdentifier;
    renderRecording(concertLink);
  }
  function onRecordingError(err) {
    console.log("Error Retrieving Archive data: ", err);
  }
}
