(function() {
'use strict';

angular
    .module('sync-ammo.time.service', [])
    .factory('time', function timeService() {
        var service = {
                convertTime: convertTime
            };

        // Converts seconds (number) to #M:SS string format
        // Eg: 61 => 1:1 -> They don't care of doing it 1:01
        function convertTime(totalSeconds) {
            var minutes,
                seconds;

            if (isNaN(totalSeconds)) {
                return '';
            }

            minutes = Math.floor(totalSeconds / 60);
            seconds = Math.floor(totalSeconds - minutes * 60);

            return '#' + minutes + ':' + seconds;
        }

        return service;
    });
})();
