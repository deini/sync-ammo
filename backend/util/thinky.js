var constants = require('../constants');

var thinky = require('thinky')({
    host: constants.RETHINK_HOST,
    port: constants.RETHINK_PORT,
    db: constants.DB_NAME
});

module.exports = thinky;
