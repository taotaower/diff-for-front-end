(function () {
    angular
        .module('Project')
        .controller('AdminBookingController', adminBookingController);

    function adminBookingController(bookingService, currentUser, flightService, userService) {
        var vm = this;

        vm.url = window.location.href.split('#!')[1];
        vm.user = currentUser;

        // vm.createBooking = createBooking;
        vm.deleteBooking = deleteBooking;
        vm.selectBooking = selectBooking;
        vm.updateBooking = updateBooking;
        vm.logout = logout;

        function init() {
            findAllBookings();
        }
        init();

        // function createBooking(username, booking) {
        //     userService
        //         .findUserByUsername(username)
        //         .then(function (user) {
        //             uid = user._id;
        //             bookingService
        //                 .createBooking(uid, booking)
        //                 .then(findAllBookings);
        //         });
        // }

        function deleteBooking(booking) {
            vm.selected = false;
            bookingService
                .deleteBooking(booking._id)
                .then(findAllBookings);
        }

        function selectBooking(booking, index) {
            vm.selected = true;
            vm.booking = angular.copy(booking);
            vm._user = angular.copy(vm.users[index]);
            vm._flights = angular.copy(vm.flights[index]);
        }

        function updateBooking(booking) {
            vm.selected = false;
            bookingService
                .updateBooking(booking._id, booking)
                .then(findAllBookings);
        }

        function findAllBookings() {
            bookingService
                .findAllBookings()
                .then(function (bookings) {
                    vm.bookings = bookings;

                    vm.flights = [];
                    loadFlights(vm.bookings);

                    vm.users = [];
                    loadUsers(vm.bookings);
                });
        }

        function loadFlights (bookings) {
            // console.log(vm.bookings);
            for (var b in bookings) {
                // subflights = [];
                // for (var f in bookings[b].flights) {
                flightService
                    .findFlightById(bookings[b].flights[0])
                    .then(function (flight) {
                        // subflights.push(flight);
                        vm.flights.push([flight]);
                    });
                // }
            }
            console.log(vm.flights);
        }

        function loadUsers (bookings) {
            for (var b in bookings) {
                userService
                    .findUserById(bookings[b]._user)
                    .then(function (_user) {
                        vm.users.push(_user);
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
    }
})();