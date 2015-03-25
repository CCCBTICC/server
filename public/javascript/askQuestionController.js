/**
 * Created by lhz on 2015/3/24.
 */

var askQuestionController = angular.module('askQuestionController', []);

askQuestionController.controller('AskQuestionCtrl', function ($scope, InterviewQuestion) {
    $scope.submitAQuestion = function () {
        var question = {};
        question.action = "create";
        question.data = {};
        question.data.description = $scope.desc;
        question.data.tags = $scope.tgs.split(";");
        InterviewQuestion.postQuestion(question,function(data, status){
            console.log("data-->" + data + "\nstatus" + status);
        });

        //var url = window.location.origin + "/questions";
        //$http({
        //    method: 'POST',
        //    url: url,
        //    data: question
        //}).success(function (data, status) {
        //    console.log("data-->" + data + "\nstatus" + status);
        //});
    };
});