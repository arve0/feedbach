'use strict';

angular.module('feedbachApp')
.controller('EditCtrl', function ($scope, $http, $routeParams) {
  $scope.survey = {};
  $scope.active = 0;
  $http.get($routeParams.id + '.json')
    .success(function(data, status){
      if (!data.owner) $location.path('/'); //TODO: add modal
      $scope.survey = data;
    })
    .error(function(data, status) {
      if (404 == status) {
        $scope.notFound = true;
      }
      else $location.path('/');
    })
  $scope.setActive = function(index) {
    $scope.active = index;
  }

});
