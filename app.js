var constants     = require('./constants');
var express       = require('express');
var faye          = require('faye');
var http          = require('http');
var session       = require('express-session');
var RDBStore      = require('session-rethinkdb')(session);
var channelHelper = require('./helpers/channel');
var userHelper    = require('./helpers/user');
var api           = require('express-api-helper');

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
        saveUninitialized: true
    }));

    //app.use('/js', express.static(path.join(process.cwd(), 'build/js')));
    //app.use('/css', express.static(path.join(process.cwd(), 'build/css')));
    app.get('/api/:channel/status', getChannelStatus);
    app.post('/api/:channel/status', setChannelStatus);
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

function getChannelStatus(req, res) {
    channelHelper.get(req.params.channel)
        .then(function(channel) {
            api.ok(req, res, channel);
        })
        .catch(function() {
            api.notFound(req, res);
        });
}

function setChannelStatus(req, res) {
    const user = req.session.user;

    if (!user) {
        return api.unauthorized(req, res);
    }

    channelHelper.get(req.params.channel)
        .then(function(channel) {
            if (user.id !== channel.dj) {
                api.unauthorized(req, res);
            }

            channel.status = req.body.status;
            channel.save();

            notifyClients(channel);

            return api.ok(req, res, channel);
        });
}

function notifyClients(channel) {
    bayeux.getClient().publish(`/${channel.id}`, {
        status: channel.status
    });
}

function findOrCreateChannel(req, res) {
        channelHelper.find()
            .then(function(channel) {
                req.session.channel = channel.id;

                return api.ok(req, res, channel);
            })
            .catch(channelHelper.create({ ownerId: req.session.user.id })
                .then(function(channel) {
                    req.session.channel = channel.id;

                    return api.ok(req, res, channel);
                }));
}

function setUser(req, res, next) {
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
    bayeux.on('subscribe', function(clientId, channel) {
        const channelId = channel.substring(1);

        channelHelper.incrementListeners(channelId);
    });

    bayeux.on('unsubscribe', function(clientId, channel) {
        const channelId = channel.substring(1);

        channelHelper.decrementListeners(channelId);
    });
}

function checkPermissions() {
    const secret = 'some random hasherino';

    return {
        incoming: function(message, callback) {
            if (!message.channel.match(/^\/meta\//)) {
                const password = message.ext && message.ext.password;

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