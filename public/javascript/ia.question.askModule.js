/**
 * Created by lhz on 2015/3/24.
 */
var moduleName = "interviewAid.angularUtils.question.askedModule";

angular.module(moduleName, [])
    .constant('askQuestionConfig', {
        'totalNumOfTags': 5
    })
    .controller('QuestionAskedCtrl', ['$scope', '$location', '$filter', 'InterviewQuestion', 'askQuestionConfig', function ($scope, $location, $filter, InterviewQuestion, askQuestionConfig) {
        // initialization
        $scope.totalNumOfTags = askQuestionConfig.totalNumOfTags;

        // This function will handle tags entered by user
        $scope.getTagList = function () {
            $scope.tagsList = $filter('tagsFilter')($scope.question.data.tags);
        };

        // This function will handle submit button
        $scope.submitAQuestion = function (questionAddInfo, askQuestionFormTitle, askQuestionFormDesc) {
            if (typeof questionAddInfo.data !== 'undefined' && !askQuestionFormTitle.$error.required && !askQuestionFormDesc.$error.required) {
                questionAddInfo.action = "create";
                questionAddInfo.data.tags = $scope.tagsList;

                InterviewQuestion.postQuestion(questionAddInfo, function (data, status) {
                    if (status == 200) {
                        $location.path("/questions/list");
                    }
                });
            }
        };

        // This function will handle reset button
        $scope.resetQuestionInfo = function (form) {
            if (form) {
                form.$setPristine();
                form.$setUntouched();
            }
            $scope.question = {};
        };


        $scope.resetQuestionInfo();
    }])
    .filter('tagsFilter', ['askQuestionConfig', function (askQuestionConfig) {
        function tagsFilterFn(input) {
            // config and initialization
            var max = askQuestionConfig.totalNumOfTags;
            var tags = [];
            if (typeof input !== 'undefined') {
                tags = input.toString().toLowerCase().split(";");
            }

            // delete duplicate tags
            var tempObj = {};
            for (var index = 0, j = tags.length; index < j; index++) {
                tempObj[tags[index].trim()] = true;
            }
            tags = [];
            var tag;
            for (tag in tempObj) {
                if (tempObj.hasOwnProperty(tag)) {
                    tags.push(tag);
                }
            }

            // delete empty tags and cut into tags[maxTags] array
            for (var i = 0, length = tags.length; i < length && i < max; i++) {
                if (tags[i].trim() === "") {
                    tags.splice(i, 1);
                    length = tags.length;
                    i--;
                }
            }
            tags.length = tags.length > max ? max : tags.length;

            // return result;
            return tags;
        }

        tagsFilterFn.$stateful = true;
        return tagsFilterFn;
    }]);