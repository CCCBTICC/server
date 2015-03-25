/**
 * Created by lhz on 2015/3/24.
 */

var app = angular.module('interviewAid',[
    'ngRoute',
    'interviewAidFactory',
    'askQuestionController',
    'listQuestionController'
]);

app.config(function($routeProvider){
    $routeProvider.
        when('/', {
            templateUrl: '../views/Main.html',
            controller: 'MainCtrl'
        }).
        when('/questions/list', {
            templateUrl: '../views/QuestionList.html',
            controller: 'QuestionListCtrl'
        }).
        when('/ask',{
            templateUrl: '../views/AskAQuestion.html',
            controller: 'AskQuestionCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
});