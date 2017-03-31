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
