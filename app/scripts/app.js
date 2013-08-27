'use strict';

angular.module('feedbachApp', ['ui.bootstrap', 'truncate'])
.config(function ($routeProvider) {
  $routeProvider
    .when('/create/:id', {
      templateUrl: 'views/create.html',
      controller: 'CreateCtrl'
    })
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .when('/animate', {
      templateUrl: 'views/animate.html',
      controller: 'AnimateCtrl'
    })
    .when('/view/:id', {
      templateUrl: 'views/view.html',
      controller: 'ViewCtrl'
    })
    .when('/overview', {
      templateUrl: 'views/overview.html',
      controller: 'OverviewCtrl'
    })
    .when('/about', {
      templateUrl: 'views/about.html',
      controller: 'AboutCtrl'
    })
    .when('/:id', {
      templateUrl: 'views/vote.html',
      controller: 'VoteCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
})
.directive('verticalCenter', function(){
  return function(scope, element, attr){
    var pixels = ($(window).height() - element.height())/2 - 30 + 'px';
    element.css('margin-top', pixels);
    $(window).resize(function(){
      pixels = ($(window).height() - element.height())/2 - 30 + 'px';
      element.css('margin-top', pixels);
    //  scope.$digest();
    });
  }
})
.directive('voteBtn', function(){
  return function(scope, element, attrs){
    var btnClass = ['btn-primary', 'btn-success', 'btn-danger', 'btn-warning'];
    element.addClass(btnClass[attrs.voteBtn]);
  }
})
