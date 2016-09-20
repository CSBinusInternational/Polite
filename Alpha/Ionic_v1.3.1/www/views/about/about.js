'Use Strict';
angular.module('App').controller('aboutController', function ($scope, $ionicModal, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup, $firebaseObject, $firebaseArray, Auth, FURL, Utils) {
  console.log("About Controller!");
  var ref = new Firebase(FURL);
  var authData = ref.getAuth();
  $scope.uuid = authData.uid;

  $scope.timestamp = new Date().getTime();
  $scope.pollingsaf = $firebaseObject(ref.child('pollings'));

  $ionicModal.fromTemplateUrl('views/about/terms.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(terms) {
    $scope.terms = terms;
  });
  $scope.openTerms = function() {
    $scope.terms.show();
    console.log("open");
  };

  $scope.closeTerms = function(){
    $scope.terms.hide();
  };

    $ionicModal.fromTemplateUrl('views/about/developer.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(dev) {
      $scope.dev = dev;
    });
  $scope.openDev = function(){
    $scope.dev.show();
    console.log("open Dev");
  };
  $scope.closeDev = function(){
    $scope.dev.hide();
  };
}
);
