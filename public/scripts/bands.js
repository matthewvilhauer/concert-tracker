
/**********
* GLOBAL BAND VARIABLES *
**********/

var template;
var $bandsList;
var allBands = {};


//************* Document Ready *********************

$(document).ready(function() {

    console.log('bands.js loaded!');

    $bandsList = $('#bands');

    // compile handlebars template
    var source = $('#band-template').html();
    template = Handlebars.compile(source);

    renderBandIndex();

});

/**********
* INDEX *
**********/

//Get all Bands
function renderBandIndex() {

  $.ajax({
    method: 'GET',
    url: '/api/bands',
    success: renderBandIndexSuccess,
    error: renderBandIndexError
  });
}

//Display Index of all the Bands in the Bands array
function renderBandIndexSuccess(bands) {

  bands.forEach( function(band) {
    allBands[band._id] = band;
  });
  //Empty the old list of bands
  $bandsList.empty();

  console.log('renderBandIndex allBands value: ', allBands);
  // pass the band into the template function
  var bandHtml = template({ bands: bands});
  // append html to the view
  $bandsList.append(bandHtml);

  //************* Add click handlers for each band button *********************
  //Add an Band
  $('#add-band-form').on('submit', handleAddBandClick);
  //Delete band click handler
  $('.delete-band-button').on('click', handleDeleteBandClick);
  //Update band click handler
  $('.update-band-button').on('click', handleUpdateBandClick);
  //Save band click handler
  $('.save-band-button').on('click', handleSaveChangesClick);
}
function renderBandIndexError(e) {
  console.log('Error loading bands');
}


/**********
* CREATE *
**********/

// Send the new band data to the server when the Add Band button is clicked
function handleAddBandClick(e) {

  console.log("All bands before add:", allBands);
  // e.preventDefault();

  $.ajax({
    method: 'POST',
    url: '/api/bands',
    data: $(this).serialize(),
    success: createBandSuccess,
    error: createBandError
  });

  renderBandIndex();
}
// On creation of a single Band, re-render the list of bands
function createBandSuccess(band) {

  console.log("Band: ", band);
  $('#add-band-form input').val('');
  $('#add-band-form textarea').val('');

  allBands[band._id] = band;
  console.log("On createBandSuccess allBands value: ", allBands);

}
function createBandError(e) {
  console.log('Error creating band');
}


/**********
* DELETE *
**********/

// Send the ID of the band to be deleted to the server
function handleDeleteBandClick(e) {
  var $bandRow = $(this).closest('.band');
  var bandId = $bandRow.data('band-id');
  delete allBands[bandId];
  console.log("On handleDeleteBandClick allBands value: ", allBands);
  console.log('someone wants to delete band id=' + bandId );
  $.ajax({
    method: 'DELETE',
    url: '/api/bands/' + bandId,
    success: deleteBandSuccess,
    error: deleteBandError
  });
}
// Remove the deleted band from allBands and re-render the list of bands
function deleteBandSuccess(band) {

  // delete allBands[band._id];

  console.log("On deleteBandSuccess allBands value: ", allBands);

  renderBandIndex();
  location.reload();
}
function deleteBandError(e) {
  console.log('Error deleting band');
}
// function deleteBand(element) {
//   var bandId = $(element).data('band-id');
//   $.ajax({
//     method: 'DELETE',
//     url: '/api/bands/' + bandId,
//     success: deleteBandSuccess,
//     error: deleteBandError
//   });
//   allBands[bandId] = null;
// }

/**********
* UPDATE *
**********/

// when the Edit button for an band is clicked
function handleUpdateBandClick(e) {
  var $bandRow = $(this).closest('.band');
  var bandId = $bandRow.data('band-id');

  console.log('edit band', bandId);

// debugger;
  // show the save changes button
  $(this).parent().find('.save-band-button').toggleClass('hidden');

  // hide the edit button
  $(this).parent().find('.update-band-button').toggleClass('hidden');

  // get the band name and replace its field with an input element
  var bandName = $bandRow.find('span.band-name').text();
  $bandRow.find('span.band-name').html('<input class="update-band-name" value="' + bandName + '"></input>');

  // // get the artist name and replace its field with an input element
  // var artistName = $bandRow.find('span.artist-name').text();
  // $bandRow.find('span.artist-name').html('<input class="edit-artist-name" value="' + artistName + '"></input>');
  //
  // // get the releasedate and replace its field with an input element
  // var releaseDate = $bandRow.find('span.band-releaseDate').text();
  // $bandRow.find('span.band-releaseDate').html('<input class="edit-band-releaseDate" value="' + releaseDate + '"></input>');
}

// after editing an band, when the save changes button is clicked
function handleSaveChangesClick(e) {
  var bandId = $(this).parents('.band').data('band-id'); // $(this).closest would have worked fine too
  var $bandRow = $('[data-band-id=' + bandId + ']');

  var data = {
    name: $bandRow.find('.update-band-name').val()
  };
  console.log('PUTing data for band', bandId, 'with data', data);

  $.ajax({
    method: 'PUT',
    url: '/api/bands/' + bandId,
    data: data,
    success: handleUpdatedBandResponse,
    error: handleUpdatedBandError
  });
  location.reload();
}

function handleUpdatedBandResponse(band) {
  console.log('response to update', band);
  allBands[band._id] = band;
  var bandId = band._id;
  // scratch this band from the page
  $('[data-band-id=' + bandId + ']').remove();
  // and then re-draw it with the updates ;-)
  renderBandIndex();

  // BONUS: scroll the change into view ;-)
  // $('[data-band-id=' + bandId + ']')[0].scrollIntoView();
}
function handleUpdatedBandError(err) {
  console.log('Error updating band: ', err);
}
