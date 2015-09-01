(function() {
    'use strict';

    angular
        .module('sync-ammo.config', [])
        .config(appConfig);

    function appConfig($httpProvider, $locationProvider) {
        // Enabling html5 pushstate
        $locationProvider.html5Mode(true);

        // Send credentials with all requests
        $httpProvider.defaults.withCredentials = true;
    }
})();