angular.module('mainCtrl', [])
    .controller('mainController', function($rootScope, $location, Auth) {
        var vm = this;

        vm.loggedIn = Auth.isLoggedIn();

        $rootScope.$on('$routeChangeStart', function() {
            vm.loggedIn = Auth.isLoggedIn();

            Auth.getUser()
                .then(function(data) {
                    vm.user = data.data;
                });
        });

        vm.doLogin = function() {
            vm.processing = true;

            // clear the error
            vm.error = '';
            console.log('Got Here');
            Auth.login(vm.loginData.email, vm.loginData.password)
                .then(function(data) {
                    vm.processing = false;
                    if (data.data.success) {
                        $location.path('/users');
                    } else {
                        vm.error = data.message;
                    }
                });
        };

        vm.doLogout = function() {
            Auth.logout();

            vm.user = {};
            $location.path('/login');
        };
    });
