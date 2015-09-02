(function() {
    'use strict';

    angular
        .module('sync-ammo.channel.controller', [
            'sync-ammo.auth.service',
            'sync-ammo.channel.service',
            'sync-ammo.player.service',
            'sync-ammo.pubsub.service',
            'sync-ammo.spotify.service',
            'ui.router'
        ])
        .controller('ChannelController', ChannelController);

    function ChannelController($interval, auth, channel, player, pubsub, spotify) {
        var ctrl = this,
            subscription;

        ctrl.channel = channel.get;

        if (ctrl.channel().dj === auth.getUser().id) {
            ctrl.isDj = true;
            pollSpotifyStatus();
        } else {
            ctrl.isDj = false;
            subscribeToUpdates();
        }

        function pollSpotifyStatus() {
            $interval(function pollInterval() {
                spotify.getStatus()
                    .then(function pollIntervalSuccess(data) {
                        channel.setServerStatus(data);
                    });
            }, 2000);
        }

        function subscribeToUpdates() {
            subscription = pubsub.getClient().subscribe('/' + ctrl.channel().id, function(data) {
                var oldStatus = _.cloneDeep(channel.getStatus());

                channel.set(data);
                player.handleStatusChange(oldStatus, data.status);
            });
        }

        function cancelSubscription() {
            subscription.cancel();
        }
    }
})();
