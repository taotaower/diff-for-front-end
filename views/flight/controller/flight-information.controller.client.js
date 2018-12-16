(function () {
    angular
        .module('Project')
        .controller('FlightInformationController', flightInformationController);

    function flightInformationController ($routeParams,
                                          $location,
                                          getToken,
                                          flightService,
                                          userService,
                                          currentUser) {
        var vm = this;

        vm.user = currentUser;
        vm.airport = $routeParams['airport'];
        if (vm.airport === null || vm.airport === '' || typeof vm.airport === 'undefined') {
            vm.airport = null;
        } else {
            vm.date = new Date($routeParams['date'].replace('-', '\/'));
            vm.timeStart = $routeParams['timeStart'];
        }

        vm.tab = 'Airport';
        vm.url = window.location.href.split('#!')[1];
        console.log(vm.flight);

        vm.getAllFlightInformationByAirport = getAllFlightInformationByAirport; // by Airport
        vm.getFlightStatus = getFlightStatus; // by Flight Number
        vm.toggleTab = toggleTab;
        vm.logout = logout;

        function logout(){
            userService
                .logout()
                .then(function (){
                    location.reload();
                })
        }

        function getAllFlightInformationByAirport(airport, date, time_start, flightType) {
            vm.error = null;
            vm.flights = null;

            // handling exceptions for inputs
            if (airport === null || airport === '' || typeof airport === 'undefined') {
                vm.error1 = 'Airport field required!';
                vm.error2 = null;
                vm.error3 = null;
                vm.error4 = null;
                return;
            }

            if (date === null || date === '' || typeof date === 'undefined') {
                vm.error1 = null;
                vm.error2 = 'Date field required!';
                vm.error3 = null;
                vm.error4 = null;
                return;
            }

            if (time_start === null || time_start === '' || typeof time_start === 'undefined') {
                vm.error1 = null;
                vm.error2 = null;
                vm.error3 = 'Time Start field required!';
                vm.error4 = null;
                return;
            }

            if (flightType === null || flightType === '' || typeof flightType === 'undefined') {
                vm.error1 = null;
                vm.error2 = null;
                vm.error3 = null;
                vm.error4 = "You have to choose either Departures or Arrivals!";
                return;
            }
            vm.error1 = null;
            vm.error2 = null;
            vm.error3 = null;
            vm.error4 = null;


            // all the inputs are acceptable
            vm.flights = null;
            vm.waiting = "Please wait a second...";
            vm.oldAirport = angular.copy(airport);
            vm.oldFlightType = angular.copy(flightType);

            var dd = ((date.getDate()<10) ? '0':'' ) + date.getDate();
            //January is 0!
            var mm = ((date.getMonth()<9) ? '0':'' ) + (date.getMonth() + 1);
            var yyyy = date.getFullYear();

            date = yyyy +'-' + mm + '-' + dd;
            vm.dateFormat = date;

            var host = 'api.lufthansa.com';
            var url = 'https://'+host+'/v1/operations/flightstatus/' + flightType + '/';

            var bearer_token = getToken;

            url += airport + '/' + date + 'T' +  time_start + "?limit=80";

            flightService
                .getAllFlightInformationByAirport(url, bearer_token)
                .then(function (flights){
                    vm.flights = flights;
                }, function () {
                    vm.error = "No flight found! Please note that the permitted range for flights returned is from yesterday until 5 days in the future in 4 hours ranges."
                });
        }

        function getFlightStatus(flightNumber, date) {
            vm.error = null;
            vm.flight = null;

            // handling exceptions for inputs
            if (flightNumber === null || flightNumber === '' || typeof flightNumber === 'undefined') {
                vm.error1 = 'Flight Number field required!';
                vm.error2 = null;
                return;
            }

            if (date === null || date === '' || typeof date === 'undefined') {
                vm.error1 = null;
                vm.error2 = 'Date field required!';
                return;
            }

            vm.error1 = null;
            vm.error2 = null;

            // all the inputs are acceptable
            vm.waiting = "Please wait a second...";
            vm.oldFlightNumber = angular.copy(flightNumber);

            // format date
            var dd = ((date.getDate()<10) ? '0':'' ) + date.getDate();
            //January is 0!
            var mm = ((date.getMonth()<9) ? '0':'' ) + (date.getMonth() + 1);
            var yyyy = date.getFullYear();

            date = yyyy +'-' + mm + '-' + dd;
            vm.dateFormat = date;

            var host = 'api.lufthansa.com';
            var url = 'https://'+host+'/v1/operations/flightstatus/';

            var bearer_token = getToken;

            url += flightNumber + '/' + date;

            flightService
                .getFlightStatus(url, bearer_token)
                .then(function (flight){
                    console.log(flight);
                    vm.flight = flight;
                }, function () {
                    vm.error = "No flight found! Please recheck the inputs."
                });
        }

        function toggleTab(tab) {
            if (tab === 'Airport') {
                vm.error1 = null;
                vm.error2 = null;
                vm.error = null;
                vm.waiting = null;
                vm.tab = 'Airport';
            } else {
                vm.error1 = null;
                vm.error2 = null;
                vm.error = null;
                vm.waiting = null;
                vm.tab = 'FlightNumber';
            }
        }

    }
})();
