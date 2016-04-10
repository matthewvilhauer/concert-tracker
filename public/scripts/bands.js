
/**********
* GLOBAL BAND VARIABLES *
**********/

var template;
var $bandsList;
var allBands = {};

$(document).ready(function() {

    console.log('bands.js loaded!');

    $bandsList = $('#bands');

    // compile handlebars template
    var source = $('#band-template').html();
    template = Handlebars.compile(source);

    //Get all Bands
    $.ajax({
      method: 'GET',
      url: '/api/bands',
      success: indexBandSuccess,
      error: indexBandError
    });

    //Add an Band
    $('#add-band-form').on('submit', handleAddBandClick);

});


/**********
* RENDER BAND TEMPLATE *
**********/

// this function takes a single band and renders it to the page
function renderBands(bands) {

  console.log('rendering bands', bands);

  // pass the band into the template function
  var bandHtml = template({ bands: bands});
  // append html to the view
  $bandsList.append(bandHtml);

  //************* Add click handlers for each band button *********************

  //Delete band click handler
  // $('.delete-band-button').on('click', handleDeleteBandClick);
  //Update band click handler
  $('.update-band-button').on('click', handleUpdateBandClick);
  //Save band click handler
  $('.save-band-button').on('click', handleSaveChangesClick);
}


/**********
* CRUD Success/Error Handlers*
**********/

//Display Index of all the Bands in the Bands array
function indexBandSuccess(bands) {
  // debugger
  // // $bandsList.empty();
  // [].forEach.call(bands, function(band) {
  //   allBands[band._id] = band;
    renderBands(bands);

}
function indexBandError(e) {
  console.log('Error loading bands');
}


// On creation of a single Band, render it
function createBandSuccess(band) {
  $('#add-band-form input').val('');
  $('#add-band-form textarea').val('');
  allBands[band._id] = band;
  renderBands(allBands);
}
function createBandError(e) {
  console.log('Error creating band');
}


function deleteBandSuccess(band) {
  // $bandsList.empty();
  delete allBands[band._id];

  renderBands(allBands);
  // bands.forEach(function(band) {
  //   allBands[band._id] = band;
  //   renderBand(band);
  // });
}
function indexBandError(e) {
  console.log('Error loading bands');
}

// On error deletion of a single Band, render it
function deleteBandError(e) {
  console.log('Error deleting band');
}


/**********
* Click Handlers *
**********/

// What happens when the Add Band button is clicked
function handleAddBandClick(e) {
  e.preventDefault();
  $.ajax({
    method: 'POST',
    url: '/api/bands',
    data: $(this).serialize(),
    success: createBandSuccess,
    error: createBandError
  });
}
function deleteBand(element) {
  var bandId = $(element).data('band-id');
  $.ajax({
    method: 'DELETE',
    url: '/api/bands/' + bandId,
    success: deleteBandSuccess,
    error: deleteBandError
  });
  allBands[bandId] = null;
}
// On deletion of an Band, render new band list
function handleDeleteBandClick(e) {
  var $bandRow = $(this).closest('.band');
  var bandId = $bandRow.data('band-id');
  console.log('someone wants to delete band id=' + bandId );
  $.ajax({
    method: 'DELETE',
    url: '/api/bands/' + bandId,
    success: deleteBandSuccess,
    error: deleteBandError
  });
}

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
}

function handleUpdatedBandResponse(band) {
  console.log('response to update', band);

  var bandId = band._id;
  allBands[band._id] = band;
  // scratch this band from the page
  $('[data-band-id=' + bandId + ']').remove();
  // and then re-draw it with the updates ;-)
  renderBand(band);

  // BONUS: scroll the change into view ;-)
  // $('[data-band-id=' + bandId + ']')[0].scrollIntoView();
}

function handleUpdatedBandError(err) {
  console.log('Error updating band: ', err);
}
