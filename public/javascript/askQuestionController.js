/**
 * Created by lhz on 2015/3/24.
 */

var askQuestionController = angular.module('askQuestionController', []);

askQuestionController.controller('AskQuestionCtrl', function ($scope, $location, InterviewQuestion) {
    $scope.submitAQuestion = function () {
        var questionAddInfo = {};
        var tags = [];
        questionAddInfo.action = "create";
        questionAddInfo.data = {};
        questionAddInfo.data.title = $scope.title;
        questionAddInfo.data.description = $scope.desc;
        tags = $scope.tgs.toLowerCase().split(";");
        for (var i = 0, max = 5, length = tags.length; i < length && i < max; i++) {
            if (tags[i].trim() === "") {
                tags.splice(i, 1);
                length = tags.length;
                i--;
            }
        }
        tags.length = tags.length > 5 ? 5 : tags.length;
        questionAddInfo.data.tags = tags;
        InterviewQuestion.postQuestion(questionAddInfo, function (data, status) {
            if (status == 200) {
                $location.path("/questions/list");
            }
        });
    };
});