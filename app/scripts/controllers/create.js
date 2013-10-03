'use strict';

angular.module('feedbachApp')
.controller('CreateCtrl', function ($scope, $routeParams, $http, $location, $modal, RandId) {
  // Variables
  $scope.active = 0;
  function modalThen(template,url1,url2){
    var modal = $modal.open({ templateUrl: '/views/modals/' + template + '.html' });
    modal.result.then(function close(){
      if (url1) $location.path(url1);
    },function dismiss(){
      if (url2) $location.path(url2);
    });
  }

  // Resource
  $http.get('/api/survey/' + $routeParams.id )
    .success(function(data){
      if (data.owner) $location.path('/view/' + $routeParams.id);
      else modalThen('not-owner','/create/' + RandId.create(), '/');
    })
    .error(function(data, status){
      if (403 == status) modalThen('not-owner','/create/' + RandId.create(),'/');
    });
  $scope.placeholder = {
    description: 'Great description',
    question: 'What is the meaning of life?',
    answers: [
      'Skiing',
      '42',
      'Simple life',
      'There is no meaning'
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
    $http.post('/api/survey/', $scope.survey).success(function(){
      $location.path('/view/' + $scope.survey.id);
    })
    .error(function(){
      modalThen('create-error');
    });
  }
});
