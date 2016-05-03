'Use Strict';
angular.module('App').controller('homeController', function ($scope, $ionicModal, $state,$cordovaOauth, $localStorage, $location,$http,$ionicPopup, $firebaseObject, Auth, FURL, Utils) {
  var ref = new Firebase(FURL);
  $scope.pollings = [
      { id: 1,
        title: 'Unity 5 for Gamification',
        description : 'Gamification typically involves applying game design thinking to non-game applications to make them more fun and engaging.',
        creator: 'Albert Darmawan',
        questions : [
          {
            question : 'Game Type:',
            choices : ['A virtual construct to cause distress on other players, and gain satisfaction from inflicting anxiety and pain on others.',
                        'A game that have goals, usually some form of points gathering—whether experience points, levels or money.',
                        'A game to find out as much as they can about the virtual construct—including mapping its geography and understanding the game mechanics.',
                        'A game that use the virtual construct to converse and role-play with their fellow gamers.'],
            type : 'radio'
          },
          {
            question : 'Playing Style:',
            choices : ['Solo',
                        'Competitive',
                        'Cooperative'],
            type : 'checkbox'
          },
          {
            question : 'Playing Goals:',
            choices : ['Having fun',
                        'Rewards',
                        'Challenges'],
            type : 'checkbox'
          },
          {
            question : 'What is holding you back from achieving your potential:',
            choices : ['Lack of volition (belief that completing the task at hand is valuable) ',
                        'Lack of faculty (ability to complete the task)',
                        'None of the above'],
            type : 'radio'
          },
          {
            question : 'Who do you prefer to play with:',
            choices : ['Family',
                        'Friends',
                        'Other'],
            type : 'radio'
          },
          {
            question : 'Graphics Preference:',
            choices : ['Anime',
                        'Cartoon',
                        'Real'],
            type : 'checkbox'
          },
          {
            question : 'The most game tool that you like(optional):',
            type : 'text'
          },
          {
            question : 'The most game that you like(optional):',
            type : 'text'
          }
        ]
      },
      { id: 2, title: 'Ionic for Mobile Development', description: 'This is a survey about Ionic for Mobile Development', creator: 'Ieuan Ignatius' },
      { id: 3, title: 'Binus International Evaluation Form', description: 'This is a survey about Binus International Evaluation Form', creator: 'Ferdy Pratama' },
      { id: 4, title: 'Newbinusmaya Evaluation Form', description: 'This is survey about Newbinusmaya Evaluation Form', creator:'Mark' },
      { id: 5, title: '2016 Thesis Execution', description: 'This is a survey about 2016 Thesis Execution', creator:'Thomas Dwinata' },
      { id: 6, title: 'Polite App Review', description:'This is a survey about Polite App Review', creator:'Matthew' }
  ];

  $scope.logOut = function () {
      Auth.logout();
      $location.path("/login");
  };

  $ionicModal.fromTemplateUrl('views/home/polling.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function(chosenpolling) {
    $scope.openedPollingId = chosenpolling;
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

}
);
