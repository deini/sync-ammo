(function() {
    'use strict';

    angular
        .module('sync-ammo', [
            // Config
            'sync-ammo.config',

            // App state
            'sync-ammo.app.state',

            // Modules
            'sync-ammo.home',
            'sync-ammo.channel',

            // Services
            'sync-ammo.auth.service',
            'sync-ammo.channel.service',
            'sync-ammo.player.service',
            'sync-ammo.pubsub.service',
            'sync-ammo.spotify.service',
            'sync-ammo.time.service'

            // Directives

            // Third party modules
        ])

        .constant(_, window._)

        .run(function appRun($log, $rootScope) {
            $rootScope
                .$on('$stateChangeError', function stateChangeError(event, toState, toParams, fromState, fromParams, error) {
                    $log.error('Error in state transition: ', error);
                });
        });
})();
