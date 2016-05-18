'Use Strict';
angular.module('App').controller('myProfileController', function ($scope, $ionicModal, $localStorage, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup, $firebaseObject, $firebaseArray, Auth, FURL, Utils) {
  var ref = new Firebase(FURL);
  var authData = ref.getAuth();
  $scope.uuid = authData.uid;
  $scope.emailadr = $localStorage.email;

});
