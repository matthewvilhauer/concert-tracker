
/**********
* GLOBAL BAND VARIABLES *
**********/

var template;
var $bandsList;
var $addBandForm;
var addBandFormTemplate;
var allBands = {};
var allConcerts = {};
var bandConcerts;


//************* Document Ready *********************

$(document).ready(function() {

    console.log('bands.js loaded!');

    // compile Concert List template
    compileBandListTemplate();
    // compile Add Band Form template
    compileAddBandFormTemplate();

    showBandList();
    showBandForm();

    // $bandsList = $('#bands');
    //
    // // compile handlebars template
    // var source = $('#band-template').html();
    // template = Handlebars.compile(source);
    //
    // renderBandIndex();
    //
    // //Add an Band
    // $('#add-band-form').on('submit', handleAddBandClick);
});

function compileBandListTemplate() {
  $bandsList = $('#bands');
  var source = $('#band-list-template').html();
  template = Handlebars.compile(source);
}
function compileAddBandFormTemplate() {
  $addBandForm = $('#add-band-form-container');
  var addBandForm = $('#add-band-form-template').html();
  addBandFormTemplate = Handlebars.compile(addBandForm);
}
function addClickHandlers() {
  //Show single band click handler
  $('.show-single-band').on('click', handleSingleBandClick);
  //Delete band click handler
  $('.delete-band-button').on('click', handleDeleteBandClick);
  //Update band click handler
  $('.update-band-button').on('click', handleUpdateBandClick);
  //Save band click handler
  $('.save-band-button').on('click', handleSaveChangesClick);
  //Add Concerts to Band click handler
  // $('.add-concerts-button').on('click', handleAddConcertsToBandClick);
}

/**********
* INDEX *
**********/

//Get all Bands
function showBandList() {
  $.get('/api/bandsList').success( function(response) {
    $bands = response.bands;
    $concerts = response.concerts;
    console.log("ShowBandList: "+$bands);
    console.log("ShowConcertList: "+$concerts);
    //Add bands to the hash map
    $bands.forEach( function(band) {
      // console.log(band.concerts);
      allBands[band._id] = band;
    });

    // $bands.forEach( function(band) {
    //   bandConcerts[band._id] = $concerts;
    // });
    //Add bands to the hash map
    $concerts.forEach( function(concert) {
      allConcerts[concert._id] = concert;
    });
    renderBandList(allBands, bandConcerts);
  });
}

//Render all Bands
function renderBandList (bands, bandConcerts) {
  //Empty the old list of bands
  //Set the object for the template
  var bandHtml = template({
    bands: allBands,
    concerts: bandConcerts
  });

  console.info('renderBandList allBands value: ', allBands);
  // append band list html to the view
  $bandsList.html(bandHtml);
  addClickHandlers();
}
function renderBandListError(e) {
  console.log('Error loading bands');
}

/**********
* SHOW BAND FORM *
**********/

//Get the add band form
function showBandForm() {
  $.get('/api/concerts').success( function(concerts) {
    console.log("Retrieved concerts for form: ", concerts);
    concerts.forEach( function(concert) {
      allConcerts[concert._id] = concert;
    });
    renderAddBandForm(allConcerts);
  });
}
//Render the Add Band Form
function renderAddBandForm (concerts) {

  // pass the concerts into the Add Band template function
  var addBandFormHtml = addBandFormTemplate({
    concerts: allConcerts
  });
  $addBandForm.html(addBandFormHtml);
  console.info("Added Add Band Form to the page!");
}
function renderAddBandFormError(e) {
  console.log('Error loading concerts');
}


/**********
* CREATE *
**********/

// Send the new band data to the server when the Add Concert button is clicked

function handleAddBandClick() {
  var formData = $('#add-band-form').serialize();

  console.log("Form data to be added: ", formData);

  $.ajax({
    method: 'POST',
    url: '/api/bands',
    data: formData,
    success: createBand,
    error: createBandError
  });
}
// On creation of a single Band, re-render the list of bands
function createBand(band) {

  console.log("Band: ", band);

  $('#add-band-form input').val('');
  $('#add-band-form textarea').val('');

  allBands[band._id] = band;

  renderBandList(allBands);

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

  console.log('someone wants to delete band id=' + bandId );
  console.log("On handleDeleteBandClick allBands value: ", allBands);

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

  renderBandList(allBands);

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
  // hide the add concerts button
  $(this).parent().find('.add-concerts-button').toggleClass('hidden');

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
  var concerts = $bandRow.find('span.band-concerts').val();
  $bandRow.find('span.band-concerts').html('<input class="update-band update-band-concerts" value="' + concerts + '"></input>');
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
    concerts: $bandRow.find('.update-band-concerts').val(),
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

  renderBandList(allBands);

  // BONUS: scroll the change into view ;-)
  $('[data-band-id=' + bandId + ']')[0].scrollIntoView();
}
function handleUpdatedBandError(err) {
  console.log('Error updating band: ', err);
}

// when the add concerts button is clicked, display the modal
// function handleAddConcertsToBandClick(e) {
//   console.log('add-concerts clicked!');
//   var currentBandId = $(this).closest('.band').data('band-id'); // "5665ff1678209c64e51b4e7b"
//   console.log('id',currentBandId);
//   $('#addConcertsToBandModal').data('band-id', currentBandId);
//   $('#addConcertsToBandModal').modal('show');  // display the modal!
// }
