var bodyParser = require('body-parser');
var express    = require('express');
var http       = require('http');

var app    = express(),
    server = http.createServer(app);

app.use(bodyParser.json());

require('./backend/util/pubsub').setup(server);
require('./backend/util/session')(app);
require('./backend/router')(app);

server.listen(3000);
