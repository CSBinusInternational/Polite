'Use Strict';
angular.module('App').controller('homeController', function ($scope, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup, $firebaseObject, Auth, FURL, Utils) {
  var ref = new Firebase(FURL);

  $scope.logOut = function () {
      Auth.logout();
      $location.path("/login");
  }
  $scope.pollings = [
      { title: 'Unity 5 for Gamification', description : 'This is a survey about Unity 5 for Gamification ',creator: 'Albert Darmawan'},
      { title: 'Ionic for Mobile Development', id: 2 },
      { title: 'Binus International Evaluation Form', id: 3 },
      { title: 'Newbinusmaya Evaluation Form', id: 4 },
      { title: '2016 Thesis Execution', id: 5 },
      { title: 'Polite App Review', id: 6 }
  ];
}
);



.controller('PollingsCtrl', function($scope) {
