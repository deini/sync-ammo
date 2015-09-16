var faye          = require('faye');
var channelHelper = require('../helpers/channel');

var bayeux;

module.exports = {
    setup: function(server) {
        bayeux = new faye.NodeAdapter({ mount: '/faye' });
        bayeux.getClient().addExtension(setPassword());
        bayeux.addExtension(checkPermissions());
        bayeux.attach(server);

        setupListeners();
    },
    client: function() {
        return bayeux.getClient();
    }
};

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
            message.ext = message.ext || {};
            message.ext.password = process.env.PUBSUB_SECRET;
            callback(message);
        }
    };
}

function checkPermissions() {
    var secret = process.env.PUBSUB_SECRET;

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
