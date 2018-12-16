(function () {
    angular
        .module('Project')
        .controller('FlightStatusController', FlightStatusController);

    function FlightStatusController ($routeParams,
                                     $location,
                                     flightService,
                                     getToken,
                                     userService,
                                     currentUser,
                                     bookingService) {
        var vm = this;
        // vm.getFlightStatus = getFlightStatus;
        vm.user = currentUser;
        vm.flightNumber = $routeParams['flightNumber'];
        vm.date = $routeParams['date'];
        vm.url = window.location.href.split('#!')[1];

        vm.logout = logout;

        function init() {
            var host = 'api.lufthansa.com';
            var url = 'https://'+host+'/v1/operations/flightstatus/';

            var bearer_token = getToken;

            url += vm.flightNumber + '/' + vm.date;

            vm.waiting = "Please wait a second...";

            flightService
                .getFlightStatus(url, bearer_token)
                .then(function (flight){
                    vm.flight = flight; // used for the display of data from API

                    carrier = vm.flightNumber.slice(0,2); // vm.flightNumber = carrier + flightNumber
                    flightNumber = vm.flightNumber.slice(2);
                    departureTime = flight.Departure.ScheduledTimeLocal.DateTime;

                    flightService
                        .findFlightByFlightInfo(carrier, flightNumber, departureTime)
                        .then(function (flight) {
                            if (flight === null || typeof flight === 'undefined') {
                                vm.error1 = "Currently no one booked this flight.";
                                return;
                            }
                            vm.users = [];
                            getPassengersByFlight(flight); // used for the display of data in local database
                        })
                }, function () {
                    vm.error = "Sorry, the status of this flight is unavailable. Please note that the available date range is from 7 days in the past until 5 days in the future.";
                });


        }
        init();

        function getPassengersByFlight(flight) {
            if (flight.bookings.length === 0 || flight.bookings === null || typeof flight.bookings === 'undefined') {
                vm.error1 = "Currently no one booked this flight.";
            }
            for (var b in flight.bookings) {

                bookingService
                    .findBookingById(flight.bookings[b])
                    .then(function (booking) {
                        userService
                            .findUserById(booking._user)
                            .then(function (user) {
                                vm.users.push(user);
                            })
                    });
            }
        }

        function logout(){
            userService
                .logout()
                .then(function (){
                    location.reload();
                })
        }
        // function getFlightStatus(flightNumber, date) {
        //
        // }

    }
})();
