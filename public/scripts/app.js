//
// var $userProfile = {};
//
// $(document).ready(function() {
//
//     console.log('app.js loaded!');
//
//     var $userId = window.user._id;
//     console.log("User: "+$userId);
//
//     makeProfileLink($userId);
//     getDbProfile($userId);
//
// });
//
// function getDbProfile(id) {
//   $.get('/api/users/'+id).success( function(response) {
//
//     var $userProfile = {
//       userId: response._id,
//       username: response.username
//
//     };
//
//
//
//     console.log("User: " + $userProfile);
//   });
// }
//
// function makeProfileLink(id) {
//   var userId = id;
//   $('.profile-link').html('<a href="users/'+userId+'">My Profile</a>');
// }
