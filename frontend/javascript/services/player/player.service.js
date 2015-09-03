(function() {
    'use strict';

    angular
        .module('sync-ammo.player.service', [
            'sync-ammo.spotify.service'
        ])
        .factory('player', function playerService(spotify) {
            var service = {
                    handleInitialStatus: handleInitialStatus,
                    handleStatusChange: handleStatusChange
                };

            function handleInitialStatus(status) {
                if (status.playing) {
                    spotify.play(status.song, status.playingPosition);
                }
            }

            function handleStatusChange(oldStatus, newStatus) {
                // If status changes from playing to paused
                if (oldStatus.playing !== newStatus.playing && !newStatus.playing) {
                    spotify.pause();

                    return true;
                }

                // Play a different song
                if (oldStatus.song.url !== newStatus.song.url) {
                    spotify.play(newStatus.song, newStatus.playingPosition);

                    return true;
                }

                // If same song detect seek
                if (Math.abs(oldStatus.playingPosition - newStatus.playingPosition) > 10) {
                    spotify.play(newStatus.song, newStatus.playingPosition);

                    return true;
                }

                return false;
            }

            return service;
        });
})();
