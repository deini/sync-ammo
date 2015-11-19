(function() {
    'use strict';

    angular
        .module('sync-ammo.home.state', [
            'sync-ammo.extension.service',
            'sync-ammo.home.controller',
            'sync-ammo.templates',
            'ui.router'
        ])
        .config(homeState);

    function homeState($stateProvider) {
        $stateProvider
            .state('sync-ammo.home', {
                url: 'home',
                resolve: {
                    isExtensionInstalled: function(extension) {
                        return extension.isInstalled();
                    }
                },
                views: {
                    'main@': {
                        templateUrl: 'home/home.tpl.html',
                        controller: 'HomeController as homeController'
                    }
                }
            });
    }
})();