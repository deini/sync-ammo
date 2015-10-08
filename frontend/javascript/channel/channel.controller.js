(function() {
    'use strict';

    angular
        .module('sync-ammo.channel.controller', [
            'sync-ammo.auth.service',
            'sync-ammo.channel.service',
            'sync-ammo.extension.service',
            'sync-ammo.player.service',
            'sync-ammo.pubsub.service',
            'sync-ammo.spotify.service',
            'ui.router'
        ])
        .controller('ChannelController', ChannelController);

    function ChannelController($interval, $state, $stateParams, auth, channel, extension, isExtensionInstalled, player, pubsub, spotify) {
        var ctrl = this,
            pollInterval,
            subscription;

        ctrl.inSync = true;
        ctrl.channel = channel.get;
        ctrl.cancelSubscription = cancelSubscription;
        ctrl.reSubscribe = reSubscribe;
        ctrl.isExtensionInstalled = isExtensionInstalled;
        ctrl.installExtension = extension.install;

        init();

        function init() {
            if (!ctrl.isExtensionInstalled) {

                return;
            }

            if (ctrl.channel().dj === auth.getUser().id) {
                ctrl.isDj = true;

                pollSpotifyStatus(updateChannelStatus);
            } else {
                ctrl.isDj = false;

                player.handleInitialStatus(ctrl.channel().status);

                subscribeToUpdates();
                pollSpotifyStatus(keepClientInSync);
            }
        }

        function pollSpotifyStatus(callback) {
            pollInterval = $interval(function pollInterval() {
                spotify.getStatus()
                    .then(callback);
            }, 2000);
        }

        function updateChannelStatus(status) {
            if (channel.needsToUpdateServer(status)) {
                spotify.getImage(status)
                    .then(function(data) {
                        status.song.image = data.url;
                        channel.setStatus(status);
                        channel.setServerChannel(channel.get());
                    });
            } else {
                channel.setStatus(status);
            }
        }

        /**
         * If a listener gets desync by ads or any other reason => resync.
         * With the exception if they pause their Spotify client.
         * @param status - Status returned by spotify.getStatus()
         */
        function keepClientInSync(status) {
            var syncedStatus = channel.getStatus();

            if (!status || !status.playing) {
                return;
            }

            _.defaultsDeep(status, syncedStatus);

            syncedStatus.playingPosition = player.calculatePlayingPosition(syncedStatus);
            player.handleStatusChange(status, syncedStatus);

            channel.setStatus(syncedStatus);
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
            $interval.cancel(pollInterval);
            spotify.pause();
        }

        function reSubscribe() {
            $state.go($state.current, $stateParams, { reload: true });
        }
    }
})();
