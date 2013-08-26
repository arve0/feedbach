'use strict';

angular.module('feedbachApp')
.controller('ViewCtrl', function ($scope, $routeParams, $http, $location, $timeout) {
  // Variables
  $scope.id = $routeParams.id;

  // Resource
  $http.get($routeParams.id + '.json')
    .success(function(data, status){
      if (!data.owner) {
        $scope.modal.show = 'viewNotAllowed';
        console.log('not allowed');
      }
      else {
        $scope.survey = data;
        calculatePercent();
      }
    })
    .error(function(data, status) {
      if (404 == status) {
        $scope.modal.show = 'surveyNotFound';
      }
      else {
        $scope.modal.show = 'error';
      }
    })


  // Socket.io
  var socket = io.connect('', { 'force new connection': true, query: 'id=' + $routeParams.id });
  socket.on('update', function(feedback){
    for (var i = 0; i < feedback.votes.length; i++) {
      if(!$scope.survey.questions[i].answers[feedback.votes[i]].votes) $scope.survey.questions[i].answers[feedback.votes[i]].votes = 0;
      $scope.survey.questions[i].answers[feedback.votes[i]].votes++;
    }
    $scope.survey.totalVotes = ++$scope.survey.totalVotes || 1;
    calculatePercent();
    $scope.$digest(); // update
  });
  $scope.$on('$destroy', function (event) {
    // disconnect socket when leaving page
    socket.disconnect();
  });


  // Functions
  var calculatePercent = function(){
    var total = $scope.survey.totalVotes || 0;
    if (0==total) $scope.survey.totalVotes=0;
    for(var i=0;i<$scope.survey.questions.length;i++){
      for(var j=0;j<$scope.survey.questions[i].answers.length;j++){
        var votes = $scope.survey.questions[i].answers[j].votes || 0;
        var p = (total?(votes / total * 100).toFixed(1):0);
        $scope.survey.questions[i].answers[j].percent = p;
      }
    }
  }
  $scope.deleteSurvey = function(){
    $http.delete('/' + $routeParams.id + '.json')
      .success(function(){
        $location.path('/');
      })
      .error(function(data){
        $scope.modal.show = 'deleteError';
      })
  }
  $scope.resetFeedback = function(){
    $http.delete('/feedback/' + $routeParams.id)
      .success(function(){
        $http.get($routeParams.id + '.json').success(function(data){
          resetVotes();
        })
      })
      .error(function(){
        $scope.modal.show = 'resetError'
      })
  }
  var resetVotes = function(){
    $scope.survey.totalVotes = 0;
    for (var i=0; i < $scope.survey.questions.length; i++){
      for (var j=0; j < $scope.survey.questions[i].answers.length; j++){
        $scope.survey.questions[i].answers[j].votes = 0;
      }
    }
    calculatePercent();
  }
}); 
