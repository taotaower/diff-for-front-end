(function () {
    angular
        .module('Project')
        .controller('AdminUserController', adminUserController);

    function adminUserController(userService, currentUser) {
        var vm = this;

        vm.roles = ["ADMIN","STAFF","MEMBER"];
        vm.duties = ["TICKET_CHECKER","CREW","REPRESENTATIVE"];
        vm.user = currentUser;
        vm.url = window.location.href.split('#!')[1];

        vm._user = {
            username: "",
            first_name: "",
            last_name:"",
            role:"MEMBER",
            duty:"TICKET_CHECKER",
        };



        vm.createUser = createUser;
        vm.deleteUser = deleteUser;
        vm.selectUser = selectUser;
        vm.updateUser = updateUser;
        vm.searchUser = searchUser;
        vm.newSearchUser = newSearchUser;
        vm.logout = logout;


        function init() {
            findAllUsers();
        }
        init();

        function createUser() {
            let _user = vm._user;
            delete _user._id;
            userService
                .createUser(_user)
                .then(findAllUsers);
        }

        function deleteUser(_user) {

            userService
                .deleteUser(_user._id)
                .then(findAllUsers);
        }

        function selectUser(_user) {
            vm.error = null;
            vm._user = angular.copy(_user);
        }

        function updateUser() {
            let _user = vm._user;
            vm.error = null;
            userService
                .updateUser(_user._id, _user)
                .then(findAllUsers);
        }

        function searchUser() {
            let _username = vm._user.username;
            userService
                .findUserByUsername(_username)
                .then(function (user_found) {
                    if (user_found) {
                        console.log("user_found user_found", user_found);
                        vm._user = angular.copy(user_found[0]);
                    } else {
                        vm._user = null;
                        vm.error = "Sorry, the user you requested does not exist! Please recheck the username."
                    }

                });
        }

        function newSearchUser(){
            let _user = vm._user;
            delete _user.role;
            delete _user.duty;
            userService
                .searchUsers(_user)
                .then(
                    users => {
                        vm.users = users;
                    },
                    err => {
                        console.log(err)
                    }
                )

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