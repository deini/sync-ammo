(function() {
    'use strict';

    angular
        .module('sync-ammo.player.service', [
            'sync-ammo.constants',
            'sync-ammo.spotify.service'
        ])
        .factory('player', function playerService(spotify) {
            var service = {
                    getStatus: getStatus,
                    pause: pause,
                    play: play,
                    setStatus: setStatus
                },
                status = {
                    playing: false,
                    playingPosition: 0,
                    song: {
                        name: null,
                        artist: null,
                        url: null
                    },
                    startedAt: null
                };

            function getStatus() {
                return status;
            }

            function pause() {
                spotify.pause()
                    .then(function pauseSuccess(data) {
                        setStatus(data);
                    });
            }

            function play(song, timeInSeconds) {
                spotify.play(song, timeInSeconds)
                    .then(function playSuccess(data) {
                        setStatus(data);
                    });
            }

            function setStatus(data) {
                var song = data.track;

                status.playing = data.playing;

                if (status.playing) {
                    status.song.name = song.track_resource.name;
                    status.song.url = song.track_resource.uri;
                    status.song.artist = song.artist_resource.name;
                    status.playingPosition = data.playing_position;
                    // TODO Handle startedAt
                }
            }

            return service;
        });
})();
