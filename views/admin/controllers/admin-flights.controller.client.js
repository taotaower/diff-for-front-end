(function () {
    angular
        .module('Project')
        .controller('AdminFlightController', adminFlightController);

    function adminFlightController(currentUser, getToken, flightService, userService) {
        var vm = this;

        vm.user = currentUser;
        vm.url = window.location.href.split('#!')[1];

        vm.getAvailableFlights = getAvailableFlights;
        vm.createFlightOnly = createFlightOnly;
        vm.deleteFlight = deleteFlight;
        vm.selectFlight = selectFlight;
        vm.updateFlight = updateFlight;
        vm.logout = logout;


        function init() {
            findAllFlights();
        }
        init();

        function getAvailableFlights(flight) { // from API

            vm.error = null;

            // handling exceptions for inputs
            if (vm.flight.departure_airport === null || vm.flight.departure_airport === '' || typeof vm.flight.departure_airport === 'undefined') {
                vm.error1 = 'Origin field required!';
                vm.error2 = null;
                vm.error3 = null;
                return;
            }

            if (vm.flight.arrival_airport === null || vm.flight.arrival_airport === '' || typeof vm.flight.arrival_airport === 'undefined') {
                vm.error1 = null;
                vm.error2 = 'Destination field required!';
                vm.error3 = null;
                return;
            }

            if (vm.flight.departure_scheduled_time === null || vm.flight.departure_scheduled_time === '' || typeof vm.flight.departure_scheduled_time === 'undefined') {
                vm.error1 = null;
                vm.error2 = null;
                vm.error3 = 'Date of Departure field required!';
                return;
            }

            vm.error1 = null;
            vm.error2 = null;
            vm.error3 = null;


            vm.selected = false;
            vm.showAvailableFlights = true;

            origin = flight.departure_airport;
            destination = flight.arrival_airport;
            date = flight.departure_scheduled_time;
            directFlights = true;

            vm.oldOrigin = angular.copy(origin);
            vm.oldDestination = angular.copy(destination);
            vm.waiting = "Please wait a second...";

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
                    console.log(schedules);
                    vm.schedules = schedules;
                }, function (){
                    vm.error = "No flight found! Please note that schedules are available for today and up to 360 days in the future."
                });
        }

        function createFlightOnly(schedule) {

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
                            .createFlightOnly(flightObj) // create a new flight ONLY without adding references
                            .then(findAllFlights);
                    } else {
                        vm.error = "The flight you selected has been created already!"
                    }

                });
        }

        function deleteFlight(flight) {
            vm.selected = false;
            vm.showAvailableFlights = false;
            flightService
                .deleteFlight(flight._id)
                .then(findAllFlights);
        }

        function selectFlight(flight) {
            vm.selected = true;
            vm.flight = angular.copy(flight);
            vm.flight.departure_scheduled_time = new Date(flight.departure_scheduled_time);
        }

        function updateFlight(flight) {
            vm.selected = false;
            vm.showAvailableFlights = false;

            var carrier = flight.marketing_carrier;
            var flightNumber = flight.marketing_flight_number;
            var departureTime = flight.departure_scheduled_time;

            var host = 'api.lufthansa.com';
            var url = 'https://'+host+'/v1/operations/flightstatus/';

            var bearer_token = getToken;

            // format date
            var dd = ((departureTime.getDate()<10) ? '0':'' ) + departureTime.getDate();
            //January is 0!
            var mm = ((departureTime.getMonth()<9) ? '0':'' ) + (departureTime.getMonth() + 1);
            var yyyy = departureTime.getFullYear();

            date = yyyy +'-' + mm + '-' + dd;

            url += carrier + flightNumber + '/' + date;

            flightService
                .getFlightStatus(url, bearer_token)
                .then(function (n_Flight){
                    var newFlight = {
                        departure_airport: n_Flight.Departure.AirportCode,
                        departure_scheduled_time: n_Flight.Departure.ScheduledTimeLocal.DateTime,
                        departure_terminal: n_Flight.Departure.Terminal.Name,
                        arrival_airport: n_Flight.Arrival.AirportCode,
                        arrival_scheduled_time: n_Flight.Arrival.ScheduledTimeLocal.DateTime,
                        arrival_terminal: n_Flight.Arrival.Terminal.Name,
                        marketing_carrier: n_Flight.MarketingCarrier.AirlineID,
                        marketing_flight_number: n_Flight.MarketingCarrier.FlightNumber,
                        equipment: n_Flight.Equipment.AircraftCode,
                        dateUpdated: new Date()
                    };

                    flightService
                        .updateFlight(flight._id, newFlight)
                        .then(findAllFlights);
                }, function () {
                    vm.error4 = "Sorry, the request failed! Please note that the available date range is from 7 days in the past until 5 days in the future."
                });
        }

        function findAllFlights() {
            flightService
                .findAllFlights()
                .then(function (flights) {
                    vm.flights = flights;
                });
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
