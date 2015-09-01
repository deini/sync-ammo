angular.module('sync-ammo.constants', [])
    .constant('SPOTIFY', {
        DEFAULT_AJAX_OPTIONS: {
            headers: {
                Origin: 'https://embed.spotify.com'
            },
            method: 'GET'
        },
        EXTENSION_ID: 'opejcnahjldejgcoegkepenfbomiejic',
        HOST: 'https://tpcaahshvs.spotilocal.com:',
        OAUTH_URI: 'http://open.spotify.com/token',
        PUB_SUB: '/faye',
        REMOTE_PATH: '/remote',
        STARTING_PORT: 4370,
        TOKEN_PATH: '/simplecsrf/token.json?&ref=&cors='
    });
