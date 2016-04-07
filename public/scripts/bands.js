
var template;
var $bandsList;
var allBands;

$(document).ready(function() {

    console.log('bands.js loaded!');

    $bandsList = $('#bands');

    // compile handlebars template
    var source = $('#band').html();
    template = Handlebars.compile(source);

    //Get all Bands
    $.ajax({
      method: 'GET',
      url: '/api/bands',
      success: handleBandSuccess,
      error: handleBandError
    });

    //Add an Band
    $('#band-form').on('submit', function(e) {
      e.preventDefault();
      $.ajax({
        method: 'POST',
        url: '/api/bands',
        data: $(this).serialize(),
        success: createBandSuccess,
        error: createBandError
      });
    });

});

// this function takes a single band and renders it to the page
function renderBand(band) {

  // var $concerts = band.concerts;

  console.log('rendering band');
  // $bandsList.empty();
  // pass `allSnippets` into the template function
  var bandHtml = template({ band: band});

  // append html to the view
  $bandsList.prepend(bandHtml);
  //$('#add-songs').append(songsFormatted);
}


//Render all the bands in the Bands array
function handleBandSuccess(bands) {
  bands.forEach(function(band) {
    renderBand(band);
  });
}
function handleBandError(e) {
  console.log('Error loading bands');
  $('#bandTarget').text('Failed to load bands, is the server working?');
}

// On creation of an Album, render it
function createBandSuccess(band) {
    renderBand(band);
}
function createBandError(e) {
  console.log('Error creating band');
  $('#bandTarget').text('Failed to create band, is the server working?');
}
