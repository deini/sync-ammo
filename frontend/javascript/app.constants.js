angular.module('sync-ammo.constants', [])
    .constant('SPOTIFY', {
        DEFAULT_AJAX_OPTIONS: {
            headers: {
                Origin: 'https://embed.spotify.com'
            },
            method: 'GET'
        },
        HOST: 'https://tpcaahshvs.spotilocal.com:',
        OAUTH_URI: 'http://open.spotify.com/token',
        REMOTE_PATH: '/remote',
        STARTING_PORT: 4370,
        TOKEN_PATH: '/simplecsrf/token.json?&ref=&cors='
    })
    .constant('PUB_SUB', '/faye')
    .constant('EXTENSION', {
        id: 'opejcnahjldejgcoegkepenfbomiejic',
        url: 'https://chrome.google.com/webstore/detail/opejcnahjldejgcoegkepenfbomiejic'
    });
