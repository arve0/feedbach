'use strict';

angular.module('feedbachApp')
.controller('MainCtrl', function ($scope, $http, $location) {
  $scope.modal = {};
  $scope.randomString = function(length) { // returns random alphanumeric string
    var chars = 'abcdefghijklmnopqrstuvwxyz';
    var result = '';
    for (var i = length; i > 0; --i) {
      result += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    return result;
  }
  $scope.placeholder = $scope.randomString(4); // 4 letters ~ 500'000 possibilities
  $scope.input = {}; // make sure child scopes updates parent scope
  $scope.input.id = '';
  $scope.id = function id() { // if input not defined, return placeholder
    return ($scope.input.id ? $scope.input.id : $scope.placeholder);
  }
  $scope.submit = function() {
    $http.get('/' + $scope.id() + '.json') // check if survey exists
    .success(function(data){
      if (data.owner) $location.path('/view/' + $scope.id());
      else $location.path('/' + $scope.id());
    })
    .error(function(data, status){
      if (404 == status) $location.path('/create/' + $scope.id());
      else if (403 == status) $scope.modal.show = 'voteAlreadyRecieved'
      else {
        $scope.modal.show = 'error';
      }
    });
  }
  $http.get('/surveys.json').success(function(data){
    $scope.surveys = data;
  });
});
