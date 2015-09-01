(function() {
    'use strict';

    angular
        .module('sync-ammo.home.controller', [
            'sync-ammo.auth.service',
            'sync-ammo.channel.service'
        ])
        .controller('HomeController', HomeController);

    function HomeController($state, channel) {
        var ctrl = this;

        ctrl.createChannel = createChannel;

        function createChannel() {
            return channel.create()
                .then(function(data) {
                    $state.go('sync-ammo.channel', { channelId: data.data.id });
                })
                .catch(function(err) {
                    console.log(err);
                });
        }
    }
})();
