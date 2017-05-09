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

        rc.submitForm = function(isValid) {
            if (isValid) {
                rc.saveReview();
            } else {
                console.log("form is not valid")
            }
        }
        rc.saveReview = function() {
            console.log('reached create review method');
            rc.processing = true;
            Review.create(rc.reviewData)
                .then(function(data) {
                    rc.processing = false;

                    rc.reviewData = {};
                    rc.message = data.data.message;
                });
        };

        rc.cities = ["brooklyn", "queens", "manhattan", "bronx", "staten island"];
    })
