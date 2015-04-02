/**
 * Created by LHZ on 2015/4/2.
 */

var moduleName = 'interviewAid.angularUtils.pagination';
var DEFAULT_ID = '_default_';

angular.module(moduleName, ["template/pagination/iaPagination.html"])
    .constant('paginationConfig', {
        'currentPage': 1,
        'pageSize': 10,
        'maxPaginationCtrlSize': 7
    }).controller('iaPaginationCrtl', ['$scope', 'paginationConfig', function ($scope, paginationConfig) {
        if (!$scope.currentPage) {
            $scope.currentPage = paginationConfig.currentPage;
        }
        if (!$scope.pageSize) {
            $scope.pageSize = paginationConfig.pageSize;
        }
    }])
    .directive('iaPagination', ['$compile', '$parse', '$timeout', 'paginationConfig', 'paginationService', function ($compile, $parse, $timeout, paginationConfig, paginationService) {
        return {
            terminal: true,
            multiElement: true,
            controller: 'iaPaginationCrtl',
            priority: 5000,
            compile: function paginationCompileFn(tElement, tAttrs) {
                var expression = tAttrs.iaPagination;
                // regex taken directly from https://github.com/angular/angular.js/blob/master/src/ng/directive/ngRepeat.js#L211

                // match will be an array, like:
                // Array [ "question in questions | filter:q | itemsPerPage: pageSize", "question", "questions | filter:q | itemsPerPage: pageSize", undefined ]

                var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);

                var filterPattern = /\|\s*itemsPerPage\s*:[^|]*/;
                var itemsPerPageFilterRemoved = match[2].replace(filterPattern, '');
                var collectionGetter = $parse(itemsPerPageFilterRemoved);

                var id = tAttrs.paginationId || DEFAULT_ID;
                paginationService.registerInstance(id);

                return function dirPaginationLinkFn(scope, element, attrs) {
                    var paginationId = $parse(attrs.paginationId)(scope) || attrs.paginationId || DEFAULT_ID;
                    paginationService.registerInstance(paginationId);

                    var repeatExpression;
                    if (paginationId !== DEFAULT_ID) {
                        repeatExpression = expression.replace(/(\|\s*itemsPerPage\s*:[^|]*)/, "$1 : '" + paginationId + "'");
                    } else {
                        repeatExpression = expression;
                    }

                    attrs.$set('ngRepeat', repeatExpression);
                    var compiled = $compile(element, false, 5000);

                    var currentPageGetter = $parse(attrs.currentPage) || paginationConfig.currentPage;
                    paginationService.setCurrentPageParser(paginationId, currentPageGetter, scope);

                    scope.$watchCollection(function () {
                        return collectionGetter(scope);
                    }, function (collection) {
                        if (collection) {
                            paginationService.setCollectionLength(paginationId, collection.length);
                        }
                    });

                    compiled(scope);
                }
            }
        }
    }])
    .directive('iaPaginationControls', ['paginationConfig', 'paginationService', function (paginationConfig, paginationService) {
        var numberRegex = /^\d+$/;

        function generatePagesArray(currentPage, collectionLength, rowsPerPage, paginationRange) {
            var pages = [];
            var totalPages = Math.ceil(collectionLength / rowsPerPage);
            var halfWay = Math.ceil(paginationRange / 2);
            var position;

            if (currentPage <= halfWay) {
                position = 'start';
            } else if (totalPages - halfWay < currentPage) {
                position = 'end';
            } else {
                position = 'middle';
            }

            var ellipsesNeeded = paginationRange < totalPages;
            var i = 1;
            while (i <= totalPages && i <= paginationRange) {
                var pageNumber = calculatePageNumber(i, currentPage, paginationRange, totalPages);

                var openingEllipsesNeeded = (i === 2 && (position === 'middle' || position === 'end'));
                var closingEllipsesNeeded = (i === paginationRange - 1 && (position === 'middle' || position === 'start'));
                if (ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded)) {
                    pages.push('...');
                } else {
                    pages.push(pageNumber);
                }
                i++;
            }
            return pages;
        }

        function calculatePageNumber(i, currentPage, paginationRange, totalPages) {
            var halfWay = Math.ceil(paginationRange / 2);
            if (i === paginationRange) {
                return totalPages;
            } else if (i === 1) {
                return i;
            } else if (paginationRange < totalPages) {
                if (totalPages - halfWay < currentPage) {
                    return totalPages - paginationRange + i;
                } else if (halfWay < currentPage) {
                    return currentPage - halfWay + i;
                } else {
                    return i;
                }
            } else {
                return i;
            }
        }

        return {
            restrict: 'AE',
            controller: 'iaPaginationCrtl',
            templateUrl: 'template/pagination/iaPagination.html',
            scope: {
                maxSize: '=?',
                onPageChange: '&?',
                paginationId: '=?'
            },
            link: function dirPaginationControlsLinkFn(scope, element, attrs) {
                var paginationId = scope.paginationId || attrs.paginationId || DEFAULT_ID;


                scope.maxSize = !scope.maxSize ? paginationConfig.maxPaginationCtrlSize : scope.maxSize;

                scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : true;
                scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : false;

                var paginationRange = Math.max(scope.maxSize, 3);
                scope.pages = [];
                scope.pagination = {
                    last: 1,
                    current: 1
                };
                scope.range = {
                    lower: 1,
                    upper: 1,
                    total: 1
                };

                scope.$watch(function () {
                    return (paginationService.getCollectionLength(paginationId) + 1) * paginationService.getItemsPerPage(paginationId);
                }, function (length) {
                    if (0 < length) {
                        generatePagination();
                    }
                });

                scope.$watch(function () {
                    return (paginationService.getItemsPerPage(paginationId));
                }, function (current, previous) {
                    if (current != previous) {
                        goToPage(scope.pagination.current);
                    }
                });

                scope.$watch(function () {
                    return paginationService.getCurrentPage(paginationId);
                }, function (currentPage, previousPage) {
                    if (currentPage != previousPage) {
                        goToPage(currentPage);
                    }
                });

                scope.setCurrent = function (num) {
                    if (isValidPageNumber(num)) {
                        paginationService.setCurrentPage(paginationId, num);
                    }
                };

                function goToPage(num) {
                    if (isValidPageNumber(num)) {
                        scope.pages = generatePagesArray(num, paginationService.getCollectionLength(paginationId), paginationService.getItemsPerPage(paginationId), paginationRange);
                        scope.pagination.current = num;
                        updateRangeValues();

                        if (scope.onPageChange) {
                            scope.onPageChange({newPageNumber: num});
                        }
                    }
                }

                function generatePagination() {
                    var page = parseInt(paginationService.getCurrentPage(paginationId)) || 1;

                    scope.pages = generatePagesArray(page, paginationService.getCollectionLength(paginationId), paginationService.getItemsPerPage(paginationId), paginationRange);
                    scope.pagination.current = page;
                    scope.pagination.last = scope.pages[scope.pages.length - 1];
                    if (scope.pagination.last < scope.pagination.current) {
                        scope.setCurrent(scope.pagination.last);
                    } else {
                        updateRangeValues();
                    }
                }

                function updateRangeValues() {
                    var currentPage = paginationService.getCurrentPage(paginationId),
                        itemsPerPage = paginationService.getItemsPerPage(paginationId),
                        totalItems = paginationService.getCollectionLength(paginationId);

                    scope.range.lower = (currentPage - 1) * itemsPerPage + 1;
                    scope.range.upper = Math.min(currentPage * itemsPerPage, totalItems);
                    scope.range.total = totalItems;
                }

                function isValidPageNumber(num) {
                    return (numberRegex.test(num) && (0 < num && num <= scope.pagination.last));
                }
            }
        };
    }])
    .filter('itemsPerPage', ['paginationService', function (paginationService) {
        return function (collection, itemsPerPage, paginationId) {
            if (typeof (paginationId) === 'undefined') {
                paginationId = DEFAULT_ID;
            }
            if (!paginationService.isRegistered(paginationId)) {
                throw 'pagination directive: the itemsPerPage id argument (id: ' + paginationId + ') does not match a registered pagination-id.';
            }
            var end;
            var start;
            if (collection instanceof Array) {
                itemsPerPage = parseInt(itemsPerPage) || 9999999999;
                if (paginationService.isAsyncMode(paginationId)) {
                    start = 0;
                } else {
                    start = (paginationService.getCurrentPage(paginationId) - 1) * itemsPerPage;
                }
                end = start + itemsPerPage;
                paginationService.setItemsPerPage(paginationId, itemsPerPage);

                return collection.slice(start, end);
            } else {
                return collection;
            }
        };
    }])
    .service('paginationService', function () {
        var instances = {};
        var lastRegisteredInstance;

        this.registerInstance = function (instanceId) {
            if (typeof instances[instanceId] === 'undefined') {
                instances[instanceId] = {
                    asyncMode: false
                };
                lastRegisteredInstance = instanceId;
            }
        };

        this.isRegistered = function (instanceId) {
            return (typeof instances[instanceId] !== 'undefined');
        };

        this.setCurrentPageParser = function (instanceId, val, scope) {
            instances[instanceId].currentPageParser = val;
            instances[instanceId].context = scope;
        };
        this.setCurrentPage = function (instanceId, val) {
            instances[instanceId].currentPageParser.assign(instances[instanceId].context, val);
        };
        this.getCurrentPage = function (instanceId) {
            var parser = instances[instanceId].currentPageParser;
            return parser ? parser(instances[instanceId].context) : 1;
        };

        this.setItemsPerPage = function (instanceId, val) {
            instances[instanceId].itemsPerPage = val;
        };
        this.getItemsPerPage = function (instanceId) {
            return instances[instanceId].itemsPerPage;
        };

        this.setCollectionLength = function (instanceId, val) {
            instances[instanceId].collectionLength = val;
        };
        this.getCollectionLength = function (instanceId) {
            return instances[instanceId].collectionLength;
        };

        this.setAsyncModeTrue = function (instanceId) {
            instances[instanceId].asyncMode = true;
        };

        this.isAsyncMode = function (instanceId) {
            return instances[instanceId].asyncMode;
        };
    });
;


angular.module("template/pagination/iaPagination.html", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("template/pagination/iaPagination.html",
        "<ul class=\"pagination\" ng-if=\"1 < pages.length\">\n" +
        "   <li ng-if=\"boundaryLinks\" ng-class=\"{ disabled : pagination.current == 1 }\">\n" +
        "       <a href=\"\" ng-click=\"setCurrent(1)\"><span class=\"glyphicon glyphicon-step-backward\" aria-hidden=\"true\"></span></a>\n" +
        "   </li>\n" +
        "   <li ng-if=\"directionLinks\" ng-class=\"{ disabled : pagination.current == 1 }\" class=\"ng-scope\">\n" +
        "       <a href=\"\" ng-click=\"setCurrent(pagination.current - 1)\" class=\"ng-binding\"><span class=\"glyphicon glyphicon-backward\" aria-hidden=\"true\"></a>\n" +
        "   </li>\n" +
        "   <li ng-repeat=\"pageNumber in pages track by $index\" ng-class=\"{ active : pagination.current == pageNumber, disabled : pageNumber == '...' }\">\n" +
        "       <a href=\"\" ng-click=\"setCurrent(pageNumber)\">{{ pageNumber }}</a>\n" +
        "   </li>\n" +
        "   <li ng-if=\"directionLinks\" ng-class=\"{ disabled : pagination.current == pagination.last }\" class=\"ng-scope\">\n" +
        "       <a href=\"\" ng-click=\"setCurrent(pagination.current + 1)\" class=\"ng-binding\"><span class=\"glyphicon glyphicon-forward\" aria-hidden=\"true\"></a>\n" +
        "   </li>\n" +
        "   <li ng-if=\"boundaryLinks\"  ng-class=\"{ disabled : pagination.current == pagination.last }\">\n" +
        "       <a href=\"\" ng-click=\"setCurrent(pagination.last)\"><span class=\"glyphicon glyphicon-step-forward\" aria-hidden=\"true\"></a>\n" +
        "   </li>\n" +
        "</ul>\n"
    );
}]);