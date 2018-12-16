(function () {
    angular
        .module('Project')
        .controller('AdminBookingController', AdminBookingController);

    function AdminBookingController(bookingService, currentUser, flightService, userService) {
        var vm = this;
        vm.uid = currentUser._id;
        vm.user = currentUser;
        vm.url = window.location.href.split('#!')[1];
        vm.fetchPassenger = fetchPassenger;
        vm.cancelBooking = cancelBooking;

        vm.logout = logout;

        function init() {
            vm.selectPassenger = false;
            bookingService
                .findAllBookings()
                .then(function (bookings) {
                    vm.bookings = bookings;
                });
        }
        init();

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

        function fetchPassenger(passengerId){
            userService.findUserById(passengerId).then(function(passenger) {
                vm.passenger = passenger;
            });
            vm.selectPassenger = true;
            console.log("Current Passenger", vm.passenger);
        }
    }
})();