(function() {
    'use strict';

    angular
        .module('sync-ammo.auth.service', [])
        .factory('auth', function authService($http, $q) {
            var service,
                user;

            service = {
                getUser: getUser,
                login: login
            };

            login();

            function getUser() {
                return user;
            }

            function login() {
                if (service.getUser()) {
                    return $q.when(service.getUser());
                }

                $http.get('/api/user')
                    .then(function(data) {
                        user = data.data;
                    })
                    .catch(function(err) {
                        console.log('Error while trying to log in', err);
                    });
            }

            return service;
        });
})();
