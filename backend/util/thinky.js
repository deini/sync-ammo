var constants = require('../constants');

var thinky = require('thinky')({
    host: constants.RETHINK_HOST,
    port: constants.RETHINK_PORT
});

module.exports = thinky;
