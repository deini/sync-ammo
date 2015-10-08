(function() {
    'use strict';

    angular
        .module('sync-ammo.extension.service', [
            'sync-ammo.constants',
            'ui-notification'
        ])
        .factory('extension', function playerService($q, $window, EXTENSION, Notification) {
            var service = {
                install: install,
                isChrome: isChrome,
                isInstalled: isInstalled,
                notifyNotInstalled: notifyNotInstalled
            };

            function isChrome() {
                return !_.isUndefined($window.chrome);
            }

            function install($event) {
                $event.preventDefault();

                $window.chrome.webstore.install(EXTENSION.url,
                    function successInstall() {
                        Notification.success('Extension installed successfully.');
                        $window.location.reload();
                    },
                    function failedInstall() {
                        Notification.error({ message: 'There was a problem installing the extension' });
                    });
            }

            function isInstalled() {
                var deferred = $q.defer();

                $window.chrome.runtime.sendMessage(EXTENSION.id, { method: 'GET' }, function(response) {
                    if (_.isUndefined(response)) {
                        deferred.resolve(false);
                    } else {
                        deferred.resolve(true);
                    }
                });

                return deferred.promise;
            }

            function notifyNotInstalled() {
                Notification.error({ message: 'Extension not Installed', delay: null });
            }

            return service;
        });
})();
