'Use Strict';
angular.module('App').controller('myPollingSummaryController', function ($scope, $ionicModal, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup, $firebaseObject, $firebaseArray, Auth, FURL, Utils,mypollkey) {
  var ref = new Firebase(FURL);
  var authData = ref.getAuth();
  $scope.uuid = authData.uid;

  $scope.currentPollingKey = mypollkey.currentValue;
  var indexNum = $scope.currentPollingKey;
  var indexString = indexNum.toString();
  $scope.currentPolling =  $firebaseObject(ref.child('pollings').child(indexString));
});
