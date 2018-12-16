(function () {
    angular
        .module('Project')
        .service('bookingService', bookingService);

    function bookingService ($http) {

        this.findAllBookingsForUser = findAllBookingsForUser;
        this.findBookingById = findBookingById;
        this.findAllBookings = findAllBookings;
        this.deleteBooking = deleteBooking;
        this.createBooking = createBooking;
        this.updateBooking = updateBooking;
        this.addFlight = addFlight;
        this.deleteFlight = deleteFlight;
        this.findAllReservationsByFlightWithPass = findAllReservationsByFlightWithPass;

        function findAllReservationsByFlightWithPass(flight_id){
            console.log("front end id" ,flight_id);
            let url = "/api/booking/flight/reservations";
            return $http
                .post(url, {flight:flight_id})
                .then(function (response) {
                    return response.data;
                });

        }

        function findAllBookingsForUser (userId) {
            var url = "/api/user/" + userId + "/booking";
            return $http
                .get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function findBookingById (bookingId) {
            var url = "/api/booking/" + bookingId;
            return $http
                .get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function findAllBookings () {
            var url = "/api/bookings";
            return $http
                .get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteBooking (bookingId) {
            var url = "/api/booking/" + bookingId;
            return $http
                .delete(url)
                .then(function (response) {
                    return response.data;
                });
        }

        // function createBooking (userId, booking) {
        //     var url = "/api/user/" + userId + "/booking";
        //     return $http
        //         .post(url, booking)
        //         .then(function (response) {
        //             return response.data;
        //         });
        // }

        function createBooking (booking) {
            var url = "/api/user/booking";
            return $http
                .post(url, booking)
                .then(function (response) {
                    return response.data;
                });
        }

        function updateBooking (bookingId, booking) {
            var url = "/api/booking/" + bookingId;
            return $http
                .put(url, booking)
                .then(function (response) {
                    return response.data;
                });
        }

        function addFlight (bookingId, flightId) {
            console.log("addFlightaddFlight");
            let url = "/api/booking/addFlight/update";
            return $http
                .post(url,{bookingId: bookingId, flightId:flightId})
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteFlight (flightId) {
            var url = "/api/booking/" + flightId;
            return $http
                .delete(url)
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();