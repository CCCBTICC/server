/**
 * Created by lhz on 2015/3/24.
 */

var listQuestionController = angular.module('listQuestionController', []);

listQuestionController.controller('QuestionListCtrl', function ($scope, InterviewQuestion) {
    InterviewQuestion.listQuestions(function(result){
        $scope.questions = result;
    });
});