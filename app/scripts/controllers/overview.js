'use strict';

angular.module('feedbachApp')
.controller('OverviewCtrl', function ($scope, $http, $location) {
  function getSurveys() {
    $http.get('/surveys.json')
      .success(function(data, status){
        $scope.surveys = data;
      });
  }
  getSurveys();
  $scope.idToDate = function(id) {
    if (id) { //prevent error if id undefined
      var timestamp = id.toString().substring(0,8);
      return new Date( parseInt( timestamp, 16 ) * 1000 );
    }
  }
  $scope.gotoView = function(id) {
    $location.path('/view/' + id);
  }
  $scope.gotoEdit = function(id) {
    $location.path('/edit/' + id);
  }
  $scope.gotoCreate = function() {
    $scope.surveys.push(''); // close modal
    $location.path('/create/' + randomString(4));
  }
  $scope.goHome = function(){
    $scope.surveys.push(''); // close modal
    $location.path('/');
  }
  $scope.deleteSurvey = function(id){
    $http.delete('/' + id + '.json')
      .success(function(){
        getSurveys();
      })
      .error(function(){
        //TODO
        alert('could not delete survey');
      })
  }
  function randomString(length) { // returns random alphanumeric string
    var chars = 'abcdefghijklmnopqrstuvwxyz';
    var result = '';
    for (var i = length; i > 0; --i) {
      result += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    return result;
  }

});
