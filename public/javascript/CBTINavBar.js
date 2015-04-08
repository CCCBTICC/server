angular.module('CBTINavBar', [])
    .directive('navBar', function () {
        return {
            restrict: 'EA',
            templateUrl: 'javascript/CBTINavBarTemplate.html',
            link: function (scope, element, attrs) {
                scope.menuOnClick = function (id) {
                    $('#' + id).tab('show');
                    $("#navbar-collapse").collapse('hide');
                }
            }
        }
    })
    .controller('navController', function ($scope) {
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