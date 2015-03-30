angular.module('CBTINavBar', []).directive('navBar', function () {
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
});