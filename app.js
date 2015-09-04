var _             = require('lodash');
var bodyParser    = require('body-parser');
var constants     = require('./backend/constants');
var express       = require('express');
var faye          = require('faye');
var http          = require('http');
var path          = require('path');
var session       = require('express-session');
var RDBStore      = require('session-rethinkdb')(session);
var channelHelper = require('./backend/helpers/channel');
var userHelper    = require('./backend/helpers/user');
var api           = require('express-api-helper');

var bayeux;
var fayeClient;
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
    fayeClient = bayeux.getClient();

    fayeClient.addExtension(setPassword());

    app.use(session({
        key              : 'sid',
        secret           : 'my5uUperSEC537(key)!',
        store            : store,
        resave           : true,
        saveUninitialized: true
    }));

    app.use(bodyParser.json());

    app.use('/js', express.static(path.join(process.cwd(), 'build/js')));
    app.use('/css', express.static(path.join(process.cwd(), 'build/css')));
    app.get('/api/user', getUser);
    app.get('/api/channel/:channel/status', getChannel);
    app.get('/api/channel/:channel', getChannel);
    app.post('/api/channel/:channel', setChannel);
    app.post('/api/channel', findOrCreateChannel);

    bayeux.addExtension(checkPermissions());
    bayeux.attach(server);
    app.use(setUser);

    app.all('/*', function(req, res) {
        // Catch all route to support HTML5Mode
        res.sendFile('index.html', { root: __dirname });
    });

    server.listen(3000);
}

function getUser(req, res) {
    api.ok(req, res, req.session.user);
}

function getChannel(req, res) {
    channelHelper.get(req.params.channel)
        .then(function(channel) {
            api.ok(req, res, channel);
        })
        .catch(function() {
            api.notFound(req, res);
        });
}

function setChannel(req, res) {
    var user = req.session.user;

    if (!user) {
        return api.unauthorized(req, res);
    }

    channelHelper.get(req.params.channel)
        .then(function(channel) {
            if (user.id !== channel.dj) {
                api.unauthorized(req, res);
            }

            channelHelper.updatePastSongs(channel, req.body);
            channelHelper.removeRestrictedProperties(req.body);

            _.assign(channel, req.body);

            return channel.save();
        })
        .then(function(channel) {
            notifyClients(channel);

            return api.ok(req, res, channel);
        })
        .catch(function(err) {
            return api.badRequest(req, res, err);
        });
}

function notifyClients(channel) {
    fayeClient.publish('/' + channel.id, _.assign({}, channel));
}

function findOrCreateChannel(req, res) {
    channelHelper.find({ ownerId: req.session.user.id })
        .then(function(channel) {
            req.session.channel = channel.id;

            api.ok(req, res, channel);
        })
        .catch(function() {
            channelHelper.create({ ownerId: req.session.user.id })
                .then(function(channel) {
                    req.session.channel = channel.id;

                    api.ok(req, res, channel);
                });
        });
}

function setUser(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        userHelper.createUser({})
            .then(function(data) {
                req.session.user = data;
                next();
            });
    }
}

function setupListeners() {
    bayeux.on('subscribe', function(clientId, channel) {
        var channelId = channel.substring(1);

        channelHelper.incrementListeners(channelId);
    });

    bayeux.on('unsubscribe', function(clientId, channel) {
        var channelId = channel.substring(1);

        channelHelper.decrementListeners(channelId);
    });
}

function setPassword() {
    return {
        outgoing: function (message, callback) {
            message.ext          = message.ext || {};
            message.ext.password = 'some random hasherino';
            callback(message);
        }
    };
}

function checkPermissions() {
    var secret = 'some random hasherino';

    return {
        incoming: function(message, callback) {
            var password;

            if (!message.channel.match(/^\/meta\//)) {
                password = message.ext && message.ext.password;

                if (password !== secret) {
                    message.error = '403::Password required';
                }
            }
            callback(message);
        },

        outgoing: function(message, callback) {
            if (message.ext) {
                delete message.ext.password;
            }

            callback(message);
        }
    };
}
