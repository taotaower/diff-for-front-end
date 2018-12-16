(function () {
    angular
        .module('Project')
        .factory('messageService', messageService);

    function messageService ($http) {

        var api = {
            findMessagesBetweenTwoUsers: findMessagesBetweenTwoUsers,
            findMessageById: findMessageById,
            createMessage: createMessage,
            updateMessage: updateMessage,
            deleteMessage: deleteMessage
        };
        return api;

        function findMessagesBetweenTwoUsers (username1, username2) {
            var url = "/api/lufthansa/message?username1=" + username1 + "&username2=" + username2;
            return $http
                .get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function findMessageById (messageId) {
            var url = "/api/lufthansa/message/" + messageId;
            return $http
                .get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function createMessage (message) {
            var url = "/api/lufthansa/message";
            return $http
                .post(url, message)
                .then(function (response) {
                    return response.data;
                });
        }

        function updateMessage (messageId, message) {
            var url = "/api/lufthansa/message/" + messageId;
            return $http
                .put(url, message)
                .then(function (response) {
                    return response.data;
                })
        }

        function deleteMessage (messageId) {
            var url = "/api/lufthansa/message/" + messageId;
            return $http
                .delete(url)
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();