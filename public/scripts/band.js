/**********
* GLOBAL BAND VARIABLES *
**********/

var template;
var allBands = {};
var allConcerts = {};
var bandConcerts= {};
var $bandSingle;
var $bandId;

//************* Document Ready *********************

$(document).ready(function() {

    // $('.add-concerts-button').on('click', handleAddConcertsToBandClick); test

    console.log('bands.js loaded!');

    // compile Concert List template
    compileSingleBandTemplate();

    showSingleBand();

});

function compileSingleBandTemplate() {
  $bandSingle = $('#single-band');
  var source = $('#band-single-template').html();
  template = Handlebars.compile(source);
}

function addClickHandlers() {
  //Show single band click handler
  // $('.show-single-band').on('click', handleSingleBandClick);
  //Delete band click handler
  $('.delete-band-button').on('click', handleDeleteBandClick);
  //Update band click handler
  $('.update-band-button').on('click', handleUpdateBandClick);
  //Save band click handler
  $('.save-band-button').on('click', handleSaveChangesClick);
  //Add Concerts to Band click handler
  $('.add-concerts-button').on('click', handleAddConcertsToBandClick);
}

/**********
* INDEX *
**********/

//Show a single concert
function showSingleBand() {
  console.log('hey there');
  console.log("id?: ", window.location);
  var url = window.location.pathname;
  console.log("the url", url);

  $.ajax({
    method: 'GET',
    url: "/api"+url,
    success: renderSingleBand,
    error: renderSingleBandError
  });
}
//Render a Band
function renderSingleBand (band) {
  console.log("Band passed back: ", band);
  //Set the object for the template
  // $bandId = band._id;
  var bandHtml = template({
    band: band
  });

  console.info('renderSingleBand band value: ', band);
  // append band list html to the view
  $bandSingle.html(bandHtml);
  addClickHandlers();
}
function renderSingleBandError(e) {
  console.log('Error loading bands');
}

// Get all Bands for updating on delete
function getBandList() {
  $.get('/api/bandsList').success( function(response) {
    $bands = response.bands;
    //Add bands to the hash map
    $bands.forEach( function(band) {
      allBands[band._id] = band;
    });
    console.log(allBands);
  });
}
