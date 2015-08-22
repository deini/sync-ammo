var http = require('http'),
    faye = require('faye');

var server = http.createServer(),
    bayeux = new faye.NodeAdapter({mount: '/'});

bayeux.attach(server);
server.listen(8000);

bayeux.getClient().publish('/email/new', {
    text: 'New email has arrived!',
    inboxSize: 34
});

bayeux.on('subscribe', function(clientId, channel) {
    // get channel obj from redis
    // +1 increment listener count
    // Emit an increment to listeners in the client
});

bayeux.on('unsubscribe', function(clientId, channel) {
    // get channel obj from redis
    // -1 decrement listener count
    // Emit a decrement to listeners in the client
});