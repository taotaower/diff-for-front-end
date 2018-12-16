(function () {
    angular
        .module("Project")
        .config(configuration);

    function configuration($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/home/home.html',
                controller: 'MainController',
                controllerAs: 'vm',
                resolve: {
                    currentUser: checkCurrentUser
                }
            })
            .when('default', {
                templateUrl: 'views/home/home.html',
                controller: 'MainController',
                controllerAs: 'vm',
                resolve: {
                    currentUser: checkCurrentUser
                }
            })
            .when('/login', {
                templateUrl: 'views/user/templates/login.view.client.html',
                controller: 'LoginController',
                controllerAs: 'vm'
            })
            .when('/register', {
                templateUrl: 'views/user/templates/register.view.client.html',
                controller: 'RegisterController',
                controllerAs: 'vm'
            })
            .when('/admin', {
                templateUrl: 'views/admin/templates/admin.view.client.html',
                controller: 'AdminUserController',
                controllerAs: 'vm',
                resolve: {
                    currentUser: checkAdmin
                }
            })
            .when('/admin/user', {
                templateUrl: 'views/admin/templates/admin-users.view.client.html',
                controller: 'AdminUserController',
                controllerAs: 'vm',
                resolve: {
                    currentUser: checkAdmin
                }
            })
            .when('/admin/booking', {
                templateUrl: 'views/admin/templates/admin-bookings.view.client.html',
                controller: 'AdminBookingController',
                controllerAs: 'vm',
                resolve: {
                    currentUser: checkAdmin,
                    getToken: getToken
                }
            })
            .when('/admin/schedule', {
                templateUrl: 'views/admin/templates/admin-schedules.view.client.html',
                controller: 'AdminScheduleController',
                controllerAs: 'vm',
                resolve: {
                    currentUser: checkAdmin
                }
            })
            .when('/admin/flight', {
                templateUrl: 'views/admin/templates/admin-flights.view.client.html',
                controller: 'AdminFlightController',
                controllerAs: 'vm',
                resolve: {
                    currentUser: checkAdmin,
                    getToken: getToken
                }
            })
            .when('/staff',{
                templateUrl: 'views/staff/templates/staff.view.client.html',
                controller: 'StaffViewController',
                controllerAs: 'vm',
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when('/profile', {
                templateUrl: 'views/user/templates/profile.view.client.html',
                controller: 'ProfileController',
                controllerAs: 'vm',
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when('/public_profile/:username', {
                templateUrl: 'views/user/templates/public-profile.view.client.html',
                controller: 'PublicProfileController',
                controllerAs: 'vm',
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when('/booking/new', {
                templateUrl: 'views/booking/templates/booking-new.view.client.html',
                controller: 'NewBookingController',
                controllerAs: 'vm',
                resolve: {
                     currentUser: checkLoggedInWithAnonymous,
                     getToken: getToken
                }
            })
            .when('/booking/new/:origin/:destination', {
                templateUrl: 'views/booking/templates/booking-new.view.client.html',
                controller: 'NewBookingController',
                controllerAs: 'vm',
                resolve: {
                     currentUser: checkLoggedIn,
                     getToken: getToken
                }
            })
            .when('/booking', {
                templateUrl: 'views/booking/templates/booking-list.view.client.html',
                controller: 'BookingListController',
                controllerAs: 'vm',
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when('/booking/:bookingId', {
                templateUrl: 'views/booking/templates/booking-edit.view.client.html',
                controller: 'EditBookingController',
                controllerAs: 'vm',
                resolve: {
                    currentUser: checkLoggedInWithAnonymous
                }
            })
            .when('/schedule', {
                templateUrl: 'views/schedule/templates/schedule-list.view.client.html',
                controller: 'ScheduleListController',
                controllerAs: 'vm',
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when('/schedule/:scheduleId', {
                templateUrl: 'views/schedule/templates/schedule-detail.view.client.html',
                controller: 'ScheduleDetailController',
                controllerAs: 'vm',
                resolve: {
                    currentUser: checkLoggedIn
                }
            })
            .when('/operations/flightstatus/:airport/:date/:timeStart', {
                templateUrl: 'views/flight/template/flight-information.view.client.html',
                controller: 'FlightInformationController',
                controllerAs: 'vm',
                resolve: {
                    currentUser: checkLoggedInWithAnonymous,
                    getToken: getToken
                }
            })
            .when('/operations/flightstatus', {
                templateUrl: 'views/flight/template/flight-information.view.client.html',
                controller: 'FlightInformationController',
                controllerAs: 'vm',
                resolve: {
                    currentUser: checkLoggedInWithAnonymous,
                    getToken: getToken
                }
            })
            .when('/operations/flightstatus/:flightNumber/:date', {
                templateUrl: 'views/flight/template/flight-status.view.client.html',
                controller: 'FlightStatusController',
                controllerAs: 'vm',
                resolve: {
                    currentUser: checkLoggedInWithAnonymous,
                    getToken: getToken
                }
            })
    }

    function checkLoggedIn(userService, $q, $location) {
        var deferred = $q.defer();
        userService
            .loggedin()
            .then(function (user) {
                if(user === '0') {
                    deferred.reject();
                    $location.url('/login');
                } else {
                    deferred.resolve(user);
                }
            });

        return deferred.promise;
    }

    function checkLoggedInWithAnonymous(userService, $q, $location) {
        var deferred = $q.defer();
        userService
            .loggedin()
            .then(function (user) {
                if(user !== '0') {
                    deferred.resolve(user);
                } else {
                    deferred.resolve();
                }
            });

        return deferred.promise;
    }

    function checkAdmin(userService, $q, $location) {
        var deferred = $q.defer();
        userService
            .checkAdmin()
            .then(function (user) {
                if(user === '0') {
                    deferred.reject();
                    $location.url('/');
                } else {
                    deferred.resolve(user);
                }
            });

        return deferred.promise;
    }

    function checkCurrentUser(userService, $q, $location) {
        var deferred = $q.defer();

        userService
            .loggedin()
            .then(function (user) {
                if(user === '0') {
                    deferred.resolve({});
                } else {
                    deferred.resolve(user);
                }
            });

        return deferred.promise;
    }

    function getToken(){
        return token;
    }
})();


let token = "7ppasdga8b6hya57389wvcfn";

