(function () {
    angular
        .module('Project')
        .controller('ProfileController', ProfileController);

    function ProfileController($location, $routeParams, userService, currentUser) {

        var vm = this;

        vm.uid = currentUser._id;
        vm.user = currentUser;
        vm.user.date_of_birth = new Date(vm.user.date_of_birth);

        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.logout = logout;
        vm.unregister = unregister;


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