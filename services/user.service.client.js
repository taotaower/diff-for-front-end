(function () {
    angular
        .module('Project')
        .factory('userService', userService);

    function userService ($http) {

        const api = {
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
            deleteSchedule: deleteSchedule,
            findAllPassenger:findAllPassenger,
            checkinPassenger:checkinPassenger,
            findAllTicketCheckers: findAllTicketCheckers,

            searchUsers : searchUsers,
        };
        return api;

        function createUser (user) {
            const url = "/api/lufthansa/user";
            return $http
                .post(url, user)
                .then(function (response) {
                    return response.data;
                });
        }

        function searchUsers(user){
            const url = "/api/lufthansa/user/search";
            return $http
                .post(url, user)
                .then(function (response) {
                    return response.data;
                });

        }

        function findUserById (userId) {
            const url = "/api/lufthansa/user/" + userId;
            return $http
                .get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function findUserByCredentials (username, password) {
            const url = "/api/lufthansa/user?username=" + username + "&password=" + password;
            return $http
                .get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function findUserByUsername (username) {
            console.log("username",username);
            const url = "/api/lufthansa/user?username=" + username;

            return $http
                .get(url)
                .then(function (response) {
                    console.log("response",response);
                    return response.data;
                });
        }

        function findAllUsers () {
            const url = "/api/lufthansa/users";
            return $http
                .get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function findAllCrew () {
            const url = "/api/lufthansa/crew";
            return $http
                .get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function findAllTicketCheckers() {
            const url = "/api/lufthansa/checkers";
            return $http
                .get(url)
                .then(function (response) {
                    return response.data;
                });
        }


        function login(username, password) {
            const url = "/api/lufthansa/login";
            const credentials = {
                username: username,
                password: password
            };
            return $http
                .post(url, credentials)
                .then(function (response) {
                    console.log("response.data",response.data);
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
            const url = "/api/lufthansa/register";
            return $http.post(url, userObj)
                .then(function (response) {
                    return response.data;
                });
        }

        function unregister(userObj) {
            const url = "/api/lufthansa/unregister";
            return $http.post(url, userObj)
                .then(function (response) {
                    return response.data;
                });
        }

        function updateUser (userId, user) {
            const url = "/api/lufthansa/user/" + userId;
            console.log("userId", user);
            return $http
                .put(url, user)
                .then(function (response) {
                    return response.data;
                })
        }

        function deleteUser (userId) {
            const url = "/api/lufthansa/user/" + userId;
            return $http
                .delete(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function addSchedule (userId, scheduleId) {
            const url = "/api/lufthansa/user/" + userId + "/schedule/" + scheduleId;
            return $http
                .post(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteSchedule (scheduleId) {
            const url = "/api/lufthansa/schedule/" + scheduleId;
            return $http
                .delete(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function findAllPassenger(passengerIds){
            const url = "/api/lufthansa/user/findAllPassenger";
            return $http
                .post(url,passengerIds)
                .then(
                    response =>{
                        console.log("all passengers",response.data);
                        return response.data;
                    }
                )

        }

        function checkinPassenger(passengerId){

          const url = "/api/lufthansa/user/checkinPassenger";
          return $http
              .post(url, {passengerId : passengerId})
              .then(
                  response => {
                      console.log("dasdasdasdasdasdasda");
                      console.log(response);
                    return response.data
                  }
              )

        }
    }
})();