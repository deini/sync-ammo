(function() {
    'use strict';

    angular
        .module('sync-ammo.home.controller', [
            'sync-ammo.auth.service',
            'sync-ammo.channel.service',
            'sync-ammo.extension.service'
        ])
        .controller('HomeController', HomeController);

    function HomeController($state, channel, extension, isExtensionInstalled) {
        var ctrl = this;

        ctrl.createChannel = createChannel;
        ctrl.installExtension = extension.install;
        ctrl.isExtensionInstalled = isExtensionInstalled;

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
