'use strict';

angular.module('feedbachApp')
.controller('MainCtrl', function ($scope, $location, $window, Survey, RandId) {
  $scope.modal = {};
  $scope.placeholder = RandId.create();
  $scope.input = {}; // make sure child scopes updates parent scope
  $scope.input.id = '';
  var id = function id() { // if input not defined, return placeholder
    return ($scope.input.id || $scope.placeholder);
  }
  $scope.submit = function() {
    Survey.get({ id: id() }, 
      function success(data){
        if (data.owner) $location.path('/view/' + id());
        else {
          var host = $location.host();                                          // server address
          var port = ($location.port() == 80 ? '' : ':' + $location.port());    // non-standard port on server
          $window.location.href = 'http://' + host + port + '/vote/#/' + id();  // light vote client
        }
      },
      function error(data){
        if (404 == data.status) $location.path('/create/' + id());
        else if (403 == data.status) $scope.modal.show = 'voteAlreadyRecieved';
        else {
          $scope.modal.show = 'error';
        }
    });
  }
});
