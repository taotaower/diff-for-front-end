(function () {
    angular
        .module('Project')
        .controller('LoginController', LoginController);

    function LoginController($location, userService, $rootScope) {

        const vm = this;

        vm.login = login;

        function login(username, password) {
            if (username === null || username === '' || typeof username === 'undefined') {
                vm.error1 = 'Username required!';
                vm.error2 = null;
                vm.error3 = null;
                vm.submitted1 = true;
                return;
            }
            if (password === null || password === '' || typeof password === 'undefined') {
                vm.error1 = null;
                vm.error2 = 'Password required!';
                vm.error3 = null;
                vm.submitted2 = true;
                return;
            }
            vm.error1 = null;
            vm.error2 = null;
            // var found = userService.findUserByCredentials(username, password);
            userService
                // .findUserByCredentials(username, password)
                .login(username, password)
                .then(succeed, handleError);
            // success func. and error func.

            function handleError() {
                vm.error1 = null;
                vm.error2 = null;
                vm.error3 = "Sorry, no matching username and password is found. Please try again.";
            }

            function succeed (found) {
                if (found !== null) {
                    // vm.message = "Welcome " + username;
                    // $rootScope.currentUser = found;
                    $location.url('/profile');
                } else {
                    vm.error1 = null;
                    vm.error2 = null;
                    vm.error3 = "Sorry, no matching username and password is found. Please try again.";
                }
            }

        }}
})();