angular.module('authService', [])
    .factory('Auth', function($http, $q, AuthToken) {
        var authFactory = {};

        authFactory.login = function(email, password) {
            return $http.post('/api/authenticate', {
                email: email,
                password: password
            })
            .then(function(data) {
                AuthToken.setToken(data.data.token);
                return data;
            });
        }
        authFactory.logout = function() {
            // clear the token
            AuthToken.setToken();
        };

        authFactory.isLoggedIn = function() {
            if (AuthToken.getToken()) {
                return true;
            } else {
                return false;
            }
        };

        authFactory.getUser = function() {
            if (AuthToken.getToken()) {
                return $http.get('/api/me', { cache: true });
            } else {
                return $q.reject({
                    message: 'User has no token'
                });
            }
        };

        return authFactory
    })

    // factory for handling tokens, inject $window to store token client-side
    .factory('AuthToken', function($window) {
        var authTokenFactory = {};

        // get the token out of local storage from browser
        authTokenFactory.getToken = function() {
            return $window.localStorage.getItem('token');
        }

        // set the token or clear the token if token is passed set, if no clear it from local storage
        authTokenFactory.setToken = function(token) {
            if (token) {
                $window.localStorage.setItem('token', token);
            } else {
                $window.localStorage.removeItem('token');
            }
        };

        return authTokenFactory;
    })

    // application configuration to integrate token into requests
    .factory('AuthInterceptor', function($q, $location ,AuthToken) {
        var interceptorFactory = {};

        // attach the token to every requests
        interceptorFactory.request = function(config) {

            var token = AuthToken.getToken();
            // if token exists add it to the header as x-access-control
            if (token) {
                config.headers['x-access-control'] = token;
            }
            return config;
        };

        // redirect if a token doesn't authenticate
        interceptorFactory.responseError = function(response) {
            if (response.status === 403) {
                AuthToken.setToken();
                $location.path('/');
            }
            return $q.reject(response);
        };

        return interceptorFactory;
    });
