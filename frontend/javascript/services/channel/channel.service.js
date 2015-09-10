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
                fetch: fetch,
                get: get,
                getStatus: getStatus,
                needsToUpdateServer: needsToUpdateServer,
                set: set,
                setStatus: setStatus,
                setServerChannel: setServerChannel
            };

            function create() {
                return $http.post('/api/channel')
                    .then(function(data) {
                        service.set(data.data);

                        return data;
                    });
            }

            function get() {
                return channel;
            }

            function fetch(id) {
                return $http.get('/api/channel/' + id)
                    .then(function(data) {
                        service.set(data.data);

                        return data.data;
                    });
            }

            function getStatus() {
                return channel && channel.status ? channel.status : {};
            }

            function set(updatedChannel) {
                channel = updatedChannel;
            }

            function setServerChannel(updatedChannel) {
                return $http.post('/api/channel/' + channel.id, updatedChannel)
                    .then(function(data) {
                        service.set(data.data);
                    });
            }


            function setStatus(status) {
                channel.status = status;
            }

            function needsToUpdateServer(status) {
                // If it's the first run
                if (!channel || !channel.status) {
                    return true;
                }

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
