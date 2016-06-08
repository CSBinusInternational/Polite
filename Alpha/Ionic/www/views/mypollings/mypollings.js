'Use Strict';
angular.module('App').controller('myPollingsController', function ($scope, $ionicModal, $state ,$cordovaOauth, $localStorage, $location,$http,$ionicPopup, $firebaseObject, $firebaseArray, Auth, FURL, Utils,mypollkey) {
  var ref = new Firebase(FURL);
  var authData = ref.getAuth();
  $scope.uuid = authData.uid;
  $scope.temp = {searchText: ""};
  $scope.timestamp = new Date().getTime();

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

    $ionicModal.fromTemplateUrl('views/createpolling/createpolling.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function() {
      $scope.modal.show();
    };

    $scope.closeModal = function() {
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
      choices:["",""],
      questions:"",
      type:'radio'
    };
    $scope.thistemppollingque.$add(throwable);
    $scope.thistemppollingque.$save();
    //$scope.thistemppolling.$bindTo($scope, "dataa");
    console.log($scope.thistemppollingque);
    $scope.modal.show();
  };
  $scope.text = function(){
    var text_throwable = {
      questions:"",
      type:'text'
    };
    $scope.thistemppollingque.$add(text_throwable);
    $scope.thistemppollingque.$save();
    //$scope.thistemppolling.$bindTo($scope, "dataa");
    console.log($scope.thistemppollingque);
    $scope.modal.show();
  };

}
);
