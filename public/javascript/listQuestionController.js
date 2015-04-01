/**
 * Created by lhz on 2015/3/24.
 */

var listQuestionController = angular.module('listQuestionController', []);

listQuestionController.controller('QuestionListCtrl', function ($scope, $location, InterviewQuestion) {
    //for search
    $scope.sortField = '$index';
    $scope.reverse = true;

    //for pagination
    $scope.currentPage = 1;
    $scope.totalPage = 1;
    $scope.pageSize = 6;
    $scope.pages = [];
    $scope.endPage = 1;


    // get all questions from database
    InterviewQuestion.listQuestions(function (result) {
        $scope.allQuestions = result;
        $scope.load();
    });

    // change active
    $scope.pageOnClick = function (currentPage) {
        $("#" + currentPage).tab("show");
    };

    // on page load
    $scope.load = function () {
        // get total pages
        $scope.totalPage = Math.ceil($scope.allQuestions.length / $scope.pageSize);
        $scope.endPage = $scope.allQuestions.totalPage;
        // generate
        $scope.pages = [];
        for (var i = -2, total = 1; (i + 3) <= $scope.totalPage && total <= 5; total++, i++) {
            $scope.pages.push(($scope.currentPage > 2) && ($scope.totalPage > 5) ? ($scope.currentPage < ($scope.totalPage - 2) ? ($scope.currentPage + i) : $scope.totalPage - 5 + total) : total);
        }

        // cut all data to one page data
        $scope.questions = $scope.allQuestions.slice(($scope.currentPage - 1) * $scope.pageSize, $scope.currentPage * $scope.pageSize);

        $scope.pageOnClick($scope.currentPage);
    };

    // change to next page
    $scope.next = function () {
        if ($scope.currentPage < $scope.totalPage) {
            $scope.currentPage++;
            $scope.load();
            $scope.pageOnClick($scope.currentPage);
        }
    };

    // change to previous page
    $scope.prev = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
            $scope.load();
            $scope.pageOnClick($scope.currentPage);
        }
    };

    $scope.loadPage = function (page) {
        $scope.currentPage = page;
        $scope.load();
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

    // transfer question will be answered to answer page
    $scope.goToAnswerQuestion = function (questionObj) {
        InterviewQuestion.tempQuestion = questionObj;
        $location.path("/question/" + questionObj._id);
    }
});