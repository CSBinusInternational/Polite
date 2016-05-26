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
        return authData.fullName;
      }
  };

  $scope.viewSummary = function(key) {
    mypollkey.currentValue=key;
    $state.go('app.mypollingsummary');
  };

  $scope.showPopup = function(){
    $scope.dataa = {};
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
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return $scope.openModal();
            }
          }
        }, ]
    });
    myPopup.then(function(res) {
      console.log('Tapped!', res);
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

  $scope.createChoice = [];
  $scope.mychoices=[0,1];
  $scope.index = 2;
  $scope.addAnswer = function(){
    $scope.mychoices.push($scope.index);
    $scope.index++;
    $scope.modal.show();
  };
  $scope.mcq = function(){
    $scope.mychoices=[0,1];
    $scope.createChoice.push(
      {
        number: $scope.index,
        type:'radio',
        choices:$scope.mychoices
      }
    );

    $scope.modal.show();
  };
  $scope.text = function(){
    $scope.createChoice.push(
      {
        number: $scope.index,
        type:'text'
      }
    );
    $scope.modal.show();
  };

}
);
