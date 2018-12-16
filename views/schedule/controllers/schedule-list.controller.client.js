(function () {
    angular
        .module('Project')
        .controller('ScheduleListController', ScheduleListController);

    function ScheduleListController ($routeParams, currentUser, scheduleService, userService, flightService) {
        var vm = this;
        vm.user = currentUser;
        vm.uid = currentUser._id;
        vm.url = window.location.href.split('#!')[1];

        vm.logout = logout;

        function init() {
            scheduleService
                .findAllSchedulesForUser(vm.uid) // for crew
                .then(function (schedules) {
                    vm.schedules = schedules;

                    vm.flights = [];
                    loadFlights(vm.schedules);
                    console.log(vm.flights);
                });
        }
        init();

        function loadFlights (schedules) {
            for (var s in schedules) {
                // subflights = [];
                // for (var f in schedules[s].flights) {
                flightService
                    .findFlightById(schedules[s].flights[0])
                    .then(function (flight) {
                        // subflights.push(flight);
                        vm.flights.push([flight]);
                    });
                // }
            }
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