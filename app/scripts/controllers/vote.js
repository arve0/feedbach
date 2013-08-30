'use strict';

angular.module('feedbachApp')
.controller('VoteCtrl', function ($scope, $routeParams, $window, $http) {
  $scope.modal = {};
  $http.get($routeParams.id + '.json')
    .success(function(data, status){
      $window.location.href = '/vote/#/' + $routeParams.id;
    })
    .error(function(data, status) {
      if (404 == status) 
        $scope.modal.show = 'surveyNotFound';
      else if (403 == status)
        $scope.modal.show = 'voteAlreadyRecieved'
      else
        $scope.modal.show = 'error';
  });
});
