angular
    .module('userApp', [
        'ngAnimate',
        'app.routes',
        'authService',
        'mainCtrl',
        'userCtrl',
        'reviewCtrl',
        'userService',
        'reviewService'
    ])
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    });
