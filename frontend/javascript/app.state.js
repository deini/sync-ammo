(function() {
    'use strict';

    angular
        .module('sync-ammo.app.state', [
            'sync-ammo.app.controller',
            'sync-ammo.auth.service',
            'sync-ammo.extension.service',
            'sync-ammo.unsupported.state',
            'sync-ammo.templates',
            'sync-ammo.app.state',
            'ui.router'
        ])
        .config(syncAmmoState);

    function syncAmmoState($stateProvider) {
        $stateProvider
            .state('sync-ammo', {
                url: '/',
                views: {
                    'main@': {
                        controller: 'AppController as appController'
                    }
                },
                resolve: {
                    user: function(auth) {
                        return auth.login();
                    }
                }
            });
    }
})();