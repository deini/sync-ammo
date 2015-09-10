(function() {
    'use strict';

    angular
        .module('sync-ammo.spotify.service', [
            'sync-ammo.constants',
            'sync-ammo.time.service'
        ])
        .factory('spotify', function spotifyService($http, $q, $timeout, SPOTIFY, time) {
            var initialized = false,
                service = {
                    getStatus: getStatus,
                    getImage: getImage,
                    isReady: isReady,
                    pause: pause,
                    play: play
                },
                port = SPOTIFY.STARTING_PORT,
                tokens = {};

            function makeSpotifyReady() {
                var deferred = $q.defer();

                if (service.isReady()) {
                    return $q.when();
                }

                rejectAfterTimer(deferred);

                findPort(SPOTIFY.STARTING_PORT)
                    .then(function initializeSucces() {
                        return getCsrfToken();
                    })
                    .then(function findCsrfTokenSucces(data) {
                        tokens.csrf = data.token;

                        return getOauthToken();
                    })
                    .then(function findOauthTokenSuccess(data) {
                        tokens.oauth = data.t;
                        initialized = true;

                        deferred.resolve();
                    });

                return deferred.promise;
            }

            function findPort(portToTry, deferred, tries) {
                var options;

                tries = tries || 1;
                deferred = deferred || $q.defer();
                options = _.merge({}, SPOTIFY.DEFAULT_AJAX_OPTIONS, {
                    url: SPOTIFY.HOST + portToTry + SPOTIFY.TOKEN_PATH
                });

                makeRequest(options)
                    .then(function findPortSuccess() {
                        port = portToTry;
                        deferred.resolve(port);
                    })
                    .catch(function findPortCatch() {
                        if (tries < 20) {
                            findPort(portToTry + 1, deferred, tries + 1);
                        } else {
                            deferred.reject('Spotify Client not found.');
                        }
                    });

                return deferred.promise;
            }

            function getCsrfToken() {
                return makeRequest({
                    url: SPOTIFY.HOST + port + SPOTIFY.TOKEN_PATH
                });
            }

            function getOauthToken() {
                return makeRequest({
                    url: SPOTIFY.OAUTH_URI
                });
            }

            function play(song, timeInSeconds) {
                var songId = song.url ? song.url.replace('track', 'trackset:dummy') : '';

                return makeAuthorizedRequest({
                    url: SPOTIFY.HOST + port + SPOTIFY.REMOTE_PATH + '/play.json',
                    params: {
                        uri: song.url + time.convertTime(timeInSeconds),
                        context: songId
                    }
                });
            }

            function pause() {
                return makeAuthorizedRequest({
                    url: SPOTIFY.HOST + port + SPOTIFY.REMOTE_PATH + '/pause.json',
                    params: { pause: true }
                });
            }

            function getStatus() {
                return makeAuthorizedRequest({
                    url: SPOTIFY.HOST + port + SPOTIFY.REMOTE_PATH + '/status.json'
                })
                    .then(function(data) {
                            var song = data.track,
                                status = {
                                    song: {}
                                };

                            status.playing = data.playing;

                            if (status.playing) {
                                status.song.name = song.track_resource.name;
                                status.song.url = song.track_resource.uri;
                                status.song.webUrl = song.track_resource.location.og;
                                status.song.artist = song.artist_resource.name;
                                status.playingPosition = data.playing_position;
                                // TODO Handle startedAt
                            }

                        return status;
                    });
            }

            function getImage(status) {
                var songId,
                    songUrl;

                if (!status || !status.song || !status.song.url) {
                    return $q.when('');
                }

                songUrl = status.song.url;
                songId = songUrl.substr(songUrl.lastIndexOf(':') + 1);

                return $http.get('https://api.spotify.com/v1/tracks/' + songId, { withCredentials: false })
                    .then(function spotifySuccess(data) {
                        return data.data.album.images[1];
                    })
                    .catch(function spotifyCatch() {
                        return '';
                    });
            }

            function isReady() {
                return initialized;
            }

            function makeAuthorizedRequest(options) {
                return makeSpotifyReady()
                    .then(function makeSpotifyReadySuccess() {
                        return makeRequest(options);
                    });
            }

            function makeRequest(options) {
                var deferred = $q.defer(),
                    extensionId = SPOTIFY.EXTENSION_ID;

                options = _.merge(options, SPOTIFY.DEFAULT_AJAX_OPTIONS, {
                    params: tokens
                });

                chrome.runtime.sendMessage(extensionId, options, function(response) {
                    if (response.error) {
                        deferred.reject(response.error);
                    }

                    deferred.resolve(response.data);
                });

                // Call Chrome Extension and Return promise
                return deferred.promise;
            }

            function rejectAfterTimer(deferred) {
                $timeout(function cancelFindClient() {
                    deferred.reject('Spotify Client not Found');
                }, 2000);
            }

            return service;
        });
})();
