(function () {
    angular
        .module('Project')
        .controller('NewBookingController', NewBookingController);
    function NewBookingController ($routeParams,
                                   $location,
                                   currentUser,
                                   getToken,
                                   bookingService,
                                   flightService,
                                   userService) {
        let vm = this;
        vm.isAnonymousUser = currentUser === undefined;



        resetBookingPage();



        vm.createBooking = createBooking;
        vm.getAvailableFlights = getAvailableFlights;
        vm.prepBooking = prepBooking;
        vm.logout = logout;
        vm.resetBookingPage = resetBookingPage;
        vm.checkReservation = checkReservation;

        function checkReservation (){
            $location.url('/booking');
        }

        function resetBookingPage(){
            vm.passenger ={
                email: '',
                phone: '',
                first_name: '',
                last_name: '',
                date_of_birth: '',
                passport_number: '',
                check_in: false,
            };

            vm.confirmation = false;
            vm.startBooking = false;
            vm.bookingSuccess = false;
            vm.bookingFail = false;

            vm.user = currentUser;
            console.log("vm.user ",vm.user);
            vm.origin = $routeParams.origin;
            vm.destination = $routeParams.destination;
            vm.url = window.location.href.split('#!')[1];
        }



        function prepBooking(schedule){
            resetConfirmation();
            vm.flight_price = schedule.price;
            vm.flight = {
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
            }

        }

        function resetConfirmation(){
            vm.confirmation = !vm.confirmation;
        }

        function createBooking(){
            //create passenger

            let username = '_' + Math.random().toString(36).substr(2, 9) + Math.random().toString(36).substr(2, 9);
            let passenger = {username: username,
                ...vm.passenger};
            vm.startBooking = true;
            userService
                .createUser(passenger)
                .then(
                    res => {
                        console.log(res);
                        makeReservation(res._id)
                    },
                    err => {
                        vm.bookingFail= true;
                        vm.startBooking = false;
                    console.log(err);
                    });
        }

        function makeReservation (passengerId) {

            let currentUserId = currentUser === undefined ? passengerId : currentUser._id;
            let booking ={
                passenger: passengerId,
                price: vm.flight_price,
                createUser: currentUserId,
            };

            // create reservation first
            bookingService
                .createBooking(booking)
                .then(function (booking) {
                    let bookingId = booking._id;

                    let flightObj = vm.flight;

                    let carrier = flightObj.marketing_carrier;
                    let flightNumber = flightObj.marketing_flight_number;
                    let departureTime = flightObj.departure_scheduled_time;

                    flightService
                        .findFlightByFlightInfo(carrier, flightNumber, departureTime)
                        .then(function (flight) {
                            // if fight not exist
                            if (flight === null || flight === '' || typeof flight === 'undefined') {
                                flightService
                                    .createFlight(bookingId, flightObj) // create a new flight and add reference
                                    .then(function () {
                                        vm.bookingSuccess = true;
                                        vm.startBooking = false;
                                    });
                            } else {
                                bookingService
                                    .addFlight(bookingId, flight._id) // add reference only
                                    .then(function () {
                                        vm.bookingSuccess = true;
                                        vm.startBooking = false;
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

            var bearer_token = getToken;

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

