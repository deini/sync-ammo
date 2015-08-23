var constants     = require('./constants');
var express       = require('express');
var faye          = require('faye');
var http          = require('http');
var session       = require('express-session');
var RDBStore      = require('session-rethinkdb')(session);
var channelHelper = require('./helpers/channel');
var userHelper    = require('./helpers/user');

var bayeux;
var store = new RDBStore({
    servers: [{
        host: constants.RETHINK_HOST,
        port: constants.RETHINK_PORT
    }],
    table: 'session'
});


(function init() {
    setupServer();
    setupListeners();
})();

function setupServer() {
    var app    = express(),
        server = http.createServer(app);

    bayeux = new faye.NodeAdapter({ mount: '/faye' });

    app.use(session({
        key              : 'sid',
        secret           : 'my5uUperSEC537(key)!',
        store            : store,
        resave           : true,
        saveUninitialized: true,
        cookie           : { httpOnly: false }
    }));

    //app.use('/js', express.static(path.join(process.cwd(), 'build/js')));
    //app.use('/css', express.static(path.join(process.cwd(), 'build/css')));

    bayeux.addExtension(checkPermissions());
    bayeux.attach(server);
    app.use(findOrCreteUser);

    app.all('/*', function(req, res) {
        // Catch all route to support HTML5Mode
        res.sendFile('index.html', { root: __dirname });
    });

    server.listen(3000);
}

function findOrCreteUser(req, res, next) {
    if (req.session.user) {
        console.log('user already exists');
        next();
    } else {
        console.log('creating user');

        userHelper.createUser({})
            .then(function(data) {
                req.session.user = data;
                next();
            });
    }
}

function setupListeners() {
    //bayeux.getClient().publish('/email/new', {
    //    text: 'New email has arrived!',
    //    inboxSize: 34
    //});

    bayeux.on('subscribe', function(clientId, channel) {
        console.log('Got one subscription from: ', clientId);
        console.log('To channel', channel);
        channelHelper.incrementListeners('bukis');
    });

    bayeux.on('unsubscribe', function(clientId, channel) {
        console.log('UNSUBSCRIBED');
        channelHelper.decrementListeners('bukis');
    });
}

function checkPermissions() {
    return {
        incoming: function(message, request, callback) {
            // TODO Handle logic of creating new channels
            // TODO Handle Logic for post just by owner/dj

            //console.log('server extension');
            //console.log(message);
            //console.log(request.headers.cookie);
            callback(message);
        }
    };
}

