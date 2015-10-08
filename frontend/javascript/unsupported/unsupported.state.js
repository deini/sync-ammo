(function() {
    'use strict';

    angular
        .module('sync-ammo.unsupported.state', [
            'sync-ammo.templates',
            'ui.router'
        ])
        .config(unsupportedState);

    function unsupportedState($stateProvider) {
        $stateProvider
            .state('unsupported', {
                url: '/unsupported',
                views: {
                    'main@': {
                        templateUrl: 'unsupported/unsupported.tpl.html'
                    }
                }
            });
    }
})();