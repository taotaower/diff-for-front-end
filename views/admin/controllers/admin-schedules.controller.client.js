(function () {
    angular
        .module('Project')
        .controller('AdminScheduleController', adminScheduleController);

    function adminScheduleController(scheduleService, currentUser, flightService, userService) {
        var vm = this;

        vm.user = currentUser;
        vm.url = window.location.href.split('#!')[1];

        vm.createSchedule = createSchedule;
        vm.deleteSchedule = deleteSchedule;
        vm.selectSchedule = selectSchedule;
        vm.updateSchedule = updateSchedule;
        vm.findAllCrew = findAllCrew;
        vm.findAllFlights = findAllFlights;
        vm.selectCrew = selectCrew;
        vm.selectFlight = selectFlight;
        vm.logout = logout;


        function init() {
            findAllSchedules();
            findAllCrew();
            findAllFlights();
        }
        init();

        function createSchedule(username, flight) {
            userService
                .findUserByUsername(username)
                .then(function (user) {
                    userId = user._id;

                    carrier = flight.marketing_carrier;
                    flightNumber = flight.marketing_flight_number;
                    departureTime = flight.departure_scheduled_time;

                    flightService
                        .findFlightByFlightInfo(carrier, flightNumber, departureTime)
                        .then(function (flight) {
                            flightId = flight._id;
                            var scheduleObj = {
                                _user: userId,
                                dateCreated: new Date(),
                                flights: [flightId]
                            };

                            scheduleService
                                .createSchedule(userId, flightId, scheduleObj)
                                .then(init);
                        }, function (err) {
                            return err;
                        });
                });
        }

        function deleteSchedule(schedule) {
            vm.selected = false;
            scheduleService
                .deleteSchedule(schedule._id)
                .then(init);
        }

        function selectSchedule(schedule, index) {
            vm.selected = true;
            vm.schedule = angular.copy(schedule);

            vm._flight = angular.copy(vm.flights[index][0]);
            vm._flight.carrier_flight_number = vm.flights[index][0].marketing_carrier + vm.flights[index][0].marketing_flight_number;
            vm._flight.departure_scheduled_time = new Date(vm.flights[index][0].departure_scheduled_time);

            vm._user = angular.copy(vm.users[index]);
        }

        function updateSchedule(schedule, newCrewUsername, departureTime, carrierFlightNumber) {
            vm.selected = false;
            scheduleId = schedule._id;

            carrier = carrierFlightNumber.slice(0,2);
            flightNumber = carrierFlightNumber.slice(2);


            userService
                .deleteSchedule(scheduleId)
                .then(function() {

                    flightService
                        .deleteSchedule(scheduleId)
                        .then(function() {

                            userService
                                .findUserByUsername(newCrewUsername)
                                .then(function (newCrew){

                                    flightService
                                        .findFlightByFlightInfo(carrier, flightNumber, departureTime)
                                        .then(function (newFlight){
                                            var newSchedule = {
                                                _user: newCrew._id,
                                                flights: [newFlight._id]
                                            };

                                            userService
                                                .addSchedule(newCrew._id, scheduleId)
                                                .then(function () {

                                                    flightService
                                                        .addSchedule(newFlight._id, scheduleId)
                                                        .then(function () {

                                                            scheduleService
                                                                .updateSchedule(scheduleId, newSchedule)
                                                                .then(init);
                                                        });
                                                });


                                        });

                                });
                        });
                });
        }

        function findAllSchedules() {
            scheduleService
                .findAllSchedules()
                .then(function (schedules) {
                    vm.schedules = schedules;

                    vm.flights = [];
                    loadFlights(vm.schedules);

                    vm.users = [];
                    loadUsers(vm.schedules);
                });
        }

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

        function loadUsers (schedules) {
            for (var s in schedules) {
                userService
                    .findUserById(schedules[s]._user)
                    .then(function (_user) {
                        vm.users.push(_user);
                    });
            }
        }
        function findAllCrew () {
            userService
                .findAllCrew()
                .then(function (crew) {
                    vm.crew = crew;
                });
        }

        function findAllFlights () {
            flightService
                .findAllFlights()
                .then(function (flights) {
                    vm._flights = flights;
                });
        }

        function selectCrew (_crew) {
            vm._user = angular.copy(_crew);
        }

        function selectFlight (flight) {
            vm._flight = angular.copy(flight);
            vm._flight.carrier_flight_number = flight.marketing_carrier + flight.marketing_flight_number;
            vm._flight.departure_scheduled_time = new Date(flight.departure_scheduled_time)
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