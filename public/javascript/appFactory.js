/**
 * Created by lhz on 2015/3/24.
 */

angular.module('interviewAidFactory',[]).factory('InterviewQuestion', function($http){
    var baseUrl = window.location.origin;
    var listUrl = baseUrl + "/questions/list";
    var postUrl = baseUrl + "/questions";
    return {
        listQuestions: function(callback){
            $http({
                method: 'GET',
                url: listUrl
            }).success(callback);
        },
        postQuestion: function(data, callback){
            $http({
                method: 'POST',
                url: postUrl,
                data: data
            }).success(callback);
        }
    };
});
