(function () {
    angular
        .module('Project')
        .controller('AdminUserController', adminUserController);

    function adminUserController(userService, currentUser) {
        var vm = this;

        vm.user = currentUser;
        vm.url = window.location.href.split('#!')[1];

        vm.createUser = createUser;
        vm.deleteUser = deleteUser;
        vm.selectUser = selectUser;
        vm.updateUser = updateUser;
        vm.searchUser = searchUser;
        vm.logout = logout;


        function init() {
            findAllUsers();
        }
        init();

        function createUser(_user) {
            vm.error = null;
            userService
                .createUser(_user)
                .then(findAllUsers);
        }

        function deleteUser(_user) {
            vm.error = null;
            userService
                .deleteUser(_user._id)
                .then(findAllUsers);
        }

        function selectUser(_user) {
            vm.error = null;
            vm._user = angular.copy(_user);
        }

        function updateUser(_user) {
            vm.error = null;
            userService
                .updateUser(_user._id, _user)
                .then(findAllUsers);
        }

        function searchUser(_username) {
            userService
                .findUserByUsername(_username)
                .then(function (user_found) {
                    if (user_found) {
                        vm._user = angular.copy(user_found);
                    } else {
                        vm._user = null;
                        vm.error = "Sorry, the user you requested does not exist! Please recheck the username."
                    }

                });
        }

        function findAllUsers() {
            userService
                .findAllUsers()
                .then(function (users) {
                    vm.users = users;
                });
        }

        function logout(){
            userService
                .logout()
                .then(function (){
                    location.reload();
                })
        }
    }
})();