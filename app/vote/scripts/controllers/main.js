'use strict';

angular.module('feedbachVote')
.controller('MainCtrl', function ($scope, $routeParams, $http, $location, $modal, fbUtils) {
  $scope.input = {}; // make sure child scopes updates parent scope
  $scope.input.id = '';
  $scope.submit = function() {
    $http.get('/api/survey/' + $scope.input.id) // check if survey exists
    .success(function(data){
      if (data.owner) {
        fbUtils.go('#/view/' + $scope.input.id);
      } else {
        $location.path($scope.input.id);
      }
    })
    .error(function(data, status){
      if (404 == status) fbUtils.go('#/create/' + $scope.input.id);
      else if (403 == status) {
        $modal.open({ templateUrl: '/views/modals/vote-already-recieved.html' });
      } else {
        $modal.open({ templateUrl: '/views/modals/error.html' });
      }
    });
  }
});
