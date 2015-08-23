var constants = require('./constants');
var express   = require('express');
var faye      = require('faye');
var http      = require('http');
var session   = require('express-session');
var RDBStore  = require('session-rethinkdb')(session);
var User      = require('./models/all').User;

var store = new RDBStore({
    servers: [{
        host: constants.RETHINK_HOST,
        port: constants.RETHINK_PORT
    }],
    table: 'session'
});

(function init() {
    setupServer();
})();

function setupServer() {
    var app    = express(),
        bayeux = new faye.NodeAdapter({ mount: '/faye' }),
        server = http.createServer(app);

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

    bayeux.attach(server);
    app.use(findOrCreteUser);

    app.all('/*', function(req, res) {
        // Catchall route to support HTML5Mode
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

        createUser()
            .then(function(data) {
                req.session.user = data;
                next();
            });
    }
}

function createUser() {
    var user = new User({});

    return user.saveAll();
}




//
//
//bayeux.getClient().publish('/email/new', {
//    text: 'New email has arrived!',
//    inboxSize: 34
//});
//
//bayeux.on('subscribe', function(clientId, channel) {
//    // get channel obj from redis
//    // +1 increment listener count
//    // Emit an increment to listeners in the client
//});
//
//bayeux.on('unsubscribe', function(clientId, channel) {
//    // get channel obj from redis
//    // -1 decrement listener count
//    // Emit a decrement to listeners in the client
//});
