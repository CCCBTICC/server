/**
 * Created by lhz on 2015/3/24.
 */

var askQuestionController = angular.module('askQuestionController', []);

askQuestionController.controller('AskQuestionCtrl', function ($scope, InterviewQuestion) {
    $scope.submitAQuestion = function () {
        var questionAddInfo = {};
        questionAddInfo.action = "create";
        questionAddInfo.data = {};
        questionAddInfo.data.description = $scope.desc;
        questionAddInfo.data.tags = $scope.tgs.split(";");
        InterviewQuestion.postQuestion(questionAddInfo,function(data, status){
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