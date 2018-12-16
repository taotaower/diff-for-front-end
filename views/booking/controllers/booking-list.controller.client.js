(function () {
    angular
        .module('Project')
        .controller('BookingListController', BookingListController);

    function BookingListController ($routeParams, $location,currentUser, bookingService, userService, flightService) {
        var vm = this;
        vm.uid = currentUser._id;
        vm.user = currentUser;
        vm.url = window.location.href.split('#!')[1];
        vm.fetchPassenger = fetchPassenger;
        vm.cancelBooking = cancelBooking;
        vm.updatePassenger = updatePassenger;

        vm.logout = logout;

        function init() {
            vm.selectPassenger = false;
            bookingService
                .findAllBookingsForUser(vm.uid)
                .then(function (bookings) {
                    // console.log(vm.uid);
                    vm.bookings = bookings;
                    // vm.flights = [];
                    // loadFlights(vm.bookings);
                });
        }
        init();

        // function loadFlights(bookings) {
        //     for (var b in bookings) {
        //         // subflights = [];
        //         // for (var f in bookings[b].flights) {
        //             flightService
        //                 .findFlightById(bookings[b].flight)
        //                 .then(function (flight) {
        //                     // subflights.push(flight);
        //                     vm.flights.push([flight]);
        //                 });
        //         // }
        //     }
        // }

        function logout(){
            userService
                .logout()
                .then(function (){
                    location.reload();
                })
        }

        function cancelBooking (bookingId) {
            bookingService
                .deleteBooking(bookingId)
                .then(function (){
                    init();
                });
        }

        function fetchPassenger(bookingId, passengerId){
            vm.bookingId = bookingId;
            userService.findUserById(passengerId).then(function(passenger) {
                vm.passenger = passenger;
            });
            vm.selectPassenger = true;
            console.log("Current Passenger", vm.passenger);
        }

        function updatePassenger(passenger){
            bookingService.findBookingById(vm.bookingId).then(function(booking){
               userService.updateUser(booking.passenger, passenger);
            });
        }
    }
})();