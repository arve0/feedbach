'use strict';

angular.module('feedbachApp')
.controller('MainCtrl', function ($scope, $http, $location) {
  $scope.feedbackGiven = false;
  $scope.margin = 50;
  $scope.margin = ($(window).height() - $('.frontpage').height())/2 - 30;
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
      else {
        window.scrollTo(0,0); // hack for ios virtual keyboard
        $scope.feedbackGiven = true;        
      }
    });
  }
  $scope.closeModal = function() {
    $scope.feedbackGiven = false;
  }
  $scope.modalOpts = {
    backdropFade: true,
    dialogFade:true
  }
  $http.get('/surveys.json').success(function(data){
    $scope.surveys = data;
  });
});
