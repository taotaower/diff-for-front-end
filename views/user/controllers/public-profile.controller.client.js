(function () {
    angular
        .module('Project')
        .controller('PublicProfileController', PublicProfileController);

    function PublicProfileController($location, $routeParams, userService, currentUser) {

        var vm = this;

        // vm.uid = currentUser._id;
        vm.user = currentUser;
        vm.other_username = $routeParams.username;

        function init() {
            userService
                .findUserByUsername(vm.other_username)
                .then(renderUser);
        }
        init();

        // function init () {
        //     renderUser(currentUser);
        // }
        // init();

        function renderUser (other_user) {
            vm.other_user = other_user;
        }

    }
})();