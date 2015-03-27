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

app.controller('menuCtrl', ['$scope', function($scope) {
  $scope.menus = ['Home', 'Problems', 'Discuss'];
}])
.directive('customMenu', function(){
	return {
		restrict: 'E',
		template:'<ul class="nav navbar-nav"><li ng-repeat="menu in menus"><a href="#/">{{menu}}</a></li></ul>',
		
	}
})
