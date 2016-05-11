'Use Strict';
angular.module('App').controller('loginController', function ($scope, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup, $firebaseObject, Auth, FURL, Utils) {
  var ref = new Firebase(FURL);
  var userkey = "";

  /*
  Later when published!
  $scope.loginFacebook = function() {
      Auth.$authWithOAuthRedirect("facebook").then(function(authData) {
        // User successfully logged in
      }).catch(function(error) {
        if (error.code === "TRANSPORT_UNAVAILABLE") {
          Auth.$authWithOAuthPopup("facebook").then(function(authData) {
            // User successfully logged in. We can log to the console
            // since we’re using a popup here
            console.log(authData);
          });
        } else {
          // Another error occurred
          console.log(error);
        }
      });
  };
  */

  $scope.loginFacebook = function() {
      Auth.facebooklogin().then(function(authData){
          console.log(authData);
          $state.go('app.home');
      });
  };

  $scope.loginGoogle = function() {
    Auth.googlelogin().then(function(authData){
        console.log(authData);
        $state.go('app.home');
    });
  };


  $scope.signIn = function (user) {
    if(angular.isDefined(user)){
    Utils.show();
    Auth.login(user)
      .then(function(authData) {
      //console.log("id del usuario:" + JSON.stringify(authData));

      ref.child('profile').orderByChild("id").equalTo(authData.uid).on("child_added", function(snapshot) {
        console.log(snapshot.key());
        userkey = snapshot.key();
        var obj = $firebaseObject(ref.child('profile').child(userkey));

        obj.$loaded()
          .then(function(data) {
            //console.log(data === obj); // true
            //console.log(obj.email);
            $localStorage.email = obj.email;
            $localStorage.userkey = userkey;

              Utils.hide();
              $state.go('app.home');
              console.log("Starter page","Home");

          })
          .catch(function(error) {
            console.error("Error:", error);
          });
      });

      }, function(err) {
        Utils.hide();
         Utils.errMessage(err);
      });
    }
  };

});
