(function () {
    angular
        .module('Project')
        .controller('ProfileController', ProfileController);

    function ProfileController($location, $routeParams, userService, currentUser) {

        var vm = this;

        // vm.uid = $routeParams['uid'];

        vm.uid = currentUser._id;
        vm.user = currentUser;
        vm.user.dateOfBirth = new Date(vm.user.dateOfBirth);

        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.logout = logout;
        vm.unregister = unregister;

        // vm.user = userService.findUserById(vm.uid);
        // userService
        //     .findUserById(vm.uid)
        //     .then(renderUser);

        // function init () {
        //     renderUser(currentUser);
        // }
        // init();

        function updateUser (userId, user) {
            vm.error = null;
            userService
                .updateUser(userId, user)
                .then(function () {
                    vm.message = "Updated successfully!";
                });

        }

        function deleteUser (userId) {
            userService
                .deleteUser(userId)
                .then(function () {
                    $location.url('/login');
                });
        }

        function logout() {
            userService
                .logout()
                .then(function() {
                        $location.url("/");
                    });
        }

        // function renderUser (user) {
        //     vm.user = user;
        // }

        function unregister() {
            userService
                .unregister()
                .then(function () {
                    $location.url('/');
            });
        }

    }
})();