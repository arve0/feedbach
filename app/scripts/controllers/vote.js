'use strict';

angular.module('feedbachApp')
.controller('VoteCtrl', function ($scope, $routeParams, $http, $location, $dialog) {
  // modal
  $scope.modal = {}
  $scope.modal.show = false;
  $scope.modal.opts = {
    backdropFade: true,
    dialogFade:true
  }
  $scope.modal.close = function() {
    $scope.modal.show = false;
    $location.path('/');
  }
  var numberOfQuestions = 0;  
  $scope.view = 'fetching';
  $http.get($routeParams.id + '.json', {cache: false})
    .success(function(data, status){
      $scope.survey = data;
      numberOfQuestions = $scope.survey.questions.length;
      $scope.view = 'vote';
    })
    .error(function(data, status) {
      if (404 == status) {
        notFoundModal();
      }
      else errorModal();
  }); 
  $scope.feedback = {};
  $scope.feedback.id = $routeParams.id;
  $scope.feedback.votes = [];
  $scope.activeTab = 0;
  $scope.setActive = function(index) {
    $scope.activeTab = index;
  }
  $scope.setPrevActive = function() {
    if ($scope.activeTab != 0) --$scope.activeTab;
  }
  $scope.setNextActive = function() {
    if (($scope.activeTab + 1) < numberOfQuestions) ++$scope.activeTab;
  }
  $scope.vote = function() {
    if ($scope.feedback.votes.length == numberOfQuestions) { // voting done?
      for (var i=0; i<numberOfQuestions; ++i) { // check if all questions voted for
        if ($scope.feedback.votes[i] == null) {
          $scope.activeTab = i;
          return;
        }
      }
      sendVote();
    }
    else { // next question
      $scope.setNextActive();
    }
  }
  function sendVote() {
    console.log('sending vote: \n' + JSON.stringify($scope.feedback, null, 2)); //TODO
    $http.post('/vote', $scope.feedback)
      .success(function(){
        $scope.modal.title = 'Thanks';
        $scope.modal.msg = 'We have saved your vote.';
        $scope.modal.button = 'Continue';
        $scope.modal.show = true;
      })
      .error(function(){
        errorModal();
    });
  }
  var errorModal = function() {
    $scope.modal.title = 'Error';
    $scope.modal.msg = 'Something went wrong. Have you already voted?';
    $scope.modal.button = 'Cancel';
    $scope.modal.show = true;
  }
  var notFoundModal = function(){
    var title = $routeParams.id + ' not found';
    var msg = 'Could not find a survey with id ' + $routeParams.id + '. Want to create it?';
    var buttons = [
      { result: false, label: 'Cancel'},
      { result: true, label: 'Create', cssClass: 'btn-primary'}
    ];
    $dialog.messageBox(title, msg, buttons)
      .open()
      .then(function(create){
        if (create) $location.path('/create/' + $routeParams.id);
        else $location.path('/');
    });
  }
});
