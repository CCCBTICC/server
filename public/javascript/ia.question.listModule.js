/**
 * Created by lhz on 2015/3/24.
 */
var moduleName = "interviewAid.angularUtils.question.listModule";

angular.module(moduleName, ['interviewAid.angularUtils.pagination', 'answerQuestionController'])
    .controller('QuestionListCtrl', ['$scope', '$location', '$modal', 'InterviewQuestion', function ($scope, $location, $modal, InterviewQuestion) {
        // Set up and initialization
        $scope.sortField = {'name': '$index', 'reverse': true};
        $scope.operation = {};

        // View switch
        $scope.setView = function (viewModel) {
            switch (viewModel) {
                case 'customer':
                    $scope.pageSize = 7;
                    $scope.currentPage = 1;
                    $scope.viewModel = 'customerView';
                    // get all questions for customer view
                    InterviewQuestion.listQuestions(function (result) {
                        $scope.questions = result;
                    });
                    break;
                case 'manager':
                    $scope.pageSize = 20;
                    $scope.currentPage = 1;
                    $scope.viewModel = 'managerView';
                    // get all questions for manager view
                    InterviewQuestion.listQuestions(function (result) {
                        $scope.fullInfoQuestions = result;
                    });
                    break;
            }
        };

        $scope.setView('customer');

        $scope.seeDetails = function (questionId) {
            var modalInstance = $modal.open({
                templateUrl: '../views/AnswerQuestion.html',
                controller: 'AnswerQuestionCtrlForManagerView',
                resolve: {
                    question: function () {
                        return questionId;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            });
        };


        // delete question
        $scope.deleteQuestion = function (questionId) {
            var questionDeleteInfo = {};
            questionDeleteInfo.action = "remove";
            questionDeleteInfo.data = {};
            questionDeleteInfo.data._id = questionId;

            InterviewQuestion.delQuestion(questionDeleteInfo, function (data, status) {
                if (status == 200) {
                    var index = 0;
                    for (index; index < $scope.questions.length; index++) {
                        if ($scope.questions[index]._id === questionId) {
                            break;
                        }
                    }
                    $scope.questions.splice(index, 1);
                }
            });
        };
    }]);