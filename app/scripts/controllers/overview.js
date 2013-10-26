'use strict';

angular.module('feedbachApp')
.controller('OverviewCtrl', function ($scope, $http, $location, RandId, $modal) {
  // Functions
  function getSurveys() {
    $http.get('/api/survey/')
      .success(function(data){
        $scope.surveys = data;
        if ($scope.surveys.length === 0) {
          var noSurveys = $modal.open({ templateUrl: '/views/modals/no-surveys.html' });
          noSurveys.result.then(function close(){
            $location.path('/create/' + RandId.create());
          },function dismiss(){
            $location.path('/');
          });
        }
      })
      .error(function(){
        var errorModal = $modal.open({ templateUrl: 'views/modals/error.html' });
        errorModal.result.then(function(){},function dismiss(){
          $location.path('/');
        });
      });
  }
  function deleteSurvey(){
    $http.delete('/api/survey/' + $scope.deleteId )
      .success(getSurveys)
      .error(function(){
        var errorModal = $modal.open({ templateUrl: '/views/modals/delete-error.html' });
        errorModal.result.then(function(){}, getSurveys);
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
    var delModal = $modal.open({ templateUrl: '/views/modals/confirm-delete.html', scope: $scope });
    delModal.result.then(deleteSurvey);
  }
  $scope.gotoView = function(id){
    $location.path('/view/' + id);
  }

  // Resources
  getSurveys();

});
