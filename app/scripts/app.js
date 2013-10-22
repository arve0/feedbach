'use strict';

angular.module('feedbachApp', ['ngRoute','ngResource', 'monospaced.qrcode', 'ui.bootstrap'])
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
      template: 'Redirecting..',
      controller: 'RedirectCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
})
.directive('verticalCenter', function($window){
  return function(scope, element){
    var pixels;
    var w = angular.element($window);
    function setPixels(){
      var h = $window.innerHeight;
      var eh = element[0].clientHeight;
      pixels = (h - eh)/2 - 30;
      if (pixels < 50) { pixels = 50 + 'px'; }
      else             { pixels = pixels + 'px'; }
      element.css('margin-top', pixels);
    }
    setPixels();
    w.bind('resize', function(){
      setPixels();
    });
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
  var host = $location.host();
  var port = ($location.port() == 80 ? '' : ':' + $location.port());
  
  // go to new location outside hash url
  this.go = function(url){
    $window.location.href = 'http://' + host + port + '/' + url;
  }
  // return base url
  this.baseUrl = function(){
    return 'http://' + host + port + '/';
  }
  // full screen - http://stackoverflow.com/a/7525760
  this.fullScreen = function(element) {
    // Supports most browsers and their versions.
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
    if (requestMethod) { // Native full screen.
      requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
      var wscript = new ActiveXObject("WScript.Shell");
      if (wscript !== null) {
        wscript.SendKeys("{F11}");
      }
    }
  }
  this.closeFullScreen = function() {
    // Supports most browsers and their versions.
    var requestMethod = document.exitFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.msExitFullScreen;
    if (requestMethod) { // Native full screen.
      requestMethod.call(document);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
      var wscript = new ActiveXObject("WScript.Shell");
      if (wscript !== null) {
        wscript.SendKeys("{ESC}");
      }
    }
  }
});
