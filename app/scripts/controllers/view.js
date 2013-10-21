'use strict';

angular.module('feedbachApp')
.controller('ViewCtrl', function ($scope, $routeParams, $http, $location, $modal) {
  // Variables
  $scope.id = $routeParams.id;
  $scope.modal = {};

  // Resource
  $http.get('/api/survey/' + $routeParams.id )
    .success(function(data){
      if (!data.owner) {
        $scope.modal.show = 'viewNotAllowed';
      }
      else {
        $scope.survey = data;
        calculatePercent();
      }
    })
    .error(function(data, status) {
      if (404 == status) {
        $scope.modal.show = 'surveyNotFound';
        console.log('survey not found')
      }
      else {
        $scope.modal.show = 'error';
      }
    });


  // Socket.io
  var socket = io.connect('', { 'force new connection': true, query: 'id=' + $routeParams.id });
  socket.on('update', function(feedback){
    for (var i = 0; i < feedback.votes.length; i++) {
      if(!$scope.survey.questions[i].answers[feedback.votes[i]].votes) {
        $scope.survey.questions[i].answers[feedback.votes[i]].votes = 0;
      }
      $scope.survey.questions[i].answers[feedback.votes[i]].votes++;
    }
    $scope.survey.totalVotes = ++$scope.survey.totalVotes || 1;
    calculatePercent();
    $scope.$digest(); // update
  });
  $scope.$on('$destroy', function () {
    // disconnect socket when leaving page
    socket.disconnect();
  });


  // Functions
  var calculatePercent = function(){
    var total = $scope.survey.totalVotes || 0;
    if (0===total) { $scope.survey.totalVotes=0; }
    for(var i=0;i<$scope.survey.questions.length;i++){
      for(var j=0;j<$scope.survey.questions[i].answers.length;j++){
        var votes = $scope.survey.questions[i].answers[j].votes || 0;
        var p = (total?(votes / total * 100).toFixed(1):0);
        $scope.survey.questions[i].answers[j].percent = p;
      }
    }
  }
  $scope.confirmDelete = function(){
    $scope.deleteId = $routeParams.id;
    $scope.modal.show = 'confirmDelete';
  }
  $scope.deleteSurvey = function(id){
    $http.delete('/api/survey/' + id )
      .success(function(){
        $scope.modal.show = false;
        $location.path('/');
      })
      .error(function(){
        $scope.modal.show = 'deleteError';
      })
  }
  $scope.resetFeedback = function(){
    $http.delete('/api/feedback/' + $routeParams.id)
      .success(function(){
        resetVotes();
      })
      .error(function(){
        $scope.modal.show = 'resetError';
      });
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
