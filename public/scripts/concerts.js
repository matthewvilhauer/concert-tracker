
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

  var formattedDate = concert.date.substr(0,10);

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
  $(".concertDate").append(formattedDate);
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

// function getRecording() {
//
//   var archiveEndpoint = "https://archive.org/details/sci2004-06-19.flac16?output=json";
//
//   $.ajax({
//     method: "GET",
//     headers: { 'Access-Control-Allow-Origin': 'Access-Control-Allow-Origin' },
//     url: archiveEndpoint,
//     success: onRecordingSuccess,
//     error: onRecordingError
//   });
// }
//
// function onRecordingSuccess(data) {
//   console.log(data);
// }
// function onRecordingError(err) {
//   console.log('Error getting data!');
// }

function renderRecording(link) {
  iframe_link = '<iframe src='+link+'&playlist=1 width="900" height="500" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen></iframe>';
  console.log("iFrame Link: "+iframe_link);
  $('.music-player').html(iframe_link);
}
