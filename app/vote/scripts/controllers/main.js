'use strict';

angular.module('feedbachVote')
.controller('MainCtrl', function ($scope, $routeParams, $http, $location, $window) {
  $scope.modal = {};
  $scope.input = {}; // make sure child scopes updates parent scope
  $scope.input.id = '';
  $scope.submit = function() {
    $http.get('/api/survey/' + $scope.input.id) // check if survey exists
    .success(function(data){
      if (data.owner) {
        gotoFull('view/' + $scope.input.id);
      }
      else {
        $location.path($scope.input.id);
      }
    })
    .error(function(data, status){
      if (404 == status) gotoFull('create/' + $scope.input.id);
      else if (403 == status) $scope.modal.show = 'voteAlreadyRecieved';
      else {
        $scope.modal.show = 'error';
      }
    });
  }
  var gotoFull = function(url){ // goes to full webapp
    var host = $location.host();
    var port = ($location.port() == 80 ? '' : ':' + $location.port());
    $window.location.href = 'http://' + host + port + '/#/' + url;
  }
});
