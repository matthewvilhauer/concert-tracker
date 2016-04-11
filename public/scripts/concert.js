
var template;
var $concertSingle;
// var $addConcertForm;
// var addConcertFormTemplate;
var allConcerts = {};
var allBands = {};
var $concertId;

$(document).ready(function() {

    console.log('concerts.js loaded!');

    // compile Concert List template
    compileConcertSingleTemplate();
    // compile Add Concert Form template
    // compileAddConcertFormTemplate();
    showSingleConcert();
    // showConcertForm();
    getConcertList();

});

function compileConcertSingleTemplate() {
  $concertSingle = $('#concert-single');
  var source = $('#concert-single-template').html();
  template = Handlebars.compile(source);
}
// function compileAddConcertFormTemplate() {
//   $addConcertForm = $('#add-concert-form-container');
//   var addConcertForm = $('#add-concert-form-template').html();
//   addConcertFormTemplate = Handlebars.compile(addConcertForm);
// }
function addClickHandlers() {
  //Show single concert click handler
  // $('.show-single-concert').on('click', handleSingleConcertClick);
  // Delete concert click handler
  $('.delete-concert-button').on('click', handleDeleteConcertClick);
  // //Update concert click handler
  // $('.update-concert-button').on('click', handleUpdateConcertClick);
  // //Save concert click handler
  // $('.save-concert-button').on('click', handleSaveChangesClick);
}

/**********
* INDEX *
**********/

//Show a single concert
function showSingleConcert() {
  console.log('hey there');
  console.log("id?: ", window.location);
  var url = window.location.pathname;
  console.log("the url", url);

  $.ajax({
    method: 'GET',
    url: "/api"+url,
    success: renderSingleConcert,
    error: renderSingleConcertError
  });
}
//Render a Concert
function renderSingleConcert (concert) {
  console.log("Concert passed back: ", concert);
  //Set the object for the template
  // $concertId = concert._id;
  var concertHtml = template({
    concert: concert
  });

  console.info('renderSingleConcert concert value: ', concert);
  // append concert list html to the view
  $concertSingle.html(concertHtml);

  if (concert.recording_url) {
    renderRecording(concert);
  } else {
    console.log("No recording to render for concert: ", concert);
  }
  addClickHandlers();
}

function renderSingleConcertError(e) {
  console.log('Error loading concerts');
}

// Get all Concerts for updating on delete
function getConcertList() {
  $.get('/api/concertsList').success( function(response) {
    $concerts = response.concerts;
    //Add concerts to the hash map
    $concerts.forEach( function(concert) {
      allConcerts[concert._id] = concert;
    });
    console.log(allConcerts);
  });
}


/**********
* DELETE *
**********/

// Send the ID of the concert to be deleted to the server
function handleDeleteConcertClick(e) {
  // var $concertRow = $(this).closest('.concert-single');
  // var concertId = $concertRow.data('concert-id');

  console.log('someone wants to delete concert id=' + $concertId );
  // console.log("On handleDeleteConcertClick allConcerts value: ", allConcerts);

  $.ajax({
    method: 'DELETE',
    url: '/api/concerts/' + $concertId,
    success: deleteSingleConcertSuccess,
    error: deleteConcertError
  });
}
// Remove the deleted concert from allConcerts and re-render the list of concerts
function deleteSingleConcertSuccess(concert) {

  delete allConcerts[concert._id];

  // console.log("On deleteConcertSuccess allConcerts value: ", allConcerts);

}
function deleteConcertError(e) {
  console.log('Error deleting concert');
}

function redirect() {
  app.get('/concerts', function(err) {
    if (err) {
      console.log("Could not redirect");
    }
  });
}

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
//     url: '/api/concerts/' + concertId,
//     success: showConcertSuccess,
//     error: showConcertError
//   });
// }
// function showConcertSuccess(concert) {
//   console.log("Success - show concert: ", concert);
// }
// function showConcertError(e) {
//   console.log('Error showing single concert');
// }
//
//
// /**********
// * UPDATE *
// **********/
//
// // when the Edit button for an band is clicked
// function handleUpdateConcertClick(e) {
//   var $concertRow = $(this).closest('.concert');
//   var concertId = $concertRow.data('concert-id');
//
//   console.log('edit concert', concertId);
//
//   // show the save changes button
//   $(this).parent().find('.save-concert-button').toggleClass('hidden');
//   // hide the edit button
//   $(this).parent().find('.update-concert-button').toggleClass('hidden');
//
//   $concertRow.find('.edit-concert-image').toggleClass('hidden');
//   $concertRow.find('.edit-concert-recording').toggleClass('hidden');
//   $concertRow.find('.music-player').toggleClass('hidden');
//
//   // get the concert attributes and replace their fields with an input element
//   var concertName = $concertRow.find('span.concert-eventName').text();
//   $concertRow.find('span.concert-eventName').html('<input class="update-concert update-concert-eventName" value="' + concertName + '"></input>');
//   // var bandId = $concertRow.find('span.concert-bandId').text();
//   // $concertRow.find('span.concert-bandId').html('<input class="update-concert update-concert-bandId" value="' + bandId + '"></input>');
//   var concertDate = $concertRow.find('span.concert-date').val();
//   $concertRow.find('span.concert-date').html('<input class="update-concert update-concert-date" type="date" value="' + concertDate + '"></input>');
//   var location = $concertRow.find('span.concert-location').text();
//   $concertRow.find('span.concert-location').html('<input class="update-concert update-concert-location" value="' + location + '"></input>');
//   var setlist = $concertRow.find('span.concert-setlist').text();
//   $concertRow.find('span.concert-setlist').html('<textarea class="update-concert update-concert-setlist">' + setlist + '</textarea>');
//   var description = $concertRow.find('span.concert-description').text();
//   $concertRow.find('span.concert-description').html('<textarea class="update-concert update-concert-description">' + description + '</textarea>');
//   var imageURL = $concertRow.find('span.concert-image-url').text();
//   $concertRow.find('span.concert-image-url').html('<input class="update-concert update-concert-image-url" value="' + imageURL + '"></input>');
//   var recordingURL = $concertRow.find('span.concert-recording-url').text();
//   $concertRow.find('span.concert-recording-url').html('<input class="update-concert update-concert-recording-url" value="' + recordingURL + '"></input>');
// }
//
// // after editing an concert, when the save changes button is clicked
// function handleSaveChangesClick(e) {
//   var concertId = $(this).parents('.concert').data('concert-id'); // $(this).closest would have worked fine too
//   var $concertRow = $('[data-concert-id=' + concertId + ']');
//
//   var data = {
//     eventName: $concertRow.find('.update-concert-eventName').val(),
//     // bandId: $concertRow.find('.update-concert-bandId').val(),
//     concertDate: $concertRow.find('.update-concert-date').val(),
//     location: $concertRow.find('.update-concert-location').val(),
//     setlist: $concertRow.find('.update-concert-setlist').val(),
//     description: $concertRow.find('.update-concert-description').val(),
//     image_url: $concertRow.find('.update-concert-image-url').val(),
//     recording_url: $concertRow.find('.update-concert-recording-url').val(),
//   };
//   console.log('PUTing data for concert', concertId, 'with data:', data);
//
//   $.ajax({
//     method: 'PUT',
//     url: '/api/concerts/' + concertId,
//     data: data,
//     success: handleUpdatedConcertResponse,
//     error: handleUpdatedConcertError
//   });
// }
//
// function handleUpdatedConcertResponse(concert) {
//   console.log('response to update', concert);
//   allConcerts[concert._id] = concert;
//   var concertId = concert._id;
//
//   renderConcertList(allConcerts);
//
//   // BONUS: scroll the change into view ;-)
//   $('[data-concert-id=' + concertId + ']')[0].scrollIntoView();
// }
// function handleUpdatedConcertError(err) {
//   console.log('Error updating band: ', err);
// }
//
// /**********
// * RENDER RECORDING *
// **********/

// Create the iFrame HTML from the Recording Link
function renderRecording(concert) {
  var recordingLink = concert.recording_url;
  iframe_link = '<iframe src='+recordingLink+'&playlist=1 frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen></iframe>';
  console.log("iFrame Link: "+iframe_link);
  $('.music-player').html(iframe_link);
}

// // GET Request from Archive.org
// function getRecordingLink() {
//
//   var archiveEndpoint = "https://archive.org/embed/";
//   var outputJSON = "?output=json";
//
//   $.ajax({
//     method: "GET",
//     header: {'Access-Control-Allow-Origin':'Access-Control-Allow-Origin'},
//     url: archiveEndpoint,
//     data: outputJSON,
//     success: onRecordingSuccess,
//     error: onRecordingError
//   });
//
//   function onRecordingSuccess(archiveJSON) {
//     var concertIdentifier = archiveJSON.metadata.identifier;
//     console.log(concertIdentifier);
//     var concertLink = archiveEndpoint+concertIdentifier;
//     renderRecording(concertLink);
//   }
//   function onRecordingError(err) {
//     console.log("Error Retrieving Archive data: ", err);
//   }
// }
