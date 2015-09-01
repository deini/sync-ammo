(function() {
    'use strict';

    angular
        .module('sync-ammo.home.controller', [
            'sync-ammo.auth.service'
        ])
        .controller('HomeController', HomeController);

    function HomeController($state) {
        var ctrl = this;

        ctrl.createChannel = createChannel;

        function createChannel() {
            $state.go('sync-ammo.channel');
        }
    }
})();
