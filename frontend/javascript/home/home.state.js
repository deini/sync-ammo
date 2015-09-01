(function() {
    'use strict';

    angular
        .module('sync-ammo.home.state', [
            'sync-ammo.home.controller',
            'sync-ammo.templates',
            'ui.router'
        ])
        .config(homeState);

    function homeState($stateProvider) {
        $stateProvider
            .state('sync-ammo.home', {
                url: '/',
                views: {
                    'main@': {
                        templateUrl: 'home/home.tpl.html',
                        controller: 'HomeController as homeController'
                    }
                }
            });
    }
})();