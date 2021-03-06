'Use Strict';
angular.module('App').controller('searchController', function ($scope, $ionicModal, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup, $firebaseObject, $firebaseArray, Auth, FURL, Utils) {
  console.log("Home Controller!");
  var ref = new Firebase(FURL);
  var authData = ref.getAuth();
  $scope.uuid = authData.uid;
  $scope.temp = {searchText:""};
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
    //$scope.questionref = ref.child('pollings').child(chosenpollingkey).child('questions');
    $scope.myanswerset = [];
    $scope.myquestionset.$loaded()
    .then(function(data){
        angular.forEach(data, function(value, key) {
            console.log("Value Type : " + value.type);
            console.log("Key : " + key);
            if (value.type=="radio") {
              $scope.tempradio = [];
              angular.forEach(value.type.choices, function(cvalue,ckey) {
                $scope.tempradio.push(false);
              });
              $scope.myanswerset.push($scope.tempradio);
            }
            if (value.type=="checkbox") {
              $scope.tempcheckbox = [];
              angular.forEach(value.type.choices, function(cvalue,ckey) {
                $scope.tempcheckbox.push(false);
              });
              $scope.myanswerset.push($scope.tempcheckbox);
            }
            if (value.type=="range") {
              $scope.temprange = [];
              angular.forEach(value.type.steps, function(cvalue,ckey) {
                $scope.temprange.push(false);
              });
              $scope.myanswerset.push($scope.temprange);
            }
            if (value.type=="text") {
              $scope.myanswerset.push("");
            }
        })
    });
    //$scope.myanswerset = $firebaseArray(ref.child('pollings').child(chosenpollingkey).child('answers').child('0').child('answerset'));
    console.log("The answer set array : "+$scope.myanswerset);
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.getMandatoryIndicator = function(isMandatory) {
      if (isMandatory) {
        return "*";
      }
      else {
        return "";
      }
  };

  $scope.submitPolling = function() {
    $scope.submissionData = {
        "uid" : $scope.uuid,
        "timestamp" : $scope.timestamp,
        "answerset" : $scope.myanswerset
    };
    console.log($scope.submissionData);
    var isPopup = false;
    angular.forEach($scope.myanswerset, function(value,key) {
        if (value===null || value=="") {
            isPopup = true;
        }
    });
    if (isPopup) {
      var mandatoryPopup = $ionicPopup.alert({
         title: 'Warning',
         template: 'Please fill all of the mandatory fields'
      });
    }
    else {
      $scope.finalRef = $firebaseArray(ref.child('pollings').child($scope.openedPollingKey).child('answers'));
      $scope.finalRef.$add($scope.submissionData).then(function() {
              $scope.closeModal();
      });
    }

  }
}
);
