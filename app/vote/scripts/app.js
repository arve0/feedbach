'use strict';

angular.module('feedbachVote', ['ngRoute', 'ui.bootstrap.modal'])
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
.directive('focus', function () {
  // focus the element
  return {
    link: function (scope, element) {
      element[0].focus();
    }
  }
})
.service('fbUtils', function($location, $window){ // service with shared utils
  // go to new location outside hash url
  this.go = function(url){
    var host = $location.host();
    var port = ($location.port() == 80 ? '' : ':' + $location.port());
    $window.location.href = 'http://' + host + port + '/' + url;
  }
})
.directive('verticalCenter', function($window){
  // vertical center element on page
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
