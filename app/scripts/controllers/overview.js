'use strict';

angular.module('feedbachApp')
.controller('OverviewCtrl', function ($scope, $http, $location) {
  // Variables


  // Resources
  getSurveys();
  
  
  // Functions
  function getSurveys() {
    $http.get('/surveys.json')
      .success(function(data, status){
        $scope.surveys = data;
        if ($scope.surveys.length == 0) {
          $scope.modal.show = 'noSurveys';
        }
      });
  }
  $scope.idToDate = function(id) {
    if (id) { //prevent error if id undefined
      var timestamp = id.toString().substring(0,8);
      return new Date( parseInt( timestamp, 16 ) * 1000 );
    }
  }
  $scope.deleteSurvey = function(id){
    $http.delete('/' + id + '.json')
      .success(function(){
        getSurveys();
      })
      .error(function(){
        $scope.modal.show = 'deleteError';
      })
  }
  $scope.gotoView = function(id){
    $location.path('/view/' + id);
  }

});
