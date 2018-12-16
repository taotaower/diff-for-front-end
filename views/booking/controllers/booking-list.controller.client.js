(function () {
    angular
        .module('Project')
        .controller('BookingListController', BookingListController);

    function BookingListController ($routeParams, currentUser, bookingService, userService, flightService) {
        var vm = this;
        vm.uid = currentUser._id;
        vm.user = currentUser;
        vm.url = window.location.href.split('#!')[1];

        vm.logout = logout;

        function init() {
            bookingService
                .findAllBookingsForUser(vm.uid)
                .then(function (bookings) {
                    vm.bookings = bookings;
                    vm.flights = [];
                    loadFlights(vm.bookings);
                });
        }
        init();

        function loadFlights(bookings) {
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