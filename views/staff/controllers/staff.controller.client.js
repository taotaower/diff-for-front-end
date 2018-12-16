(function () {
    angular
        .module('Project')
        .controller('StaffViewController', StaffViewController);


    function StaffViewController(userService, currentUser, scheduleService, bookingService) {

        let vm = this;
        vm.url = window.location.href.split('#!')[1];
        vm.user = currentUser;



        vm.checkinPassenger = checkinPassenger;
        vm.checkinPassengerAction = checkinPassengerAction;
        vm.init = init;


        function init() {
            findAllSchedule();
            vm.checkinPassengerShow = false;
            vm.passengers = {};
            vm.reservations = {};
        }

        init();

        function findAllSchedule(){
            let id = currentUser._id;
            if(currentUser.duty === "TICKET_CHECKER"){
                scheduleService.findAllSchedulesForChecker(id).then(
                    res =>{
                        console.log(res);
                        vm.schedules = res;
                    },
                    err =>{
                        console.log(err)
                    }
                )


            }else{
                scheduleService.findAllSchedulesForCrew(id).then(
                    res =>{
                        vm.schedules = res;
                    },
                    err =>{
                        console.log(err)
                    }
                )
            }
        }

        function findAllCheckInUsers(){
            userService.findAllPassenger(currentUser.passengers).then(
                passengers =>
                {
                    vm.passengers = passengers
                }
            );

        }

        function checkinPassenger(id){
            userService.checkinPassenger(id, currentUser._id).then(
                res => {
                    checkinPassengerAction(vm.flight_id);
                },
                err => {
                    console.log(err)
                }
            )
        }



        function checkinPassengerAction(flight_id){
            vm.flight_id = flight_id;
            vm.checkinPassengerShow = true;
            bookingService
                .findAllReservationsByFlightWithPass(flight_id)
                .then(
                    reservations => {
                        vm.reservations = reservations;
                    },
                    err => {
                        console.log(err);
                    }
                )



        }
    }
})();
