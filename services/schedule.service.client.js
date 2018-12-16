(function () {
    angular
        .module('Project')
        .service('scheduleService', scheduleService);

    function scheduleService ($http) {
        // "this" is private
        // APIs
        this.findAllSchedulesForUser = findAllSchedulesForUser;
        this.findScheduleById = findScheduleById;
        this.findAllSchedules = findAllSchedules;
        this.deleteSchedule = deleteSchedule;
        this.createSchedule = createSchedule;
        this.updateSchedule = updateSchedule;
        this.addFlight = addFlight;
        this.deleteFlight = deleteFlight;

        function findAllSchedulesForUser (userId) {
            var url = "/api/user/" + userId + "/schedule";
            return $http
                .get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function findScheduleById (scheduleId) {
            var url = "/api/schedule/" + scheduleId;
            return $http
                .get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function findAllSchedules () {
            var url = "/api/schedules";
            return $http
                .get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteSchedule (scheduleId) {
            var url = "/api/schedule/" + scheduleId;
            return $http
                .delete(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function createSchedule (userId, flightId, schedule) {
            var url = "/api/schedule/" + userId + "/" + flightId;
            return $http
                .post(url, schedule)
                .then(function (response) {
                    return response.data;
                });
        }

        function updateSchedule (scheduleId, schedule) {
            var url = "/api/schedule/" + scheduleId;
            return $http
                .put(url, schedule)
                .then(function (response) {
                    return response.data;
                });
        }

        function addFlight (scheduleId, flightId) {
            var url = "/api/schedule/" + scheduleId + "/" + flightId;
            return $http
                .post(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteFlight (flightId) {
            var url = "/api/schedule/" + flightId;
            return $http
                .delete(url)
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();