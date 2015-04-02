/**
 * Created by lhz on 2015/3/29.
 */

var answerQuestionController = angular.module('answerQuestionController', []);

answerQuestionController.controller('AnswerQuestionCtrl', function ($scope, $routeParams, $location, InterviewQuestion) {
    InterviewQuestion.getQuestionById($routeParams.questionId, function (result) {
        console.log($routeParams.questionId);
        $scope.question = result;
        console.log($scope.question);
    });

    $scope.submitAnAnswer = function () {
        var answerAddInfo = {};
        answerAddInfo.action = "create";
        answerAddInfo.data = {};
        answerAddInfo.data.questionId = $routeParams.questionId;
        answerAddInfo.data.description = $scope.desc;
        InterviewQuestion.postAnswer(answerAddInfo, function (data, status) {
            if (status == 200) {
                $location.path("/question/" + $routeParams.questionId);
                alert("answer success");
            }
        });
    }

    $scope.deleteAnswer = function (answerId) {
        var answerDeleteInfo = {};
        answerDeleteInfo.action = "remove";
        answerDeleteInfo.data = {};
        answerDeleteInfo.data._id = answerId;

        InterviewQuestion.delAnswer(answerDeleteInfo, function (data, status) {
            if (status == 200) {
                var index = 0;
                for (index; index < $scope.question.answers.length; index++) {
                    if ($scope.question.answers[index]._id === answerId) {
                        break;
                    }
                }
                $scope.question.answers.splice(index, 1);
            }
        });
    };
});