'Use Strict';
angular.module('App').controller('homeController', function ($scope, $ionicModal, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup, $firebaseObject, $firebaseArray, Auth, FURL, Utils) {
  console.log("Home Controller!");
  var ref = new Firebase(FURL);
  var authData = ref.getAuth();
  $scope.uuid = authData.uid;
  /*$scope.result = {
    "user":"",
    "pollings": $scope.pollings[openedPollingId-1],

  }
  $scope.addAnswer = function(){
    $scope.todo.push({answer:scope.})
  } */
  $scope.timestamp = new Date().getTime();
  $scope.pollingsaf =  $firebaseArray(ref.child('pollings'));
  

  $ionicModal.fromTemplateUrl('views/home/polling.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function(chosenpolling) {
    $scope.openedPollingId = chosenpolling;
    $scope.myanswerset = $scope.pollingsaf[chosenpolling-1].answers[0].answerset;
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
    var indexNum = $scope.openedPollingId-1;
    var indexString = indexNum.toString();
    $scope.finalRef = $firebaseArray(ref.child('pollings').child(indexString).child('answers'));
    console.log($scope.finalRef);
    $scope.finalRef.$add($scope.submissionData).then(function() {
            $scope.closeModal();
    });
  }
}
);
