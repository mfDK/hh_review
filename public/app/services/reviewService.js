angular.module('reviewService', [])
    .factory('Review', function($http) {

        var reviewFactory = {};

        reviewFactory.all = function() {
            return $http.get('/reviews');
        };

        reviewFactory.get = function(id) {
            return $http.get('/reviews');
        };

        reviewFactory.create = function(reviewData) {
            return $http.post('/reviews', reviewData);
        };

        return reviewFactory;
    });
