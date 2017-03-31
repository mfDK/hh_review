angular.module('reviewService', [])
    .factory('Review', function($http) {

        var reviewFactory = {};

        reviewFactory.all = function() {
            return $http.get('/reviews')
        };

        return reviewFactory;

    })
