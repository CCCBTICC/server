/**
 * Created by lhz on 2015/3/24.
 */

var listQuestionController = angular.module('listQuestionController', ['interviewAid.angularUtils.askQuestionModule']);

listQuestionController.controller('QuestionListCtrl', function ($scope, $location, InterviewQuestion) {
    // for search
    $scope.sortField = '$index';
    $scope.reverse = true;

    // pagination config
    $scope.pageSize = 6;

    // get all questions from database
    InterviewQuestion.listQuestions(function (result) {
        $scope.questions = result;
    });

    // delete question
    $scope.deleteQuestion = function (questionId) {
        var questionDeleteInfo = {};
        questionDeleteInfo.action = "remove";
        questionDeleteInfo.data = {};
        questionDeleteInfo.data._id = questionId;

        InterviewQuestion.delQuestion(questionDeleteInfo, function (data, status) {
            if (status == 200) {
                var index = 0;
                for (index; index < $scope.questions.length; index++) {
                    if ($scope.questions[index]._id === questionId) {
                        break;
                    }
                }
                $scope.questions.splice(index, 1);
            }
        });
    };
});