'use strict';

angular.module('feedbachApp')
.controller('ViewCtrl', function ($scope, $routeParams, $http, $location) {
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
  $http.get($routeParams.id + '.json')
    .success(function(data, status){
      if (!data.owner) $location.path('/'); //TODO: add modal
      $scope.survey = data;
      calculatePercent();
    })
    .error(function(data, status) {
      if (404 == status) {
        $scope.notFound = true;
      }
      else $location.path('/');
    })
  $scope.gotoCreate = function(){
    $scope.notFound = false;
    $location.path('/create/' + $routeParams.id);
  }
  $scope.notFoundCancel = function(){
    $scope.notFound = false;
    $location.path('/');
  }
  $scope.deleteSurvey = function(){
    $http.delete('/' + $routeParams.id + '.json')
      .success(function(){
        $location.path('/');
      })
      .error(function(){
        //TODO
        alert('could not delete survey');
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
        //TODO
        alert('could not reset feedback');
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
