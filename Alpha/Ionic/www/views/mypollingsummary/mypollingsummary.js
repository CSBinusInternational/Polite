'Use Strict';
angular.module('App').controller('myPollingSummaryCtrl', function ($scope, $ionicModal, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup, $firebaseObject, $firebaseArray, Auth, FURL, Utils) {
  var ref = new Firebase(FURL);
  var authData = ref.getAuth();
  $scope.uuid = authData.uid;

});
