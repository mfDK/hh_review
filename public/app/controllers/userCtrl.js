angular.module('userCtrl', ['userService'])
    .controller('userController', function(User) {
        var vm = this;

        // set a processing variable to show loading things
        vm.processing = true;

        User.all()
            .then(function(data) {
                vm.processing = false;
                vm.users = data.data;
            });
        vm.deleteUser = function(id) {
            vm.processing = true;

            User.delete(id)
                .then(function(data) {
                    User.all()
                        .then(function(data) {
                            vm.processing = false;
                            vm.users = data.data;
                        });
                });
        }
    })
    .controller('userCreateController', function(User) {
        var vm = this;
        // variable to hide/show elements of the views
        // differentiates between create edit pages
        vm.type = 'create';

        vm.saveUser = function() {
            vm.processing = true;
            User.create(vm.userData)
                .then(function(data) {
                    vm.processing = false;

                    // clear the form
                    vm.userData = {};
                    vm.message = data.data.message;
                });
        };
    })
    .controller('userEditController', function($routeParams ,User) {
        var vm = this;

        vm.type = 'edit';

        User.get($routeParams.user_id)
            .then(function(data) {
                vm.userData = data.data;
            });

        // function to save user after getting the params
        vm.saveUser = function() {
            vm.processing = true;
            vm.message = '';

            User.update($routeParams.user_id, vm.userData)
                .then(function(data) {
                    vm.processing = false;
                    vm.userData = {};

                    vm.message = data.data.message;
                });
        };
    });
