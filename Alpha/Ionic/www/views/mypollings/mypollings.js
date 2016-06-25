'Use Strict';
angular.module('App').controller('myPollingsController', function ($scope, $ionicModal, $state ,$cordovaOauth, $localStorage, $location,$http,$ionicPopup, $firebaseObject, $firebaseArray,$firebaseUtils, Auth, FURL, Utils,mypollkey) {
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
      question:"",
      type:'text'
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
  }

  $scope.changeDescription = function (newdescription) {
    var descriptionObj = new $firebaseObject($scope.polingref.child('description'));
    descriptionObj.$value = newdescription;
    descriptionObj.$save();
  }
  /*
    trashclick kalo trash di 1 item divider di pencet, yg kena effect cuma 1 tempeat itu doang 2 yg lain engga.
   */
    $scope.selectItem = false;
  $scope.trashclick = function(){
    $scope.selectItem = true;
  };
}
);
