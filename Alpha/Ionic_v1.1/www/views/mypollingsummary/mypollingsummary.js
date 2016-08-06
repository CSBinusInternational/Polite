'Use Strict';
angular.module('App').controller('myPollingSummaryController', function ($scope, $ionicModal, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup, $firebaseObject, $firebaseArray, Auth, FURL, Utils,mypollkey) {
  var ref = new Firebase(FURL);
  var authData = ref.getAuth();
  $scope.uuid = authData.uid;

  $scope.currentPollingKey = mypollkey.currentValue;
  var indexNum = $scope.currentPollingKey;
  var indexString = indexNum.toString();
  $scope.currentPolling =  $firebaseObject(ref.child('pollings').child(indexString));
  $scope.pollReference = ref.child('pollings').child(indexString);
  $scope.getTotalResponses = function() {
    var sum = 0;
    angular.forEach($scope.currentPolling.answers, function(value,key) {
      sum +=1;
    });
    return sum;
  };

  $scope.getTotalQuestions = function() {
    var sum = 0;
    angular.forEach($scope.currentPolling.questions, function(value,key) {
      sum +=1;
    });
    return sum;
  };
  //$scope.currentAnswerSet = $firebaseArray(ref.child('pollings').child(indexString).child('answers'));
  //$scope.questionObj = $firebaseObject(ref.child('pollings').child(indexString).child('questions'));

  // Setting up answer array (2D, O(n^2)), each index represents a questions
  $scope.answerArray = [];
  var totalque = $scope.getTotalQuestions();
  console.log("Total que : " + totalque);
  var totalres = $scope.getTotalResponses();
  console.log("Total res : " + totalres);
  for (var i=0;i<100;i++) {
      $scope.answerArray[i] = new Array();
      for (var j=0;j<100;j++) {
          $scope.answerArray[i][j] = "This is a test";
      }
  }
  console.log("Initialize Answer Array : " + $scope.answerArray[1][0]);

  $scope.answersObj = $firebaseObject(ref.child('pollings').child(indexString).child('answers'));
  $scope.answersObj.$loaded().then(function(){
    var ctr = 0;
    angular.forEach($scope.answersObj, function(value,key) {
        var innerctr = 0;
        console.log("Current value : " + value);
        console.log("Current key : " + key);
        angular.forEach(value.answerset, function(innervalue,innerkey) {
            console.log("Current inner value : " + innervalue);
            $scope.answerArray[innerctr][ctr] = innervalue;
            innerctr+=1;
        });
        ctr+=1;
    });
    console.log("Answer Array : " + $scope.answerArray[1][0]);
  });

  $ionicModal.fromTemplateUrl('views/mypollingsummary/analysis.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.show();
  };

  $scope.closeModal = function(){
    $scope.modal.hide();
  };

  $scope.openAnalysis = function() {
      $scope.openModal();
  };

  $scope.getDeadline = function(deadlinedate) {
      var temp = new Date(deadlinedate);
      return temp;
  };


});
