'use strict';

angular.module('feedbachApp')
.factory('Survey', function Survey($resource) {
  return $resource('/api/survey/:id');
});
