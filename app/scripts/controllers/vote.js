'use strict';

angular.module('feedbachApp')
.controller('VoteCtrl', function ($scope, $routeParams, $window, Survey) {
  $scope.modal = {};
  Survey.get({ id: $routeParams.id },
    function success(data){
      $window.location.href = '/vote/#/' + $routeParams.id;
    },
    function error(data) {
      if (404 == data.status) 
        $scope.modal.show = 'surveyNotFound';
      else if (403 == data.status)
        $scope.modal.show = 'voteAlreadyRecieved'
      else
        $scope.modal.show = 'error';
    }
  );
});
