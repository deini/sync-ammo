var express = require('express');
var path    = require('path');

module.exports = function(app) {
    // Api routes
    app.use('/api/channel/', require('./api/channel'));
    app.use('/api/user/', require('./api/user'));

    // Statics
    app.use('/js', express.static(path.join(process.cwd(), 'build/js')));
    app.use('/css', express.static(path.join(process.cwd(), 'build/css')));
    app.use('/fonts', express.static(path.join(process.cwd(), 'build/fonts')));

    // Catch all route to support HTML5Mode
    app.all('/*', function(req, res) {
        res.sendFile('index.html', { root: process.cwd() });
    });
};