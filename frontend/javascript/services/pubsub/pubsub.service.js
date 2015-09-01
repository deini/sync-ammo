/* global Faye */
(function() {
    'use strict';

    angular
        .module('sync-ammo.pubsub.service', [
            'sync-ammo.constants'
        ])
        .factory('pubsub', function pubsubService(PUB_SUB) {
            var service = {
                    getClient: getClient
                },
                client;

            function getClient() {
                if (!client) {
                    client = new Faye.Client(PUB_SUB);
                }

                return client;
            }

            return service;
        });
})();