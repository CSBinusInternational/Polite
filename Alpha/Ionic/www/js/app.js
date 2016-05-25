'Use Strict';
angular.module('App', ['ionic','ngStorage', 'ngCordova','firebase','ngMessages'])
.config(function($stateProvider, $urlRouterProvider) {
$stateProvider
    .state('app', {
        url: '/app',
        templateUrl: 'views/sidemenu/sidemenu.html',
        controller:'sidemenuController',
        abstract: true
    })
    .state('login', {
      url: '/login',
      templateUrl: 'views/login/login.html',
      controller:'loginController'
    })
    .state('forgot', {
      url: '/forgot',
      templateUrl: 'views/forgot/forgot.html',
      controller:'forgotController'
    })
    .state('register', {
      url: '/register',
      templateUrl: 'views/register/register.html',
      controller:'registerController'
    })
    .state('app.home', {
      url:'/home',
      views: {
          'menuContent': {
            templateUrl: "views/home/home.html",
            controller:'homeController'
          }
      }
    })
    .state('app.myprofile', {
      url:'/myprofile',
      views: {
          'menuContent': {
            templateUrl: "views/myprofile/myprofile.html",
            controller:'myProfileController'
          }
      }
    })
    .state('app.mypollings', {
      url:'/mypollings',
      views: {
          'menuContent': {
            templateUrl: "views/mypollings/mypollings.html",
            controller:'myPollingsController'
          }
      }
    })
    .state('app.createpolling', {
      url:'/createpolling',
      views: {
        'menuContent': {
          templateUrl: "views/createpolling/createpolling.html",
          controller:'myPollingsController'
        }
      }
    })
    .state('app.notifications', {
      url:'/notifications',
      views: {
          'menuContent': {
            templateUrl: "views/notifications/notifications.html"
          }
      }
    })
    .state('app.mypollingsummary', {
      url:'/mypollingsummary/',
      views: {
          'menuContent': {
            templateUrl: "views/mypollingsummary/mypollingsummary.html",
            controller:'myPollingSummaryController'
          }
      }
    })
    .state('app.search', {
      url:'/search',
      views: {
        'menuContent': {
          templateUrl: "views/search/search.html",
          controller:'searchController'
        }
      }
    })
    ;
$urlRouterProvider.otherwise("/login");
})
.factory('mypollid',function() {
  return {
        changeCurrentValue: function(i) {
           this.currentValue = i;
        },
        currentValue: 0
  };
})
// Changue this for your Firebase App URL.
.constant('FURL', 'https://darmawanfirstapp.firebaseio.com/')
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
