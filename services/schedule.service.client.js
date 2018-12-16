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
        this.addFlightIntoSchedule = addFlightIntoSchedule;
        this.deleteFlight = deleteFlight;
        this.findAllSchedulesForChecker = findAllSchedulesForChecker;
        this.findAllSchedulesForCrew = findAllSchedulesForCrew;

        function findAllSchedulesForUser (userId) {
            var url = "/api/user/" + userId + "/schedule";
            return $http
                .get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function findAllSchedulesForChecker(id){
            let url = "/api/schedules/checker/" + id;
            return $http
                .get(url)
                .then(function (response) {
                    return response.data;
                });

        }

        function findAllSchedulesForCrew(id){
            let url = "/api/schedules/crew/" + id;
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

        function createSchedule (schedule) {
            console.log(schedule,"scheduleModel.create(schedule)");
            var url = "/api/schedule/createSchedule";
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

        function addFlightIntoSchedule (scheduleId, flightId) {
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