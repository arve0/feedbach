'use strict';

angular.module('feedbachApp')
.controller('RedirectCtrl', function ($scope, $routeParams, fbUtils) {
  // redirect users who go to /#/id -> /vote/#/id
  fbUtils.go('vote/#' + $routeParams.id);
});
