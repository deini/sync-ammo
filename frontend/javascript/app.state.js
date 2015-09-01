(function() {
    'use strict';

    angular
        .module('sync-ammo.app.state', [
            'sync-ammo.spotify.service',
            'sync-ammo.templates',
            'ui.router'
        ])
        .config(syncAmmoState);

    function syncAmmoState($stateProvider) {
        $stateProvider
            .state('sync-ammo', {
                abstract: true
            });
    }
})();