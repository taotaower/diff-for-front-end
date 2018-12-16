(function () {
    angular
        .module('Project')
        .controller('MainController', MainController);

    function MainController(currentUser, userService) {
        console.log("currentUser", currentUser);
        const vm = this;
        vm.user = currentUser;
        vm.logout = logout;
        vm.url = window.location.href.split('#!')[1];

        function logout(){
            userService
                .logout()
                .then(function (){
                    location.reload();
                })
        }

        $('.carousel').carousel({
            interval: 5000,
            pause: "hover",
            wrap: true
        })
            .on('click', '.carousel-control', handle_nav);

        function handle_nav (e) {
            e.preventDefault();
            var nav = $(this);
            nav.parents('.carousel').carousel(nav.data('slide'));
        }
    }
})();