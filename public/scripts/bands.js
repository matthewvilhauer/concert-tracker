
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

    //Add an Band
    $('#add-band-form').on('submit', handleAddBandClick);

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

  //Empty the old list of bands
  $bandsList.empty();

  bands.forEach( function(band) {
    allBands[band._id] = band;
  });

  console.log('renderBandIndex allBands value: ', allBands);
  // pass the band into the template function
  var bandHtml = template({ bands: bands});
  // append html to the view
  $bandsList.append(bandHtml);

  //************* Add click handlers for each band button *********************

  //Show single band click handler
  $('.show-single-band').on('click', handleSingleBandClick);
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

}
// On creation of a single Band, re-render the list of bands
function createBandSuccess(band) {

  console.log("Band: ", band);
  
  $('#add-band-form input').val('');
  $('#add-band-form textarea').val('');

  allBands[band._id] = band;
  renderBandIndex();

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

  delete allBands[band._id];

  console.log("On deleteBandSuccess allBands value: ", allBands);

  renderBandIndex();
  // location.reload();
}
function deleteBandError(e) {
  console.log('Error deleting band');
}

/**********
* SHOW *
**********/

function handleSingleBandClick(e) {

  var $bandRow = $(this).closest('.band');
  var bandId = $bandRow.data('band-id');

  console.log('someone wants to show band id=' + bandId );

  $.ajax({
    method: 'GET',
    url: '/api/bands/' + bandId,
    success: showBandSuccess,
    error: showBandError
  });
}

function showBandSuccess(band) {
  console.log("Success - show band: ", band);
}
function showBandError(e) {
  console.log('Error showing single band');
}

/**********
* UPDATE *
**********/

// when the Edit button for an band is clicked
function handleUpdateBandClick(e) {
  var $bandRow = $(this).closest('.band');
  var bandId = $bandRow.data('band-id');

  console.log('edit band', bandId);

  // show the save changes button
  $(this).parent().find('.save-band-button').toggleClass('hidden');
  // hide the edit button
  $(this).parent().find('.update-band-button').toggleClass('hidden');

  $bandRow.find('.edit-band-image').toggleClass('hidden');

  // get the band attributes and replace their fields with an input element
  var bandName = $bandRow.find('span.band-name').text();
  $bandRow.find('span.band-name').html('<input class="update-band update-band-name" value="' + bandName + '"></input>');
  var formationDate = $bandRow.find('span.band-formationDate').text();
  $bandRow.find('span.band-formationDate').html('<input class="update-band update-band-formationDate" value="' + formationDate + '"></input>');
  var recordLabel = $bandRow.find('span.band-recordLabel').text();
  $bandRow.find('span.band-recordLabel').html('<input class="update-band update-band-recordLabel" value="' + recordLabel + '"></input>');
  var description = $bandRow.find('span.band-description').text();
  $bandRow.find('span.band-description').html('<textarea class="update-band update-band-description">' + description + '</textarea>');
  var genres = $bandRow.find('span.band-genres').text();
  $bandRow.find('span.band-genres').html('<textarea class="update-band update-band-genres">' + genres + '</textarea>');
  var imageURL = $bandRow.find('span.band-image-url').text();
  $bandRow.find('span.band-image-url').html('<input class="update-band update-band-image-url" value="' + imageURL + '"></input>');
}


// after editing an band, when the save changes button is clicked
function handleSaveChangesClick(e) {
  var bandId = $(this).parents('.band').data('band-id'); // $(this).closest would have worked fine too
  var $bandRow = $('[data-band-id=' + bandId + ']');

  var data = {
    name: $bandRow.find('.update-band-name').val(),
    formationDate: $bandRow.find('.update-band-formationDate').val(),
    recordLabel: $bandRow.find('.update-band-recordLabel').val(),
    description: $bandRow.find('.update-band-description').val(),
    genres: $bandRow.find('.update-band-genres').val(),
    image_url: $bandRow.find('.update-band-image-url').val(),
  };
  console.log('PUTing data for band', bandId, 'with data', data);

  $.ajax({
    method: 'PUT',
    url: '/api/bands/' + bandId,
    data: data,
    success: handleUpdatedBandResponse,
    error: handleUpdatedBandError
  });
}

function handleUpdatedBandResponse(band) {
  console.log('response to update', band);
  allBands[band._id] = band;
  var bandId = band._id;
  renderBandIndex();
  // scratch this band from the page
  $('[data-band-id=' + bandId + ']').remove();
  // and then re-draw it with the updates ;-)


  // BONUS: scroll the change into view ;-)
  // $('[data-band-id=' + bandId + ']')[0].scrollIntoView();
}
function handleUpdatedBandError(err) {
  console.log('Error updating band: ', err);
}
