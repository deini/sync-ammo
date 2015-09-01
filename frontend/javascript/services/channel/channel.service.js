(function() {
    'use strict';

    angular
        .module('sync-ammo.channel.service', [])
        .factory('channel', function authService($http, $q) {
            var channel,
                service;

            service = {
                getChannel: getChannel,
                setChannel: setChannel,
                updateStatus: updateStatus
            };

            function getChannel(id) {
                if (channel) {
                    return $q.when(channel);
                }

                return $http.get('/api/channel/' + id)
                    .then(function(data) {
                        channel = data;
                    });
            }

            function updateStatus(channel) {

            }

            function setChannel(channel) {
                return $http.post('/api/channel/' + channel.id, channel);
            }

            return service;
        });
})();
