'Use Strict';
angular.module('App').controller('myPollingsController', function ($scope, $ionicModal, $state ,$cordovaOauth, $localStorage, $location,$http,$ionicPopup, $firebaseObject, $firebaseArray,$firebaseUtils, Auth, FURL, Utils,mypollkey) {
  var ref = new Firebase(FURL);
  var authData = ref.getAuth();
  $scope.uuid = authData.uid;
  $scope.temp = {searchText: ""};
  $scope.timestamp = new Date().getTime();
  $scope.date1 = new Date($scope.timestamp);
  console.log("Current timestamp : " + $scope.date1);
  $scope.getPollDate = function(stamp) {
    var rvalue = new Date(stamp);
    return rvalue;
  }

  $scope.pollingsaf =  $firebaseObject(ref.child('pollings'));
  $scope.temppollingsaf = $firebaseObject(ref.child('temppollings'));
  $scope.getDisplayName = function() {
      if (authData.provider=='facebook') {
          return authData.facebook.displayName;
      }
      else if (authData.provider=='google') {
        return authData.google.displayName;
      }
      else {
        return $localStorage.fullName;
      }
  };

  $scope.viewSummary = function(key) {
    mypollkey.currentValue=key;
    $state.go('app.mypollingsummary');
  };

  $scope.showPopup = function(){
    $scope.dataa = {
      answers :new Object(),
      questions : new Array(),
      deadline : "new Date().getTime()",
      visibility : "public",
      description:"",
      ownerName:null,
      title:null,
      userid:null
    };
    var myPopup = $ionicPopup.show({
      template: '<input name="txtpollname" type="text" ng-model="dataa.title" placeholder="Polling Name">',
      title: 'Create New Polling',
      subTitle: '',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Create</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.dataa.title) {
              e.preventDefault();
            } else {
              return $scope.openModal();
            }
          }
        }, ]
    });
    myPopup.then(function(res) {
      console.log('Tapped!', res);
      $scope.dataa.ownerName = $scope.getDisplayName();
      $scope.dataa.userid = $scope.uuid;
      console.log($scope.dataa.title);
      console.log($scope.dataa);
      var reftemp = ref.child('temppollings');
      $scope.temppollingsarray = $firebaseArray(reftemp);
      $scope.temppollingsarray.$add($scope.dataa).then(function(reftemp) {
          $scope.thistemppolling = $firebaseObject(ref.child('temppollings').child(reftemp.key()));
          $scope.thistemppollingque = $firebaseArray(ref.child('temppollings').child(reftemp.key()).child('questions'));
          $scope.thistemppollingque_obj = $firebaseObject(ref.child('temppollings').child(reftemp.key()).child('questions'));
          $scope.polingref = ref.child('temppollings').child(reftemp.key());
          $scope.questionref = ref.child('temppollings').child(reftemp.key()).child('questions');
              /*console.log(reftemp.key());
              console.log($scope.thistemppolling);
              console.log("Added successfully!");*/
      });
      console.log($scope.dataa);
    });
  };

  //ini gw edit tambahin distribute + analyze
    $ionicModal.fromTemplateUrl('views/createpolling/createpolling.html', {
      scope: $scope,
      animation: 'slide-in-left'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function() {
      $scope.modal.show();
      $scope.distributeModal.hide();
      $scope.analyzeModal.hide();
    };

    $scope.closeModal = function(){
      $scope.modal.hide();
      $scope.distributeModal.hide();
      $scope.analyzeModal.hide();
    };

    $ionicModal.fromTemplateUrl('views/distributepolling/distributepolling.html',{
      scope: $scope,
      animation:'slide-in-left'
    }).then(function(distributeModal){
      $scope.distributeModal = distributeModal;
    });

    $scope.openDistribute = function(){
      /*Date Picker*/
      var now = new Date(),
          tzo = -now.getTimezoneOffset(),
          dif = tzo >= 0 ? '+' : '-',
          pad = function(num) {
            var norm = Math.abs(Math.floor(num));
            return (norm < 10 ? '0' : '') + norm;
          };
      var tempcurr = now.getFullYear()
          + '-' + pad(now.getMonth()+1)
          + '-' + pad(now.getDate())
          + 'T' + pad(now.getHours())
          + ':' + pad(now.getMinutes())
          + ':' + pad(now.getSeconds());
      $scope.currdate =  new Date(now.getFullYear(),pad(now.getMonth()+1),pad(now.getDate()),pad(now.getHours()),pad(now.getMinutes()),pad(now.getSeconds()),0);
      var deadlineObj = new $firebaseObject($scope.polingref.child('deadline'));
      deadlineObj.$value = $scope.currdate.getTime();
      deadlineObj.$save();
      $scope.distributeModal.show();
      $scope.modal.hide();
      $scope.analyzeModal.hide();
    };

    $ionicModal.fromTemplateUrl('views/analyzepolling/analyzepolling.html',{
      scope: $scope,
      animation:'slide-in-left'
    }).then(function(analyzeModal){
      $scope.analyzeModal = analyzeModal;
    });

    $scope.openAnalyze = function(){
      $scope.analyzeModal.show();
      $scope.distributeModal.hide();
      $scope.modal.hide();
    };
  // createChoice is actually list of questions!
  //$scope.createChoice = [];

// Initialize number of choices in MCQ!
  //$scope.mychoices=[0,1];
//  $scope.numchoices = 2;

  $scope.addAnswer = function(arrayindex){
    //$scope.createChoice[arrayindex].choices.push(null);
    var currentarr = $firebaseArray($scope.questionref.child(arrayindex).child('choices'));
    currentarr.$add("");
    $scope.thistemppollingque.$save();
    //$scope.thistemppolling.$bindTo($scope, "dataa");
    //$scope.dataa.questions[arrayindex].choices.push("");
    console.log($scope.thistemppollingque);
    $scope.modal.show();
  };

  $scope.mcq = function(){
    var throwable = {
      choices:[],
      question:"",
      type:'radio',
      multipleanswer:false,
      mandatory:false
    };
    $scope.thistemppollingque.$add(throwable);
    $scope.thistemppollingque.$save();
    //$scope.thistemppolling.$bindTo($scope, "dataa");
    console.log($scope.thistemppollingque);
    $scope.modal.show();
  };
  $scope.text = function(){
    var text_throwable = {
      question:"",
      type:'text',
      mandatory:false
    };
    $scope.thistemppollingque.$add(text_throwable);
    $scope.thistemppollingque.$save();
    //$scope.thistemppolling.$bindTo($scope, "dataa");
    console.log($scope.thistemppollingque);
    $scope.modal.show();
  };

  $scope.editPolling = function(associatedkey) {
      $scope.thistemppolling = $firebaseObject(ref.child('temppollings').child(associatedkey));
      $scope.thistemppollingque = $firebaseArray(ref.child('temppollings').child(associatedkey).child('questions'));
      $scope.thistemppollingque_obj = $firebaseObject(ref.child('temppollings').child(associatedkey).child('questions'));
      $scope.polingref = ref.child('temppollings').child(associatedkey);
      $scope.questionref = ref.child('temppollings').child(associatedkey).child('questions');
      $scope.openModal();
  };

  $scope.changeMCQ = function (outerkey, innerkey,cho) {
    var tempobj= new $firebaseObject($scope.questionref.child(outerkey).child('choices').child(innerkey));
    //console.log(tempref);
  tempobj.$value = cho;
  tempobj.$save();
  };

  $scope.changeDescription = function (newdescription) {
    var descriptionObj = new $firebaseObject($scope.polingref.child('description'));
    descriptionObj.$value = newdescription;
    descriptionObj.$save();
  };

  $scope.changeMultipleAnswer = function (newBool,okey) {
    console.log(newBool);
    console.log(okey);
    var multipleanswerObj = new $firebaseObject($scope.questionref.child(okey).child('multipleanswer'));
    console.log("question object : " + $scope.questionref.child(okey).child('multipleanswer'));
    multipleanswerObj.$loaded().then(function(data) {
      multipleanswerObj.$value=newBool;
      multipleanswerObj.$save();
    });

    var typeObj = new $firebaseObject($scope.questionref.child(okey).child('type'));
    console.log("type object : "+$scope.questionref.child(okey).child('type'));
    typeObj.$loaded().then(function(data) {
      if (newBool==true) {
        typeObj.$value="checkbox";
      }
      else {
        typeObj.$value="radio";
      }
      typeObj.$save();
    });
  };
  $scope.deleteQuestion = function (pollingkey) {
    var deletedObj = new $firebaseObject($scope.questionref.child(pollingkey));
    deletedObj.$remove();
  };

  /*$scope.deleteOption = function (outerkey,innerkey) {
    console.log("outer key : "+outerkey);
    console.log("inner key : "+innerkey);
    var choicesList = new $firebaseArray($scope.questionref.child(outerkey).child('choices'));
    choicesList.$loaded().then(function(data) {
      var item = choicesList[innerkey];
      choicesList.$remove(item);
    });

  };
  */
  $scope.deleteLatestChoices = function (akey) {
    var choiceArr = new $firebaseArray($scope.questionref.child(akey).child('choices'));
    var latestkey;
    // find the latest key O(n). Make it efficient later
    choiceArr.$loaded()
    .then(function(data){
        angular.forEach(data, function(value, key) {
            latestkey = key;
        //    console.log("key : " + key);
        })
    });
    var choicesList = new $firebaseArray($scope.questionref.child(akey).child('choices'));
    choicesList.$loaded().then(function(data) {
      //console.log("latest key : "+latestkey);
      //console.log(choicesList);
      var item = choicesList[latestkey];
      choicesList.$remove(item);
    });

  };

  $scope.distributePoll = function() {
      var temppollingObj = $scope.thistemppolling;
      console.log("Temp Polling Object : " + temppollingObj);
      var deadlineObj = new $firebaseObject($scope.polingref.child('deadline'));
      deadlineObj.$loaded().then(function(){
        var val = $scope.currdate.getTime();
        deadlineObj.$value = val;
        deadlineObj.$save();
        var pollingsparentArr = $firebaseArray(ref.child('pollings'));
        pollingsparentArr.$loaded().then(function(){
          console.log("Pollings reference Array : " + pollingsparentArr);
          pollingsparentArr.$add(temppollingObj);
          pollingsparentArr.$save();
          temppollingObj.$remove();
        });
      });
      $scope.analyzeModal.hide();
      $scope.distributeModal.hide();
      $scope.modal.hide();
      var successPopup = $ionicPopup.alert({
         title: 'Polling Distribution Success',
         template: 'Your polling has been successfully published'
      });
  };
  /*
    trashclick kalo trash di 1 item divider di pencet, yg kena effect cuma 1 tempaat itu doang 2 yg lain engga.
   */
  $scope.selectItem = false;
  $scope.trashclick = function(){
    $scope.selectItem = true;
  };
}
);
