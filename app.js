var bodyParser = require('body-parser');
var express    = require('express');
var fs         = require('fs');
var https      = require('https');

var app    = express(),
    config = {
        key: fs.readFileSync('./ssl/key.pem'),
        cert: fs.readFileSync('./ssl/server.crt')
    },
    server = https.createServer(config, app);

app.use(bodyParser.json());

require('./backend/util/pubsub').setup(server);
require('./backend/util/session')(app);
require('./backend/router')(app);

server.listen(443);
