var constants  = require('../constants');
var session    = require('express-session');
var RDBStore   = require('session-rethinkdb')(session);
var userHelper = require('../helpers/user');

var store = new RDBStore({
    servers: [{
        host: constants.RETHINK_HOST,
        port: constants.RETHINK_PORT
    }],
    db: constants.DB_NAME,
    table: 'session'
});

module.exports = function(app) {
    app.use(session({
            key              : 'sid',
            secret           : process.env.SESSION_SECRET,
            store            : store,
            resave           : true,
            saveUninitialized: true
        })
    );

    app.use(function setUser(req, res, next) {
        if (req.session.user) {
            next();
        } else {
            userHelper.createUser({})
                .then(function(data) {
                    req.session.user = data;
                    next();
                });
        }
    });
};
