angular.module('mainCtrl', [])
    .controller('mainController', function($rootScope, $location, Auth) {
        var vm = this;

        // get info if a person is logged in
        vm.loggedIn = Auth.isLoggedIn();

        $rootScope.$on('$routeChangeStart', function() {
            vm.loggedIn = Auth.isLoggedIn();

            // get user info on route change
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
                    console.log(data.data.success);
                    vm.processing = false;
                    if (data.data.success) {
                        $location.path('/users');
                    } else {
                        vm.error = data.data.message;
                    }
                });
        };

        // function to handle logging out
        vm.doLogout = function() {
            Auth.logout();

            // reset all user info
            vm.user = {};
            $location.path('/login');
        };
    });
