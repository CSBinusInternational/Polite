'Use Strict';
angular.module('App').controller('aboutController', function ($scope, $ionicModal, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup, $firebaseObject, $firebaseArray, Auth, FURL, Utils) {
  console.log("About Controller!");
  var ref = new Firebase(FURL);
  var authData = ref.getAuth();
  $scope.uuid = authData.uid;

  $scope.timestamp = new Date().getTime();
  $scope.pollingsaf = $firebaseObject(ref.child('pollings'));

  $ionicModal.fromTemplateUrl('views/about/term.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(term) {
    $scope.term = term;
  });
  $scope.openTerm = function() {
    $scope.term.show();
    console.log("open");
  };

  $scope.closeTerm = function(){
    $scope.term.hide();
  };

}
);
