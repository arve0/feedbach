'use strict';

angular.module('feedbachApp')
.controller('ViewCtrl', function ($scope, $routeParams, $http, $location, $modal, $timeout, $route, fbUtils) {
  // Variables
  $scope.id = $routeParams.id;
  $scope.voteUrl = fbUtils.baseUrl() + 'vote/#/' + $scope.id;
  $scope.shortUrl = fbUtils.baseUrl() + $scope.id;

  // Resource
  $http.get('/api/survey/' + $routeParams.id )
    .success(function(data){
      if (!data.owner) {
        var notAllowedModal = $modal.open({ templateUrl: 'views/modals/view-not-allowed.html' });
        notAllowedModal.result.then(function close(){},function dismiss(){
          $location.path('/');
        })
      }
      else {
        $scope.survey = data;
        calculatePercent();
      }
    })
    .error(function(data, status) {
      if (404 == status) {
        var notFoundModal = $modal.open({ templateUrl: 'views/modals/survey-not-found.html', scope: $scope });
        notFoundModal.result.then(function close(){
          $location.path('/create/' + $routeParams.id);
        },function dismiss(){
          $location.path('/');
        });
      }
      else {
        $modal.open({ templateUrl: 'views/modals/error.html' });
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
  var deleteSurvey = function(id){
    $http.delete('/api/survey/' + id )
      .success(function(){
        $location.path('/');
      })
      .error(function(){
        var delModal = $modal.open({ templateUrl: 'views/modals/delete-error.html' });
        delModal.result.then(function close(){},function dismiss(){
          $timeout(function(){
            $route.reload();
          });
        });
      });
  }
  function resetVotes(){
    $scope.survey.totalVotes = 0;
    for (var i=0; i < $scope.survey.questions.length; i++){
      for (var j=0; j < $scope.survey.questions[i].answers.length; j++){
        $scope.survey.questions[i].answers[j].votes = 0;
      }
    }
    calculatePercent();
  }
  $scope.resetFeedback = function(){
    $http.delete('/api/feedback/' + $routeParams.id)
      .success(function(){
        resetVotes();
      })
      .error(function(){
        var resetModal = $modal.open({ templateUrl: 'views/modals/reset-error.html' });
        resetModal.result.then(function close(){},function dismiss(){
          $route.reload();
        });
      });
  }
  $scope.confirmDelete = function(){
    $scope.deleteId = $scope.id;
    var modal = $modal.open({
      templateUrl: 'views/modals/confirm-delete.html',
      scope: $scope
    });
    modal.result.then(function close(){
      deleteSurvey($scope.id);
    });
  }
  var instrEl = document.querySelector('.instruction-wrapper');
  $scope.showInstructions = function(){
    angular.element(instrEl).removeClass('hide');
    fbUtils.fullScreen(instrEl);
  }
  $scope.hideInstructions = function(){
    angular.element(instrEl).addClass('hide');
    fbUtils.closeFullScreen();
  }
});
