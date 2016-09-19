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
  $scope.questionArray = [];
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
    var totalchoices = [];
    var choctr =0;
    angular.forEach($scope.currentPolling.questions, function(value,key){
      totalchoices[choctr] = 0;
      angular.forEach(value.choices, function(innervalue,innerkey){
        totalchoices[choctr] +=1;
      });
      choctr+=1;
    });
    $scope.totalChoices = totalchoices;
    $scope.totalResponse = totalres;
    $scope.totalQuestion = totalque;
    console.log("total choices : "+ $scope.totalChoices);
    console.log("Total response : " + $scope.totalResponse);
    console.log("Total question : "+ $scope.totalQuestion);
    var i=0;
    var j=0;
    for (i=0;i<$scope.totalQuestion;i++) {
      $scope.answerArray[i] = new Array();
      $scope.questionArray[i] = new Array();
        for (j=0;j<$scope.totalChoices[i];j++) {
          $scope.answerArray[i][j] = 0;
          $scope.questionArray[i][j] = "";
        }
      if($scope.totalChoices[i] == 0){
        for(j = 0 ; j < $scope.totalResponse;j++)
        $scope.answerArray[i][j] = "";
      }
    }

  });

  $scope.questionsObj = $firebaseObject(ref.child('pollings').child(indexString).child('questions'));
  $scope.questionsObj.$loaded().then(function(){
    var ctr = 0;
    $scope.typeCheck = new Array();
    angular.forEach($scope.questionsObj, function(value,key){
      var innerctr= 0;
      $scope.typeCheck[ctr] = value.type;
      console.log($scope.typeCheck[ctr]);
      angular.forEach(value.choices, function(innervalue, innerkey) {
        $scope.questionArray[ctr][innerctr] = innervalue;
        innerctr+=1;
      });
      ctr+=1;
    });
  });

  //console.log("Initialize Answer Array : " + $scope.answerArray[1][0]);
  $scope.answersObj = $firebaseObject(ref.child('pollings').child(indexString).child('answers'));
  $scope.answersObj.$loaded().then(function(){
    var ctr = 0;
    angular.forEach($scope.answersObj, function(value,key) {
        var innerctr = 0;
        angular.forEach(value.answerset, function(innervalue,innerkey) {
          if(typeof innervalue == 'string'){
            $scope.answerArray[innerctr][ctr] = innervalue;
            console.log("ctr : "+ ctr);
          }
          else if(isNaN(innervalue)){
            for(var i = $scope.answerArray[innerctr].length; i > 1; i--){
              if(i == $scope.answerArray[innerctr].length){
                $scope.answerArray[innerctr][0] = new Array();
              }
              $scope.answerArray[innerctr].pop();
            }
            angular.forEach(value.answerset[innerkey], function(deepvalue, deepkey){
              if(deepvalue == true){
                for(i = 0 ;isNaN( $scope.answerArray[innerctr][0][i]) && i < $scope.totalChoices[innerctr];i++){
                  $scope.answerArray[innerctr][0][i] = 0;
                }
                $scope.answerArray[innerctr][0][deepkey] +=1;
              }
            });
          }
          else {
            $scope.answerArray[innerctr][innervalue - 1] += 1;
          }
          console.log("Kantong : "+$scope.answerArray[innerctr]);
          innerctr+=1;
        });
      console.log("---");
        ctr+=1;
    });
    //console.log("Answer Array : " + $scope.answerArray[1][0]);
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
    deadlinedate = deadlinedate.toString();
    var year = deadlinedate.substr(0,4);
    var month = deadlinedate.substr(4,2);
    var day = deadlinedate.substr(6,2);
    var hour = deadlinedate.substr(8,2);
    var minute = deadlinedate.substr(10,2);
    var temp = new Date(year,month,day,hour,minute,0);
    return temp;
  };


});
