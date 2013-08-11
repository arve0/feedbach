'use strict';

angular.module('feedbachApp')
.controller('CreateCtrl', function ($scope, $routeParams, $http, $location) {
  $scope.active = 0;
  $http.get('/' + $routeParams.id + '.json')
    .success(function(data){
      if (data.owner) $location.path('/edit/' + $routeParams.id);
      else $location.path('/'); //TODO: modal
    });
  $scope.placeholder = {
    description: 'Optional description',
    question: 'Where are my pants?',
    answers: [
      'On your legs.',
      'In the bathroom.',
      'In the washing machine.',
      'On the roof.'
    ]
  }
  $scope.survey = { // Modell
    id: $routeParams.id,
    description: '',
    questions: [
    {
      question: '',
      answers: [
        { answer: '' },
        { answer: ''}
      ]
    }]
  }
  $scope.setActive = function(index) {
    $scope.active = index;
  }
  $scope.addQuestion = function() {
    if (6 > $scope.survey.questions.length) {
      $scope.survey.questions.push( { question: '', answers: [ { answer: '' }, { answer: '' } ] } );
      $scope.active = $scope.survey.questions.length - 1;
    }
  }
  $scope.delQuestion = function(index) {
    if (1 < $scope.survey.questions.length) {
      $scope.survey.questions.splice(index, 1);
      $scope.active = (0 == index? 0 : index - 1);
    }
  }
  $scope.addAnswer = function(index) {
    if (4 > $scope.survey.questions[index].answers.length) {
      $scope.survey.questions[index].answers.push( { answer: '' });
    }
  }
  $scope.delAnswer = function(q_index, a_index) {
    if (2 < $scope.survey.questions[q_index].answers.length) {
      $scope.survey.questions[q_index].answers.splice(a_index, 1);
    }
  }
  $scope.submitSurvey = function() {
    console.log(JSON.stringify($scope.survey, null, 2));
    $http.post('/create', $scope.survey).success(function(){
      $location.path('/view/' + $scope.survey.id);
    })
    .error(function(){
      alert('error');
    });
  }
});
