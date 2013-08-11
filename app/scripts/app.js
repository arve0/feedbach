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
    .when('/edit/:id', {
      templateUrl: 'views/edit.html',
      controller: 'EditCtrl'
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
  return {
    restrict: 'A',
    transclude: true,
    template: '<div style="margin-top: {{pixels}}px" ng-transclude></div>',
    link: function(scope, element, attrs){
      scope.pixels = ($(window).height() - element.height())/2 - 30;
      $(window).resize(function(){
        scope.pixels = ($(window).height() - element.height())/2 - 30;
        scope.$digest();
      })
    }
  }
})
.directive('notFoundModal', function(){
  return {
    restrict: 'E',
    templateUrl: 'views/directives/not-found-modal.html',
    replace: true
  }
})
