/**
 * Created by lhz on 2015/3/24.
 */

var app = angular.module('interviewAid', [
    'ngRoute',
    'ui.bootstrap',
    'ia.Utils'
]);

app.config(function ($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: '../views/Main.html',
            controller: 'IndexPageCtrl'
        }).
        when('/questions/list', {
            templateUrl: '../views/QuestionList.html',
            controller: 'QuestionListCtrl'
        }).
        when('/ask', {
            templateUrl: '../views/AskAQuestion.html',
            controller: 'QuestionAskedCtrl'
        }).
        when('/question/:questionId', {
            templateUrl: '../views/AnswerQuestion.html',
            controller: 'AnswerQuestionCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
});

app.directive("goToTop", function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            angular.element($window).bind("scroll", function () {
                if (this.pageYOffset >= 70) {
                    scope.visible = true;
                } else {
                    scope.visible = false;
                }
                scope.$apply();
            });
            element.on('click', function () {
                $("body, html").stop(true, true).animate({scrollTop: $("#topPosition").offset().top}, "slow");
            });
        }
    }
});