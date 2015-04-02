/**
 * Created by lhz on 2015/3/24.
 */

angular.module('interviewAidFactory', []).factory('InterviewQuestion', function ($http) {
    var baseUrl = window.location.origin;
    var listQuestionUrl = baseUrl + "/questions/list";
    var postQuestionUrl = baseUrl + "/questions";
    var getQuestion = baseUrl + "/questions?id=";
    var postAnswerUrl = baseUrl + "/answers";
    return {
        listQuestions: function (callback) {
            $http({
                method: 'GET',
                url: listQuestionUrl
            }).success(callback);
        },
        postQuestion: function (questionAddInfo, callback) {
            $http({
                method: 'POST',
                url: postQuestionUrl,
                data: questionAddInfo
            }).success(callback);
        },
        delQuestion: function (questionDeleteInfo, callback) {
            $http({
                method: 'POST',
                url: postQuestionUrl,
                data: questionDeleteInfo
            }).success(callback);
        },
        getQuestionById: function (questionId, callback) {
            $http({
                method: 'GET',
                url: getQuestion + questionId
            }).success(callback);
        },
        postAnswer: function (answerAddInfo, callback) {
            $http({
                method: 'POST',
                url: postAnswerUrl,
                data: answerAddInfo
            }).success(callback);
        },
        delAnswer: function (answerDeleteInfo, callback) {
            $http({
                method: 'POST',
                url: postAnswerUrl,
                data: answerDeleteInfo
            }).success(callback);
        }
    };
});
