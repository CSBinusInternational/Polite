'Use Strict';
angular.module('App').controller('sidemenuController', function ($scope, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup, $firebaseObject, Auth, FURL, Utils) {
  var ref = new Firebase(FURL);
  
  $scope.logOut = function () {
      Auth.logout();
      $location.path("/login");
  }

}
);
