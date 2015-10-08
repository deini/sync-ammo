(function() {
    'use strict';

    angular
        .module('sync-ammo.app.state', [
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
                abstract: true,
                resolve: {
                    user: function (auth) {
                        auth.login();
                    }
                },
                onEnter: function($state, extension) {
                    if (!extension.isChrome()) {
                        $state.go('unsupported');
                    }
                }
            });
    }
})();