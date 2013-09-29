'use strict';

angular.module('feedbachVote')
.controller('VoteCtrl', function ($scope, $routeParams, $http, $location, $window) {
  if ($location.url() == '/vote') { // working directory
    $window.location.href = '/vote/';
  }

  // Variables
  $scope.modal = {};
  var numberOfQuestions = 0;  
  $scope.view = 'fetching';

  // Resource
  $http.get('/api/survey/' + $routeParams.id )
    .success(function(data, status){
      $scope.survey = data;
      numberOfQuestions = $scope.survey.questions.length;
      $scope.view = 'vote';
    })
    .error(function(data, status) {
      if (404 == status) 
        $scope.modal.show = 'surveyNotFound';
      else if (403 == status)
        $scope.modal.show = 'voteAlreadyRecieved'
      else
        $scope.modal.show = 'error';
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
  $scope.vote = function(qid, aid) {
    $scope.feedback.votes[qid] = aid;
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
    $http.post('/api/feedback/', $scope.feedback)
      .success(function(){
        $scope.modal.show = 'voteRecieved';
      })
      .error(function(data, status){
        if (403 == status)
          $scope.modal.show = 'voteAlreadyRecieved';
        else
          $scope.modal.show = 'error';
    });
  }
});
