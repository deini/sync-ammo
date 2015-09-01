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

    function ChannelController($interval, $scope, auth, channel, currentChannel, player, pubsub, spotify) {
        var ctrl = this;

        ctrl.channel = currentChannel;
        ctrl.status = player.getStatus;

        player.setStatus(ctrl.channel.status);

        if (ctrl.channel.dj === auth.getUser().id) {
            pollSpotifyStatus();
        } else {
            subscribeToUpdates();
        }

        function pollSpotifyStatus() {
            $interval(function pollInterval() {
                spotify.getStatus()
                    .then(function pollIntervalSuccess(data) {
                        player.setStatus(data);
                        channel.updateStatus(player.getStatus());
                    });
            }, 2000);
        }

        function subscribeToUpdates() {
            var subscription = pubsub.getClient().subscribe('/' + ctrl.channel.id, function(data) {
                player.setStatus(data.status);
            });

            $scope.$watch(function playingStatus() {
                return $scope.channel.currentStatus.playing;
            }, function playingStatusChanged(newValue) {
                if (!newValue) {
                    player.pause();
                }
            });

            $scope.$watch(function songStatus() {
                return $scope.channel.currentStatus.song.url;
            }, function songStatusChanged() {
                player.play($scope.channel.currentStatus.song, $scope.channel.currentStatus.playingPosition);
            });

            $scope.$watch(function playingPosition() {
                return $scope.channel.currentStatus.playingPosition;
            }, function playingPositionChanged(newValue, oldValue) {
                if (seekDetected(newValue, oldValue) && isSameSong()) {
                    player.play($scope.channel.currentStatus.song, newValue);
                }
            });
        }

        function seekDetected(newValue, oldValue) {
            return Math.abs(newValue - oldValue) > 10;
        }

        function isSameSong() {
            return $scope.channel.currentStatus.song.url === player.getCurrentStatus().song.url;
        }
    }
})();
