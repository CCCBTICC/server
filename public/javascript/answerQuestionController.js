/**
 * Created by lhz on 2015/3/29.
 */

var answerQuestionController = angular.module('answerQuestionController', []);

answerQuestionController.controller('AnswerQuestionCtrl', function ($scope, $routeParams, $location, InterviewQuestion) {
    $scope.question = InterviewQuestion.tempQuestion;

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
});