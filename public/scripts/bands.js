var template;
var $bandsList;
var allBands;

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
  console.log('rendering band');

  // pass the band into the template function
  var bandHtml = template({ band: band});

  // append html to the view
  $bandsList.append(bandHtml);
}

//Render all the bands in the Bands array
function handleBandSuccess(bands) {
  $bandsList.empty();
  console.log(bands);
  bands.forEach(function(band) {
    renderBand(band);
    $('.delete-band-button').on('click', handleDeleteBandClick);
  });
}

function handleBandError(e) {
  console.log('Error loading bands');
  $('#bandTarget').text('Failed to load bands, is the server working?');
}

// On creation of an Band, render it
function createBandSuccess(band) {
  $('#band-form input').val('');
  $('#band-form textarea').val('');
    renderBand(band);
    $('.delete-band-button').on('click', handleDeleteBandClick);

}
function createBandError(e) {
  console.log('Error creating band');
  $('#bandTarget').text('Failed to create band, is the server working?');
}


// On deletion of an Band, render new band list
function handleDeleteBandClick(e) {
  var bandId = $(this).attr('data-band-id');
  console.log('someone wants to delete band id=' + bandId );
  $.ajax({
    method: 'DELETE',
    url: '/api/bands/' + bandId,
    success: handleBandSuccess,
    error: deleteBandError
  });
}

function deleteBandError(e) {
  console.log('Error deleting band');
  $('#bandTarget').text('Failed to delete band, is the server working?');
}
