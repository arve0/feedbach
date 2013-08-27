angular.module('feedbachApp')
.directive('fbModal', function(){
  // directive with common controller for modals
  return {
    restrict: 'E',
    controller: function($scope, $location, $route, $timeout){
      // Variables
      $scope.modal.opts = {
        backdropFade: true,
        dialogFade:true
      };

      // Functions
      $scope.go = function(url){
        if ($scope.modal.show) {
          $scope.modal.show = false;
          $location.path(url);
        }
      }
      $scope.reload = function(){
        if ($scope.modal.show) {
          $scope.modal.show = false;
          $timeout(function(){
            $route.reload();
          })
        }
      }
      $scope.close = function(){
        if ($scope.modal.show != 'deleteError')
          $scope.modal.show = false;
      }
      $scope.createRandom = function() {
        var chars = 'abcdefghijklmnopqrstuvwxyz';
        var result = '';
        for (var i = 4; i > 0; --i) {
          result += chars[Math.round(Math.random() * (chars.length - 1))];
        }
        $scope.modal.show = false;
        $location.path('/create/' + result);
      }
    }
  }
})
.directive('surveyNotFound', function(){
  return {
    require: 'fbModal',
    templateUrl: 'views/directives/survey-not-found.html',
  }
})
.directive('viewNotAllowed', function(){
  return {
    require: 'fbModal',
    templateUrl: 'views/directives/view-not-allowed.html',
  }
})
.directive('error', function(){
  return {
    require: 'fbModal',
    templateUrl: 'views/directives/error.html',
  }
})
.directive('deleteError', function(){
  return {
    require: 'fbModal',
    templateUrl: 'views/directives/delete-error.html',
  }
})
.directive('resetError', function(){
  return {
    require: 'fbModal',
    templateUrl: 'views/directives/reset-error.html',
  }
})
.directive('noSurveys', function(){
  return {
    require: 'fbModal',
    templateUrl: 'views/directives/no-surveys.html',
  }
})
.directive('voteRecieved', function(){
  return {
    require: 'fbModal',
    templateUrl: 'views/directives/vote-recieved.html',
  }
})
.directive('voteAlreadyRecieved', function(){
  return {
    require: 'fbModal',
    templateUrl: 'views/directives/vote-already-recieved.html',
  }
})
.directive('notOwner', function(){
  return {
    require: 'fbModal',
    templateUrl: 'views/directives/not-owner.html',
  }
})
.directive('confirmDelete', function(){
  return {
    require: 'fbModal',
    templateUrl: 'views/directives/confirm-delete.html',
  }
})
