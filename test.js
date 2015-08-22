var express  = require('express');
var session  = require('express-session');
var RDBStore = require('session-rethinkdb')(session);
var User     = require('./models/all').User;

var store = new RDBStore({
    servers: [{
        host: '192.168.99.100',
        port: 32772
    }],
    table: 'session'
});

var app = express();

app.use(session({
    key              : 'sid',
    secret           : 'my5uUperSEC537(key)!',
    store            : store,
    resave           : true,
    saveUninitialized: true
}));

function createUser() {
    var user = new User({});

    return user.saveAll();
}

app.use(function (req, res, next) {
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
});

app.get('/', function(req, res, next) {
    console.log(req.session.user);
    res.send('DREAM?');
});

app.listen(3000);