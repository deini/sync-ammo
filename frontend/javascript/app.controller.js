(function() {
    'use strict';

    angular
        .module('sync-ammo.app.controller', [
            'sync-ammo.extension.service',
            'ui.router'
        ])
        .controller('AppController', AppController);

    function AppController($state, extension) {
        init();

        function init() {
            if (extension.isChrome()) {
                $state.go('sync-ammo.home');
            } else {
                $state.go('unsupported');
            }
        }
    }
})();
