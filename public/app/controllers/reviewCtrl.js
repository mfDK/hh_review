angular.module('reviewCtrl', ['reviewService'])
    .controller('reviewController', function(Review) {
        var rc = this;

        rc.processing = true;

        Review.all()
            .then(function(reviewData) {
                rc.processing = false;
                rc.reviews = reviewData.data;
            })
    })

    .controller('createReviewController', function(Review) {
        var rc = this;
        rc.type = 'create';

        rc.saveReview = function() {
            rc.processing = true;
            Review.create(rc.reviewData)
                .then(function(data) {
                    rc.processing = false;

                    rc.reviewData = {};
                    rc.message = data.data.message;
                });
        };
    })
