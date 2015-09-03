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

    function ChannelController($interval, $state, $stateParams, auth, channel, player, pubsub, spotify) {
        var ctrl = this,
            subscription;

        ctrl.inSync = true;
        ctrl.channel = channel.get;
        ctrl.cancelSubscription = cancelSubscription;
        ctrl.reSubscribe = reSubscribe;

        init();

        function init() {
            if (ctrl.channel().dj === auth.getUser().id) {
                ctrl.isDj = true;

                pollSpotifyStatus();
            } else {
                ctrl.isDj = false;

                player.handleInitialStatus(ctrl.channel().status);

                subscribeToUpdates();
            }
        }

        function pollSpotifyStatus() {
            $interval(function pollInterval() {
                spotify.getStatus()
                    .then(function pollIntervalSuccess(status) {
                        if (channel.needsToUpdateServer(status)) {
                            channel.setStatus(status);
                            channel.setServerChannel(channel.get());
                        } else {
                            channel.setStatus(status);
                        }
                    });
            }, 2000);
        }

        function subscribeToUpdates() {
            ctrl.inSync = true;

            subscription = pubsub.getClient().subscribe('/' + ctrl.channel().id, function(data) {
                var oldStatus = _.cloneDeep(channel.getStatus());

                channel.set(data);
                player.handleStatusChange(oldStatus, data.status);
            });
        }

        function cancelSubscription() {
            ctrl.inSync = false;
            subscription.cancel();
            spotify.pause();
        }

        function reSubscribe() {
            $state.go($state.current, $stateParams, { reload: true });
        }
    }
})();
