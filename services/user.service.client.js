(function () {
    angular
        .module('Project')
        .factory('userService', userService);

    function userService ($http) {

        var api = {
            createUser: createUser,
            findUserById: findUserById,
            findUserByCredentials: findUserByCredentials,
            findUserByUsername: findUserByUsername,
            findAllUsers: findAllUsers,
            findAllCrew: findAllCrew,
            login: login,
            logout: logout,
            loggedin: loggedin,
            checkAdmin: checkAdmin,
            register: register,
            updateUser: updateUser,
            deleteUser: deleteUser,
            unregister: unregister,
            addSchedule: addSchedule,
            deleteSchedule: deleteSchedule
        };
        return api;

        function createUser (user) {
            var url = "/api/lufthansa/user";
            return $http
                .post(url, user)
                .then(function (response) {
                    return response.data;
                });
        }

        function findUserById (userId) {
            var url = "/api/lufthansa/user/" + userId;
            return $http
                .get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function findUserByCredentials (username, password) {
            var url = "/api/lufthansa/user?username=" + username + "&password=" + password;
            return $http
                .get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function findUserByUsername (username) {
            var url = "/api/lufthansa/user?username=" + username;
            return $http
                .get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function findAllUsers () {
            var url = "/api/lufthansa/users";
            return $http
                .get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function findAllCrew () {
            var url = "/api/lufthansa/crew";
            return $http
                .get(url)
                .then(function (response) {
                    return response.data;
                });
        }


        function login(username, password) {
            var url = "/api/lufthansa/login";
            var credentials = {
                username: username,
                password: password
            };
            return $http
                .post(url, credentials)
                .then(function (response) {
                    return response.data;
                });
        }

        function logout(user) {
            return $http.post("/api/lufthansa/logout");
        }

        function loggedin() {
            return $http.get("/api/lufthansa/loggedin")
                .then(function (response) {
                    return response.data;
                });
        }

        function checkAdmin() {
            return $http.get("/api/lufthansa/checkAdmin")
                .then(function (response) {
                    return response.data;
                });
        }

        function register(userObj) {
            var url = "/api/lufthansa/register";
            return $http.post(url, userObj)
                .then(function (response) {
                    return response.data;
                });
        }

        function unregister(userObj) {
            var url = "/api/lufthansa/unregister";
            return $http.post(url, userObj)
                .then(function (response) {
                    return response.data;
                });
        }

        function updateUser (userId, user) {
            var url = "/api/lufthansa/user/" + userId;
            return $http
                .put(url, user)
                .then(function (response) {
                    return response.data;
                })
        }

        function deleteUser (userId) {
            var url = "/api/lufthansa/user/" + userId;
            return $http
                .delete(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function addSchedule (userId, scheduleId) {
            var url = "/api/lufthansa/user/" + userId + "/schedule/" + scheduleId;
            return $http
                .post(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteSchedule (scheduleId) {
            var url = "/api/lufthansa/schedule/" + scheduleId;
            return $http
                .delete(url)
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();