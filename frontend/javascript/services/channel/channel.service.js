(function() {
    'use strict';

    angular
        .module('sync-ammo.channel.service', [
            'sync-ammo.spotify.service'
        ])
        .factory('channel', function authService($http, $q) {
            var channel,
                service;

            service = {
                create: create,
                get: get,
                set: set,
                setStatus: setStatus,
                setServerStatus: setServerStatus
            };

            function create() {
                return $http.post('/api/channel')
                    .then(function(data) {
                        channel = data;
                    });
            }

            function get(id) {
                if (channel) {
                    return $q.when(channel);
                }

                return $http.get('/api/channel/' + id)
                    .then(function(data) {
                        channel = data;
                    });
            }

            function set(channel) {
                return $http.post('/api/channel/' + channel.id, channel);
            }

            function setServerStatus(status) {
                service.setStatus(status);

                if (needsToUpdateServer(status)) {
                    return $http.post('/api/channel/' + channel.id + '/status', channel.status);
                }
            }

            function setStatus(status) {
                channel.status = status;
            }

            function needsToUpdateServer(status) {
                // If is a different Song
                if (channel.status.song.url !== status.song.url) {
                    return true;
                }

                // If pause/play changed
                if (channel.status.playing !== status.playing) {
                    return true;
                }

                // If seek is detected
                return Math.abs(channel.status.playingPosition - status.playingPosition) > 10;
            }

            return service;
        });
})();
