"use strict";
/*
    app.js, main Angular application script
    define your module and controllers here
*/

angular.module('AjaxChallenge', ['ui.bootstrap'])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'h0tqgleiZNs5iQE6sHYzbEN5IMB7heS8a5v9uioo';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = '844o94p79X6lTuTUGu4I16Z8npwhRXKNdgIb0x1o';
    })

    .controller('CommentController', function($scope, $http) {
        var commentsUrl = 'https://api.parse.com/1/classes/comments';

        $scope.refreshComments = function() {
            $scope.loading = true;
            $http.get(commentsUrl + '?order=-votes')
                .success(function(responseData) {
                    $scope.comments = responseData.results;
 //                   $scope.totalReview = data.results.length;
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                   $scope.loading = false;
                });
        } // $scope.refreshComments()

        // calls refreshComments() to get initial set of comments on page load
        $scope.refreshComments();

        // initializes new comment object on scope for new comment form
        $scope.newComment = {delete: false};

        // function to add new comment to list
        $scope.addComment = function(comment) {
            $scope.inserting = true;
            $http.post(commentsUrl, comment)
                .success(function(responseData) {
                    comment.objectId = responseData.objectId;
                    $scope.comments.push(comment);
 //                   $scope.newComment = {delete: false};
                    $scope.newComment = {vote: 0};
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.inserting = false;
                });
        };

        // function to update existing comment
        $scope.updateComment = function(comment) {
            $scope.updating = true;
            $http.put(commentsUrl + '/' + comment.objectId, comment)
                .success(function(responseData) {
                    // nothing to do since local object is already up-to-date
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.updating = false;
                });
        };

        $scope.removeComment = function(comment) {
            $http.delete(commentsUrl + '/' + comment.objectId)
                .success(function(repsonseData) {
                    // successful delete
                })
                .error(function(err) {
                    // error occurred
                })
                .finally(function() {
                    $scope.refreshComments();
                });
        };

        // function to increment votes
        $scope.incrementVotes = function(comment, amount) {


/*
            if ((comment.votes >= 0 && amount == 1) || (comment.votes >= 1 && amount == -1)) {
*/
                var postData = {
                    votes: {
                        __op: "Increment",
                        ammount: amount
                    }
                };
/*
            }
*/

            $scope.updating = true;
            $http.put(commentsUrl + '/' + comment.objectId, postData)
                .success(function(respData) {
                    comment.votes = respData.votes;
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.updating = false;
                });
        };
    });

/*
angular.module('AjaxChallenge')
    .controller('OverallRatingController', function($scope, $http) {
        $scope.newComment = {delete: true};

        var index;
        var total = 0;

        $http.get(commentsUrl + 'where={"delete": false}')
            .success(function(data) {
                index = data.results.length;

                for (var i = 0; i < index; ++i) {
                    total += parseFloat(data.results[i].rating);
                }

                if (total == 0 || isNaN(total)) {
                    $scope.percent = 0;
                    $scope.rating = 0;
                } else {
                    $scope.percent = 100 * total/(index * 5);
                    $scope.rating = ($scope.percent / 100) * 5;
                }
            });
    });*/
