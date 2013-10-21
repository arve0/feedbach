'use strict';

angular.module('feedbachApp')
.controller('OverviewCtrl', function ($scope, $http, $location) {
  // Variables
  $scope.modal = {};
  
  // Functions
  function getSurveys() {
    $http.get('/api/survey/')
      .success(function(data){
        $scope.surveys = data;
        if ($scope.surveys.length === 0) {
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
  $scope.confirmDelete = function(id){
    $scope.deleteId = id;
    $scope.modal.show = 'confirmDelete';
  }
  $scope.deleteSurvey = function(id){
    $scope.modal.show = false;
    $http.delete('/api/survey/' + id )
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

  // Resources
  getSurveys();

});
