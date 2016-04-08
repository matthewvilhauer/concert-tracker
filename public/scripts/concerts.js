
var template;
var $concertsList;
var allConcerts;

$(document).ready(function() {

    console.log('concerts.js loaded!');

    $concertsList = $('#concerts');

    // compile handlebars template
    var source = $('#concert-template').html();
    template = Handlebars.compile(source);

    //Get all Concerts
    $.ajax({
      method: 'GET',
      url: '/api/concerts',
      success: handleConcertSuccess,
      error: handleConcertError
    });

    //Add an Concert
    $('#concert-form').on('submit', function(e) {
      e.preventDefault();
      $.ajax({
        method: 'POST',
        url: '/api/concerts',
        data: $(this).serialize(),
        success: createConcertSuccess,
        error: createConcertError
      });
    });

  });

  // this function takes a single concert and renders it to the page
  function renderConcert(concert) {
    console.log('rendering concert');
    //$concertsList.empty();
    // pass `allSnippets` into the template function
    var concertHtml = template({ concert: concert});

    // append html to the view
    $concertsList.append(concertHtml);

  }


  //Render all the concerts in the Concerts array
  function handleConcertSuccess(concerts) {
    $concertsList.empty();

    concerts.forEach(function(concert) {
      renderConcert(concert);
      $('.delete-concert-button').on('click', handleDeleteConcertClick);
    });
  }

  function handleConcertError(e) {
    console.log('Error loading concerts');
    $('#concertTarget').text('Failed to load concerts, is the server working?');
  }

  // On creation of an Concert, render it
  function createConcertSuccess(concert) {
    $('#concert-form input').val('');
    $('#concert-form textarea').val('');
      renderConcert(concert);
      $('.delete-concert-button').on('click', handleDeleteConcertClick);

  }
  function createConcertError(e) {
    console.log('Error creating concert');
    $('#concertTarget').text('Failed to create concert, is the server working?');
  }

  // On deletion of an Concert, render new concert list
  function handleDeleteConcertClick(e) {
    var concertId = $(this).attr('data-concert-id');
    console.log('someone wants to delete concert id=' + concertId );
    $.ajax({
      method: 'DELETE',
      url: '/api/concerts/' + concertId,
      success: handleConcertSuccess,
      error: deleteConcertError
    });
  }

  function deleteConcertError(e) {
    console.log('Error deleting concert');
    $('#concertTarget').text('Failed to delete concert, is the server working?');
  }
