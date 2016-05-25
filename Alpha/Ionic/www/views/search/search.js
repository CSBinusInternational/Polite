'Use Strict';
angular.module('App').controller('searchController', function ($scope, $ionicModal, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup, $firebaseObject, $firebaseArray, Auth, FURL, Utils) {
  var ref = new Firebase(FURL);
  var authData = ref.getAuth();
  $scope.uuid = authData.uid;
  $scope.temp = {searchText: ""};
  $scope.timestamp = new Date().getTime();
  $scope.pollingsaf = $firebaseObject(ref.child('pollings'));

  $ionicModal.fromTemplateUrl('views/home/polling.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function(chosenpollingkey) {
    $scope.openedPollingKey = chosenpollingkey;
    $scope.selectedpolling = $firebaseObject(ref.child('pollings').child(chosenpollingkey));
    $scope.myquestionset = $firebaseArray(ref.child('pollings').child(chosenpollingkey).child('questions'));
    $scope.myanswerset = $firebaseArray(ref.child('pollings').child(chosenpollingkey).child('answers').child('0').child('answerset'));
    console.log($scope.myanswerset);
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.submitPolling = function() {
    $scope.submissionData = {
        "uid" : $scope.uuid,
        "timestamp" : $scope.timestamp,
        "answerset" : $scope.myanswerset
    };
    console.log($scope.submissionData);
    $scope.finalRef = $firebaseArray(ref.child('pollings').child($scope.openedPollingKey).child('answers'));
    $scope.finalRef.$add($scope.submissionData).then(function() {
            $scope.closeModal();
    });
  }
}
);
