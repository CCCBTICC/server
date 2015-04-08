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
            controller: 'MainCtrl'
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

app.controller('navController', function ($scope) {
    $scope.menuItems = [
        {text: "Home", link: "#/"},
        {text: "Questions", link: "#/questions/list"}
    ];
    $scope.title = {text: "interviewAid", link: "#/"};
    $scope.buttons = [{
        text: "Sign in",
        click: function () {
            alert("sign in")
        },
        type: "btn-primary"
    }, {
        text: "Sign up",
        click: function () {
            alert("sign up")
        },
        type: "btn-success"
    }];
});

app.controller('DOMPositionCtrl', function ($scope, $location, $anchorScroll) {
    // back to top function
    $scope.goToTop = function () {
        $location.hash('topPosition');
        $anchorScroll();
    };
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