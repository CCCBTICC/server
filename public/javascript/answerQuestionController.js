/**
 * Created by lhz on 2015/3/29.
 */

angular.module('answerQuestionController', ['textAngular'])
    .config(function ($provide) {
        $provide.decorator('taOptions', ['$delegate', function(taOptions){
            taOptions.toolbar = [
                ['h1', 'h2', 'h3', 'p', 'pre', 'quote'],
                ['ul', 'ol', 'redo', 'undo', 'clear'],
                ['html', 'insertImage', 'insertLink']
            ];
            return taOptions;
        }]);
    })
    .controller('AnswerQuestionCtrl', ['$scope', '$routeParams', '$location', 'InterviewQuestion', function ($scope, $routeParams, $location, InterviewQuestion) {
        $scope.managerView = false;
        $scope.answer = {};
        $scope.answer.data = {};
        InterviewQuestion.getQuestionById($routeParams.questionId, function (result) {
            $scope.question = result;
        });

        $scope.submitAnAnswer = function (answerAddInfo, answerQuestionForm, answerQuestionFormDesc) {
            if (typeof answerAddInfo.data !== 'undefined' && !answerQuestionFormDesc.$error.required) {
                answerAddInfo.action = "create";
                answerAddInfo.data.questionId = $routeParams.questionId;
                InterviewQuestion.postAnswer(answerAddInfo, function (data, status) {
                    if (status == 200) {
                        InterviewQuestion.getQuestionById($routeParams.questionId, function (result) {
                            $scope.question = result;
                        });
                        $scope.resetAnswerInfo(answerQuestionForm);
                    }
                });
            }
        };

        $scope.deleteAnswer = function (answerId) {
            var answerDeleteInfo = {};
            answerDeleteInfo.action = "remove";
            answerDeleteInfo.data = {};
            answerDeleteInfo.data._id = answerId;

            InterviewQuestion.delAnswer(answerDeleteInfo, function (data, status) {
                if (status == 200) {
                    var index = 0;
                    for (index; index < $scope.question.answers.length; index++) {
                        if ($scope.question.answers[index]._id === answerId) {
                            break;
                        }
                    }
                    $scope.question.answers.splice(index, 1);
                }
            });
        };

        $scope.resetAnswerInfo = function (form) {
            if (form) {
                form.$setPristine();
                form.$setUntouched();
            }
            $scope.answer = {};
        };


        $scope.resetAnswerInfo();
    }])
    .controller('AnswerQuestionCtrlForManagerView', ['$scope', '$modalInstance', 'question', 'InterviewQuestion', function ($scope, $modalInstance, question, InterviewQuestion) {
        $scope.managerView = true;
        InterviewQuestion.getQuestionById(question, function (result) {
            $scope.question = result;
        });

        $scope.close = function () {
            $modalInstance.dismiss('close');
        };
    }]);