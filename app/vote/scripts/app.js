'use strict';

angular.module('feedbachVote', ['ngRoute', 'ui.bootstrap'])
.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .when('/:id', {
      templateUrl: 'views/vote.html',
      controller: 'VoteCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
})
.directive('voteBtn', function(){
  return function(scope, element, attrs){
    var btnClass = ['btn-primary', 'btn-info', 'btn-success', 'btn-warning'];
    element.addClass(btnClass[attrs.voteBtn]);
  }
})
.directive('fbModal', function(){
  // directive with common controller for modals
  return {
    restrict: 'E',
    controller: function($scope, $location, $route, $timeout, $window){
      // Variables
      $scope.modal.opts = {
        backdropFade: true,
        dialogFade:true
      };

      // Functions
      $scope.go = function(url){
        if ($scope.modal.show) {
          $scope.modal.show = false;
          var host = $location.host();
          var port = ($location.port() == 80 ? '' : ':' + $location.port());
          $window.location.href = 'http://' + host + port + '/#' + url;
        }
      }
    }
  }
})
.directive('voteRecieved', function(){
  return {
    require: 'fbModal',
    templateUrl: 'views/vote-recieved.html',
  }
})
.directive('voteAlreadyRecieved', function(){
  return {
    require: 'fbModal',
    templateUrl: 'views/vote-already-recieved.html',
  }
})
.directive('surveyNotFound', function(){
  return {
    require: 'fbModal',
    templateUrl: 'views/survey-not-found.html',
  }
})
.directive('error', function(){
  return {
    require: 'fbModal',
    templateUrl: 'views/error.html',
  }
})
.directive('verticalCenter', function($window){
  return function(scope, element, attr){
    var pixels;
    var w = angular.element($window);
    function setPixels(){
      var h = $window.innerHeight;
      var eh = element[0].clientHeight;
      pixels = (h - eh)/2 - 30;
      if (pixels < 50) pixels = 50 + 'px';
      else             pixels = pixels + 'px';
      element.css('margin-top', pixels);
    }
    setPixels();
    w.bind('resize', function(){
      setPixels();
    });
  }
});
