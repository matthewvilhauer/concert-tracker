
var userId = location.pathname.split('/').pop();


//************* Document Ready *********************

$(document).ready(function() {

    console.log('user.js loaded!');

    console.log("User: "+userId);

    $.get('/api/users/'+userId).success( function(response) {
      window.userId = response._id;
      window.user = response;
      localStorage.setItem('userId', response._id);
      localStorage.setItem('user', JSON.stringify(response));
    });

    $(".update-profile-button").on('click', handleUpdateProfileClick);
    $(".save-profile-button").on('click', handleSaveProfileClick);

});


function renderPage() {
  $.get('/api/users/:userId').success( function(response) {
    var currentUser = response.user;
    var myConcerts = response.userConcerts;

    $('.user-concerts').val(myConcerts);
    $('.user-concerts').append('<div class="currentuser">'+currentUser+'</div>');

  });
}


/**********
* UPDATE *
**********/

// when the Edit button is clicked
function handleUpdateProfileClick(e) {
  var $profile = $('.profile');

  console.log('edit profile', userId);

  // show the save changes button
  $(this).parent().find('.save-profile-button').toggleClass('hidden');
  // hide the edit button
  $(this).parent().find('.update-profile-button').toggleClass('hidden');

  $('.edit-profile-image').toggleClass('hidden');

  // get the profile attributes and replace their fields with an input element
  var username = $profile.find('span.profile-username').text();
  $profile.find('span.profile-username').html('<input class="update-profile-fields update-profile-username" value="' + username + '"></input>');
  var email = $profile.find('span.profile-email').text();
  $profile.find('span.profile-email').html('<input class="update-profile-fields update-profile-email" value="' + email + '"></input>');
  var firstName = $profile.find('span.profile-firstName').text();
  $profile.find('span.profile-firstName').html('<input class="update-profile-fields update-profile-firstName" value="' + firstName + '"></input>');
  var lastName = $profile.find('span.profile-lastName').text();
  $profile.find('span.profile-lastName').html('<input class="update-profile-fields update-profile-lastName" value="' + lastName + '"></input>');
  var image_url = $profile.find('span.profile-image-url').text();
  $profile.find('span.profile-image-url').html('<input class="update-profile-fields update-profile-image-url" value="' + image_url + '"></input>');
  // var concerts = $profile.find('span.user-concerts').val();
}

// after editing an profile, when the save changes button is clicked
function handleSaveProfileClick(e) {
  var $profile = $('.profile');
  // var userId = $(this).parents('.profile').data('profile-id'); // $(this).closest would have worked fine too
  // var $profile = $('[data-profile-id=' + profileId + ']');

  var data = {
    userId: userId,
    username: $profile.find('.update-profile-username').val(),
    email: $profile.find('.update-profile-email').val(),
    firstName: $profile.find('.update-profile-firstName').val(),
    lastName: $profile.find('.update-profile-lastName').val(),
    image: $profile.find('.update-profile-image-url').val(),
    // concerts: $profile.find('span.user-concerts').val()
  };
  console.log('PUTing data for profile', userId, 'with data:', data);

  $.ajax({
    method: 'PUT',
    url: '/api/users/' + userId,
    data: data,
    success: handleUpdatedProfileResponse,
    error: handleUpdatedProfileError
  });
}

function handleUpdatedProfileResponse(profile) {
  // $('.profile-image-column').toggleClass('hidden');
  console.log('response to update', profile);

  location.reload();

}
function handleUpdatedProfileError(err) {
  console.log('Error updating profile: ', err);
}
