(function () {
    angular
        .module('Project')
        .controller('AdminScheduleController', adminScheduleController);

    function adminScheduleController(scheduleService, currentUser, flightService, userService) {
        let vm = this;

        vm.user = currentUser;
        vm.url = window.location.href.split('#!')[1];
        vm.carrier_code= "";
        vm.flight_number= "";
        vm.allSchedules= {};

        vm.createSchedule = createSchedule;
        vm.deleteSchedule = deleteSchedule;
        vm.findAllCrew = findAllCrew;
        vm.findAllFlights = findAllFlights;
        vm.selectCrew = selectCrew;
        vm.selectFlight = selectFlight;
        vm.selectFlightAction = selectFlightAction;
        vm.createScheduleAction = createScheduleAction;
        vm.logout = logout;
        vm.init = init;
        vm.checkCrew = checkCrew;
        vm.checkChecker = checkChecker;
        vm.submitSchedule = submitSchedule;
        vm.showStaff = showStaff;
        vm.filterSchedules = filterSchedules;


        function init() {
            findAllSchedules();
            findAllCrew();
            findAllTicketCheckers();
            findAllFlights();
            vm.createScheduleFlag = false;
            vm.updateScheduleFlag = false;
            vm.selectstaff = false;
            vm.selectedCrews = {};
            vm.selectedCheckers = {};
            vm.showStaffFlag = false;
            vm.showCrews = {};
            vm.showCheckers = {};
            vm.carrier_code= "";
            vm.flight_number= "";


        }
        init();

        function filterSchedules(){
            let schedules = vm.allSchedules;
            let newSchedules = {};
            Object.keys(schedules).forEach(function(key) {
                if (schedules[key].flight.marketing_carrier === vm.carrier_code
                    || schedules[key].flight.marketing_flight_number === vm.flight_number){
                    newSchedules[key] = schedules[key]
                }
            });
            vm.schedules = newSchedules;

        }

        function submitSchedule(){
            let schedule = {
                crews:Object.keys(vm.selectedCrews),
                ticket_checkers: Object.keys(vm.selectedCheckers),
                flight: vm.selectedFlight,
            };

            scheduleService
                .createSchedule(schedule)
                .then(res=> {
                    console.log(res);
                        init();
                },
                    err =>{
                    console.log(err)
                    })
        }

        function checkCrew(crewId){
            if (vm.selectedCrews[crewId] === undefined ){
                vm.selectedCrews = {...vm.selectedCrews, [crewId]: crewId}
            }else{
                delete vm.selectedCrews[crewId]
            }

        }

        function checkChecker(checkerId){
            if (vm.selectedCheckers[checkerId] === undefined ){

                vm.selectedCheckers = {...vm.selectedCheckers, [checkerId]:checkerId}
            }else{
                console.log(checkerId,"checkerId");
                delete vm.selectedCheckers[checkerId]
            }

        }
        function createScheduleAction(){
            vm.createScheduleFlag = true;
            vm.selectstaff = false;
        }

        function selectFlightAction(flight){
            vm.selectedFlight = flight;
            vm.selectstaff = true;
            vm.createScheduleFlag = false;
        }

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
            scheduleService
                .deleteSchedule(schedule)
                .then(init);
        }


        function findAllSchedules() {
            scheduleService
                .findAllSchedules()
                .then(function (schedules) {
                    vm.schedules = schedules;
                    vm.allSchedules = schedules;


                });
        }

        function showStaff(crews, checkers){
            vm.showCrews = crews;
            vm.showCheckers = checkers;
            vm.showStaffFlag = true;
            console.log("vm.showCrews",vm.showCrews);
            console.log("vm.showCheckers",vm.showCheckers);

        }

        function findAllCrew () {
            userService
                .findAllCrew()
                .then(function (crews) {
                    vm.crews = crews;
                });
        }

        function findAllTicketCheckers(){
            userService
                .findAllTicketCheckers()
                .then(
                    checkers => {
                        vm.checkers = checkers;
                    },
                    err => {
                        console.log(err);
                    }
                )
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