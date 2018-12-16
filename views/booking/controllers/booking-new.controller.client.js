(function () {
    angular
        .module('Project')
        .controller('NewBookingController', NewBookingController);

    function NewBookingController ($routeParams,
                                   $location,
                                   currentUser,
                                   bookingService,
                                   flightService,
                                   userService) {
        var vm = this;

        if ($routeParams.username === null || typeof $routeParams.username === 'undefined') {
            vm.uid = currentUser._id;
        } else {
            vm.other_username = $routeParams.username;
            userService
                .findUserByUsername(vm.other_username)
                .then(function (user) {
                    vm.uid = user._id;
                });
        }
        vm.user = currentUser;
        vm.food = $routeParams.food;
        vm.lounge = $routeParams.lounge;
        vm.origin = $routeParams.origin;
        vm.destination = $routeParams.destination;
        vm.url = window.location.href.split('#!')[1];


        vm.createBooking = createBooking;
        vm.getAvailableFlights = getAvailableFlights;
        vm.logout = logout;

        function createBooking (uid, schedule) {
            if (vm.food && vm.lounge) {
                booking = {
                    dateCreated: new Date(),
                    food: vm.food,
                    lounge: vm.lounge,
                    price: schedule.price
                };
            } else {
                booking = {
                    dateCreated: new Date(),
                    price: schedule.price
                };
            }


            bookingService
                .createBooking(uid, booking)
                .then(function (booking) {
                    console.log(booking);
                    var bookingId = booking._id;

                    var flightObj = {
                        departure_airport: schedule.Flight.Departure.AirportCode,
                        departure_scheduled_time: schedule.Flight.Departure.ScheduledTimeLocal.DateTime,
                        departure_terminal: schedule.Flight.Departure.Terminal.Name,
                        arrival_airport: schedule.Flight.Arrival.AirportCode,
                        arrival_scheduled_time: schedule.Flight.Arrival.ScheduledTimeLocal.DateTime,
                        arrival_terminal: schedule.Flight.Arrival.Terminal.Name,
                        marketing_carrier: schedule.Flight.MarketingCarrier.AirlineID,
                        marketing_flight_number: schedule.Flight.MarketingCarrier.FlightNumber,
                        equipment: schedule.Flight.Equipment.AircraftCode,
                        journey_duration: schedule.TotalJourney.Duration,
                        dateCreated: new Date(),
                        dateUpdated: new Date()
                    };

                    var carrier = flightObj.marketing_carrier;
                    var flightNumber = flightObj.marketing_flight_number;
                    var departureTime = flightObj.departure_scheduled_time;

                    flightService
                        .findFlightByFlightInfo(carrier, flightNumber, departureTime)
                        .then(function (flight) {
                            if (flight === null || flight === '' || typeof flight === 'undefined') {
                                flightService
                                    .createFlight(bookingId, flightObj) // create a new flight and add reference
                                    .then(function () {
                                        if ($routeParams.username === null || typeof $routeParams.username === 'undefined') {
                                            $location.url('/booking');
                                        } else {
                                            $location.url('/admin/booking');
                                        }
                                    });
                            } else {
                                bookingService
                                    .addFlight(bookingId, flight._id) // add reference only
                                    .then(function () {
                                        if ($routeParams.username === null || typeof $routeParams.username === 'undefined') {
                                            $location.url('/booking');
                                        } else {
                                            $location.url('/admin/booking');
                                        }
                                    });
                            }
                        });
                });
        }

        function getAvailableFlights (origin, destination, date) {
            vm.error = null;
            vm.schedules = null;

            // handling exceptions for inputs
            if (origin === null || origin === '' || typeof origin === 'undefined') {
                vm.error1 = 'Origin field required!';
                vm.error2 = null;
                vm.error3 = null;
                return;
            }

            if (destination === null || destination === '' || typeof destination === 'undefined') {
                vm.error1 = null;
                vm.error2 = 'Destination field required!';
                vm.error3 = null;
                return;
            }

            if (date === null || date === '' || typeof date === 'undefined') {
                vm.error1 = null;
                vm.error2 = null;
                vm.error3 = 'Date field required!';
                return;
            }

            vm.error1 = null;
            vm.error2 = null;
            vm.error3 = null;

            vm.waiting = "Please wait a second...";

            // variable pre-processing
            vm.oldOrigin = angular.copy(origin);
            vm.oldDestination = angular.copy(destination);
            directFlights = true;
            var dd = ((date.getDate()<10) ? '0':'' ) + date.getDate();
            //January is 0!
            var mm = ((date.getMonth()<9) ? '0':'' ) + (date.getMonth() + 1);
            var yyyy = date.getFullYear();

            date = yyyy +'-' + mm + '-' + dd;
            vm.dateFormat = date;

            var host = 'api.lufthansa.com';
            var url = 'https://'+host+'/v1/operations/schedules/';

            var bearer_token = "bey8rwhjcqtrvjebazqef3f5";

            url += origin + '/' + destination + '/' + date + "?limit=100&directFlights=" + directFlights;

            flightService
                .getAvailableFlights(url, bearer_token)
                .then(function (schedules){
                    vm.schedules = schedules;

                    for (var s in vm.schedules) {
                        vm.schedules[s].price = priceConverter(vm.schedules[s].TotalJourney.Duration)
                    }
                }, function () {
                    vm.error = "Sorry, the flight you requested is not found! Please note that schedules are available for today and up to 360 days in the future.";
                });
        }

        function priceConverter (duration) {
            var durationParts = duration.split(/[A-Za-z]/);
            return parseInt(durationParts[2])*58 + parseInt(durationParts[3])*2;
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