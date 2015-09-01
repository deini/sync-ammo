(function() {
    'use strict';

    angular
        .module('sync-ammo.channel.state', [
            'sync-ammo.channel.controller',
            'sync-ammo.channel.service',
            'sync-ammo.templates',
            'ui.router'
        ])
        .config(channelState);

    function channelState($stateProvider) {
        $stateProvider
            .state('sync-ammo.channel', {
                url: '/channel/:channelId',
                resolve: {
                    currentChannel: function($stateParams, channel) {
                        if ($stateParams.channelId) {
                            channel.get($stateParams.channelId)
                                .then(function(data) {
                                    return data;
                                })
                                .catch(function(err) {
                                    console.log(err);
                                });
                        } else {
                            channel.create()
                                .then(function(data) {
                                    return data;
                                })
                                .catch(function(err) {
                                    console.log(err);
                                });
                        }
                    }
                },
                views: {
                    'main@': {
                        templateUrl: 'channel/channel.tpl.html',
                        controller: 'ChannelController as channelController'
                    }
                }
            });
    }
})();