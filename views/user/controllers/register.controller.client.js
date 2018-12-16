(function () {
    angular
        .module('Project')
        .controller('RegisterController', RegisterController);

    function RegisterController($location, userService) {

        var vm = this;

        vm._register = _register;

        function _register(username, password, password2) {

            if (username === null || username === '' || typeof username === 'undefined') {
                vm.error1 = 'Username required!';
                vm.error2 = null;
                vm.error3 = null;
                vm.error4 = null;
                vm.submitted1 = true;
                return;
            }

            if (password === null || password === '' || typeof password === 'undefined') {
                vm.error1 = null;
                vm.error2 = 'Password required!';
                vm.error3 = null;
                vm.error4 = null;
                vm.submitted2 = true;
                return;
            }

            if (password2 === null || password2 === '' || typeof password2 === 'undefined') {
                vm.error1 = null;
                vm.error2 = null;
                vm.error3 = 'Verifying Password required!';
                vm.error4 = null;
                vm.submitted3 = true;
                return;
            }

            if (password !== password2) {
                vm.error1 = null;
                vm.error2 = null;
                vm.error3 = null;
                vm.error4 = "Passwords must match!";
                vm.password = "";
                vm.password2 = "";
                vm.submitted2 = true;
                vm.submitted3 = true;
                return;
            }
            vm.error1 = null;
            vm.error2 = null;
            vm.error3 = null;
            vm.error4 = null;

            userService
                .findUserByUsername(username)
                .then(checkUser);

            function checkUser(user) {
                console.log("checkUser", user);
                if (user.length > 0) {
                    vm.error1 = "Sorry, the username you just picked is already taken.";
                } else {
                    let newUser = {
                        username: username,
                        password: password,
                        role: "MEMBER",
                    };

                    userService
                        .register(newUser)
                        .then(function () {
                            $location.url('/profile');
                        });
                }

            }
        }
    }
})();