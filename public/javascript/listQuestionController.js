/**
 * Created by lhz on 2015/3/24.
 */

var listQuestionController = angular.module('listQuestionController', []);

listQuestionController.controller('QuestionListCtrl', function ($scope, InterviewQuestion) {
    $scope.sortField = '$index';
    $scope.reverse = true;

    InterviewQuestion.listQuestions(function (result) {
        $scope.questions = result;

    });

    $scope.deleteQuestion = function (questionId) {
        var questionDeleteInfo = {};
        questionDeleteInfo.action = "remove";
        questionDeleteInfo.data = {};
        questionDeleteInfo.data._id = questionId;

        InterviewQuestion.delQuestion(questionDeleteInfo, function (data, status) {
            if(status==200){
                var i = $scope.questions.indexOf(questionId);
                $scope.questions.splice(i, 1);
            }
        });
    };
});