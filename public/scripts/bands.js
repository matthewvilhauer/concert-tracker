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

    $bandsList.on('click', '.delete-band-button', handleDeleteBandClick);

    // $bandsList.on('click', '.delete-band-button', function() {
    //   bandIdentification = $(this).attr('data-band-id');
    //   console.log(bandIdentification);
    //   $.ajax({
    //     method: 'DELETE',
    //     url: '/api/bands/'+$(this).attr('data-band-id'),
    //     success: deleteBandSuccess,
    //     error: deleteBandError
    //   });
    // });

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

// On creation of an Band, render it
function createBandSuccess(band) {
  $('#band-form input').val('');
  $('#band-form textarea').val('');
    renderBand(band);
}
function createBandError(e) {
  console.log('Error creating band');
  $('#bandTarget').text('Failed to create band, is the server working?');
}



function handleDeleteBandClick(e) {
  var bandId = $(this).attr('data-band-id');
  console.log('someone wants to delete band id=' + bandId );
  $.ajax({
    method: 'DELETE',
    url: '/api/bands/' + bandId,
    success: handleDeleteBandSuccess,
    error: deleteBandError
  });
}

// callback after DELETE /api/bands/:id
function handleDeleteBandSuccess(data) {
  $bandsList.empty();
  console.log("Return data: " + data);
  deleteBandRender(data);
}

function deleteBandError(e) {
  console.log('Error deleting band');
  $('#bandTarget').text('Failed to delete band, is the server working?');
}

//Render all the bands in the Bands array
function deleteBandRender(bands) {
  bands.forEach(function(band) {
    renderDeletedBand(band);
  });
}

function renderDeletedBand(band) {

  // var $concerts = band.concerts;

  console.log('rendering new band list');
  // $bandsList.empty();
  // pass `allSnippets` into the template function
  var bandHtml = template({ band: band});

  // append html to the view
  $bandsList.prepend(bandHtml);
  //$('#add-songs').append(songsFormatted);
}
