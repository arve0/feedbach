'use strict';

angular.module('feedbachApp')
.service('RandId', function RandId() {
  // A service for creating random IDs
  var length = 4;
  this.create = function() { // returns random alphanumeric string
    var chars = 'abcdefghijklmnopqrstuvwxyz';
    var result = '';
    for (var i = length; i > 0; --i) {
      result += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    return result;
  }

});
