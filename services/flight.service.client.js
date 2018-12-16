(function (){
    angular
        .module("Project")
        .service("flightService", flightService);

    function flightService($http) {

        this.getAllFlightInformationByAirport = getAllFlightInformationByAirport;
        this.getFlightStatus = getFlightStatus;
        this.getAvailableFlights = getAvailableFlights;
        this.findFlightByFlightInfo = findFlightByFlightInfo;
        this.findFlightById = findFlightById;
        this.findAllFlights = findAllFlights;
        this.createFlight = createFlight;
        this.createFlightOnly = createFlightOnly;
        this.findAllFlightsForBooking = findAllFlightsForBooking;
        this.updateFlight = updateFlight;
        this.deleteFlight = deleteFlight;

        this.addBooking = addBooking;
        this.deleteBooking = deleteBooking;
        this.addSchedule = addSchedule;
        this.deleteSchedule = deleteSchedule;

        function getAllFlightInformationByAirport (url, bearer_token) {
            return $http({
                url: url ,
                method: 'GET',
                headers: {
                    accept: "application/json",
                    authorization:"Bearer " + bearer_token
                }
            }).then(function(response) {
                return response.data.FlightStatusResource.Flights.Flight;
            });

        }

        function getFlightStatus (url, bearer_token) {
            return $http({
                url: url ,
                method: 'GET',
                headers: {
                    accept: "application/json",
                    authorization:"Bearer " + bearer_token
                }
            }).then(function(response) {
                return response.data.FlightStatusResource.Flights.Flight;
            });
        }

        function getAvailableFlights (url, bearer_token) {
            return $http({
                url: url ,
                method: 'GET',
                headers: {
                    accept: "application/json",
                    authorization:"Bearer " + bearer_token
                }
            }).then(function(response) {
                return response.data.ScheduleResource.Schedule;
            });
        }

        function findFlightByFlightInfo (carrier, flightNumber, departureTime) {
            var url = "/api/flight/" + carrier + "/" + flightNumber + "/" + departureTime;
            return $http
                .get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function createFlight (bookingId, flightObj) {
            var url = "/api/flight/booking/" + bookingId;
            return $http
                .post(url, flightObj)
                .then(function (response) {
                    return response.data;
                });
        }

        function createFlightOnly (flightObj) {
            var url = "/api/flight/new";
            return $http
                .post(url, flightObj)
                .then(function (response) {
                    return response.data;
                });
        }

        function findAllFlightsForBooking (bookingId) {
            var url = "/api/flights/booking/" + bookingId;
            return $http
                .get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function findFlightById (flightId) {
            var url = "/api/flight/" + flightId;
            return $http
                .get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function findAllFlights () {
            var url = "/api/flights";
            return $http
                .get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function updateFlight(flightId, newFlight) {
            var url = "/api/flight/" + flightId;
            return $http
                .put(url, newFlight)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteFlight(flightId) {
            var url = "/api/flight/" + flightId;
            return $http
                .delete(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function addBooking (flightId, bookingId) {
            var url = "/api/flight/" + flightId + "/" + bookingId;
            return $http
                .post(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteBooking (bookingId) {
            var url = "/api/flight/" + bookingId;
            return $http
                .delete(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function addSchedule (flightId, scheduleId) {
            var url = "/api/flight/" + flightId + "/schedule/" + scheduleId;
            return $http
                .post(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteSchedule (scheduleId) {
            var url = "/api/flight/schedule/" + scheduleId;
            return $http
                .delete(url)
                .then(function (response) {
                    return response.data;
                });
        }


    }
})();