angular.module('userCtrl', ['userService'])
    .controller('userController', function(User) {
        var vm = this;

        // set a processing variable to show loading things
        vm.processing = true;

        // grab all the users at page loading
        User.all()
            .then(function(data) {
                vm.processing = false;
                vm.users = data;
            });
    })
