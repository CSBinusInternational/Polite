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
  $scope.currentPolling.$loaded().then(function(data) {
    var totalque = 0;
    angular.forEach($scope.currentPolling.questions, function(value,key) {
      totalque +=1;
    });
    console.log("Total que : " + totalque);
    var totalres = 0;
    angular.forEach($scope.currentPolling.answers, function(value,key) {
      totalres +=1;
    });
    $scope.totalResponse = totalres;
    $scope.totalQuestion = totalque;
    console.log("Total response : " + $scope.totalResponse);
    console.log("Total question : "+ $scope.totalQuestion);
    var i=0;
    var j=0;
    for (i=0;i<$scope.totalQuestion;i++) {
        $scope.answerArray[i] = new Array();
        for (j=0;j<$scope.totalResponse;j++) {
            $scope.answerArray[i][j] = "";
        }
    }
    //console.log("Initialize Answer Array : " + $scope.answerArray[1][0]);
    $scope.answersObj = $firebaseObject(ref.child('pollings').child(indexString).child('answers'));
    $scope.answersObj.$loaded().then(function(){
      var ctr = 0;

      $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
      $scope.info = [300, 500, 100];


      angular.forEach($scope.answersObj, function(value,key) {
          var innerctr = 0;
          console.log("Current value : " + value);
          console.log("Current key : " + key);
          angular.forEach(value.answerset, function(innervalue,innerkey) {
              console.log("Current inner value : " + innervalue);
              $scope.answerArray[innerctr][ctr] = innervalue;
              // [questions][response_number] -> each question type is a row
              innerctr+=1;
          });
          ctr+=1;
      });
      //console.log("Answer Array : " + $scope.answerArray[1][0]);
    });
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
