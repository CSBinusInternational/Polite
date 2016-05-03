'Use Strict';
angular.module('App').controller('homeController', function ($scope, $ionicModal, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup, $firebaseObject, Auth, FURL, Utils) {
  var ref = new Firebase(FURL);

  $scope.pollings = [
      { id: 1, title: 'Unity 5 for Gamification', description : 'This is a survey about Unity 5 for Gamification ',creator: 'Albert Darmawan'},
      { id: 2, title: 'Ionic for Mobile Development', description: 'This is a survey about Ionic for Mobile Development', creator: 'Ieuan Ignatius' },
      { id: 3, title: 'Binus International Evaluation Form', description: 'This is a survey about Binus International Evaluation Form', creator: 'Ferdy Pratama' },
      { id: 4, title: 'Newbinusmaya Evaluation Form', description: 'This is survey about Newbinusmaya Evaluation Form', creator:'Mark' },
      { id: 5, title: '2016 Thesis Execution', description: 'This is a survey about 2016 Thesis Execution', creator:'Thomas Dwinata' },
      { id: 6, title: 'Polite App Review', description:'This is a survey about Polite App Review', creator:'Matthew' }
  ];

  $ionicModal.fromTemplateUrl('polling.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.fillPolling = function() {
    $scope.modal.show();
  };

  /*$scope.closePolling = function() {
    $scope.modal.hide();
  };


  $scope.submitPolling = function() {
    $timeout(function() {
      $scope.closePolling();
    }, 1000);
  };*/

  $scope.logOut = function () {
      Auth.logout();
      $location.path("/login");
  };


}
);
