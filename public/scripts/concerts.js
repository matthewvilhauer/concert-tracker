
var template;
var $concertsList;
var $addConcertForm;
var addConcertFormTemplate;
var allConcerts = {};
var allBands = {};

$(document).ready(function() {

    console.log('concerts.js loaded!');

    // compile Concert List template
    compileConcertListTemplate();
    // compile Add Concert Form template
    compileAddConcertFormTemplate();

    showConcertList();
    showConcertForm();

});

function compileConcertListTemplate() {
  $concertsList = $('#concerts');
  var source = $('#concert-list-template').html();
  template = Handlebars.compile(source);
}
function compileAddConcertFormTemplate() {
  $addConcertForm = $('#add-concert-form-container');
  var addConcertForm = $('#add-concert-form-template').html();
  addConcertFormTemplate = Handlebars.compile(addConcertForm);
}
function addClickHandlers() {
  //Show single concert click handler
  // $('.show-single-concert').on('click', handleSingleConcertClick);
  //Delete concert click handler
  $('.delete-concert-button').on('click', handleDeleteConcertClick);
  //Update concert click handler
  $('.update-concert-button').on('click', handleUpdateConcertClick);
  //Save concert click handler
  $('.save-concert-button').on('click', handleSaveChangesClick);
}

/**********
* INDEX *
**********/

//Get all Concerts
function showConcertList() {
  $.get('/api/concertsList').success( function(response) {
    $concerts = response.concerts;
    //Add concerts to the hash map
    $concerts.forEach( function(concert) {
      allConcerts[concert._id] = concert;
    });
    renderConcertList(allConcerts);
  });
}
//Render all Concerts
function renderConcertList (concerts) {
  //Empty the old list of concerts
  //Set the object for the template
  var concertHtml = template({
    concerts: allConcerts
  });

  console.info('renderConcertList allConcerts value: ', allConcerts);
  // append concert list html to the view
  $concertsList.html(concertHtml);
  addClickHandlers();
}
function renderConcertListError(e) {
  console.log('Error loading concerts');
}

/**********
* SHOW CONCERT FORM *
**********/

//Get the concert form
function showConcertForm() {
  $.get('/api/bands').success( function(bands) {

    bands.forEach( function(band) {
      allBands[band._id] = band;
    });
    renderAddConcertForm(allBands);
  });
}
//Render the Add Concert Form
function renderAddConcertForm (bands) {

  // pass the bands into the Add Concert template function
  var addConcertFormHtml = addConcertFormTemplate({
    bands: allBands
  });
  $addConcertForm.html(addConcertFormHtml);
  console.info("Added Add Concert Form to the page!");
}
function renderAddConcertFormError(e) {
  console.log('Error loading concerts');
}

/**********
* CREATE *
**********/

// Send the new concert data to the server when the Add Concert button is clicked

function handleAddConcertClick() {
  var formData = $('#add-concert-form').serialize();

  console.log("Form data to be added: ", formData);

  $.ajax({
    method: 'POST',
    url: '/api/concerts',
    data: formData,
    success: createConcert,
    error: createConcertError
  });
}

// On creation of a single Concert, re-render the list of concerts
function createConcert(concert) {

  console.log("Concert: ", concert);

  $('#add-concert-form input').val('');
  $('#add-concert-form textarea').val('');

  allConcerts[concert._id] = concert;

  renderConcertList(allConcerts);

  console.log("On createConcertSuccess allConcerts value: ", allConcerts);
}
function createConcertError(e) {
  console.log('Error creating concert');
}

/**********
* DELETE *
**********/

// Send the ID of the concert to be deleted to the server
function handleDeleteConcertClick(e) {
  var $concertRow = $(this).closest('.concert');
  var concertId = $concertRow.data('concert-id');

  console.log('someone wants to delete concert id=' + concertId );
  console.log("On handleDeleteConcertClick allConcerts value: ", allConcerts);

  $.ajax({
    method: 'DELETE',
    url: '/api/concerts/' + concertId,
    success: deleteConcertSuccess,
    error: deleteConcertError
  });
}
// Remove the deleted concert from allConcerts and re-render the list of concerts
function deleteConcertSuccess(concert) {

  delete allConcerts[concert._id];

  console.log("On deleteConcertSuccess allConcerts value: ", allConcerts);

  renderConcertList(allConcerts);

}
function deleteConcertError(e) {
  console.log('Error deleting concert');
}

//test
/**********
* SHOW *
**********/

// function handleSingleConcertClick(e) {
//
//   var $concertRow = $(this).closest('.concert');
//   var concertId = $concertRow.data('concert-id');
//
//   console.log('someone wants to show concert id=' + concertId );
//
//   $.ajax({
//     method: 'GET',
//     url: '/concerts/' + concertId,
//     success: showSingleConcertSuccess,
//     error: showConcertError
//   });
// }
// function showSingleConcertSuccess(concert) {
//   singleConcert = concert;
// }
// function showConcertError(e) {
//   console.log('Error showing single concert');
// }



/**********
* UPDATE *
**********/

// when the Edit button for an band is clicked
function handleUpdateConcertClick(e) {
  var $concertRow = $(this).closest('.concert');
  var concertId = $concertRow.data('concert-id');

  console.log('edit concert', concertId);

  // show the save changes button
  $(this).parent().find('.save-concert-button').toggleClass('hidden');
  // hide the edit button
  $(this).parent().find('.update-concert-button').toggleClass('hidden');

  $concertRow.find('.edit-concert-image').toggleClass('hidden');
  $concertRow.find('.edit-concert-recording').toggleClass('hidden');
  $concertRow.find('.music-player').toggleClass('hidden');

  // get the concert attributes and replace their fields with an input element
  var concertName = $concertRow.find('span.concert-eventName').text();
  $concertRow.find('span.concert-eventName').html('<input class="update-concert update-concert-eventName" value="' + concertName + '"></input>');
  // var bandId = $concertRow.find('span.concert-bandId').text();
  // $concertRow.find('span.concert-bandId').html('<input class="update-concert update-concert-bandId" value="' + bandId + '"></input>');
  var concertDate = $concertRow.find('span.concert-date').val();
  $concertRow.find('span.concert-date').html('<input class="update-concert update-concert-date" type="date" value="' + concertDate + '"></input>');
  var location = $concertRow.find('span.concert-location').text();
  $concertRow.find('span.concert-location').html('<input class="update-concert update-concert-location" value="' + location + '"></input>');
  var setlist = $concertRow.find('span.concert-setlist').text();
  $concertRow.find('span.concert-setlist').html('<textarea class="update-concert update-concert-setlist">' + setlist + '</textarea>');
  var description = $concertRow.find('span.concert-description').text();
  $concertRow.find('span.concert-description').html('<textarea class="update-concert update-concert-description">' + description + '</textarea>');
  var imageURL = $concertRow.find('span.concert-image-url').text();
  $concertRow.find('span.concert-image-url').html('<input class="update-concert update-concert-image-url" value="' + imageURL + '"></input>');
  var recordingURL = $concertRow.find('span.concert-recording-url').text();
  $concertRow.find('span.concert-recording-url').html('<input class="update-concert update-concert-recording-url" value="' + recordingURL + '"></input>');
}

// after editing an concert, when the save changes button is clicked
function handleSaveChangesClick(e) {
  var concertId = $(this).parents('.concert').data('concert-id'); // $(this).closest would have worked fine too
  var $concertRow = $('[data-concert-id=' + concertId + ']');

  var data = {
    eventName: $concertRow.find('.update-concert-eventName').val(),
    // bandId: $concertRow.find('.update-concert-bandId').val(),
    concertDate: $concertRow.find('.update-concert-date').val(),
    location: $concertRow.find('.update-concert-location').val(),
    setlist: $concertRow.find('.update-concert-setlist').val(),
    description: $concertRow.find('.update-concert-description').val(),
    image_url: $concertRow.find('.update-concert-image-url').val(),
    recording_url: $concertRow.find('.update-concert-recording-url').val(),
  };
  console.log('PUTing data for concert', concertId, 'with data:', data);

  $.ajax({
    method: 'PUT',
    url: '/api/concerts/' + concertId,
    data: data,
    success: handleUpdatedConcertResponse,
    error: handleUpdatedConcertError
  });
}

function handleUpdatedConcertResponse(concert) {
  console.log('response to update', concert);
  allConcerts[concert._id] = concert;
  var concertId = concert._id;

  renderConcertList(allConcerts);

  // BONUS: scroll the change into view ;-)
  $('[data-concert-id=' + concertId + ']')[0].scrollIntoView();
}
function handleUpdatedConcertError(err) {
  console.log('Error updating band: ', err);
}

/**********
* RENDER RECORDING *
**********/

// Create the iFrame HTML from the Recording Link
function renderRecording(concert) {
  var recordingLink = concert.recording_url;
  iframe_link = '<iframe src='+recordingLink+'&playlist=1 frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen></iframe>';
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
