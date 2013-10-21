'use strict';

angular.module('feedbachApp')
.controller('MainCtrl', function ($scope, $location, $window, Survey, RandId, fbUtils, $modal) {
  $scope.placeholder = RandId.create();
  $scope.input = {}; // make sure child scopes updates parent scope
  $scope.input.id = '';
  function id() { // if input not defined, return placeholder
    return ($scope.input.id || $scope.placeholder);
  }
  $scope.submit = function() {
    Survey.get({ id: id() },
      function success(data){
        if (data.owner) {
          $location.path('/view/' + id()); // live view of votes
        }
        else {
          fbUtils.go('vote/#/' + id()); // light vote client
        }
      },function error(data){
        if (404 == data.status) {
          $location.path('/create/' + id());
        } else if (403 == data.status) {
          $modal.open({ templateUrl: '/views/modals/vote-already-recieved.html' });
        } else {
          $modal.open({ templateUrl: '/views/modals/error.html' });
        }
      });
  }
});
