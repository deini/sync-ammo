var Channel = require('../models/all').Channel;

module.exports = {
    create: create,
    find: find,
    get: get,
    incrementListeners: incrementListeners,
    decrementListeners: decrementListeners,
    removeRestrictedProperties: removeRestrictedProperties,
    updatePastSongs: updatePastSongs
};

function find(options) {
    return Channel.filter(options).run()
        .then(function(data) {
            return data[0];
        });
}

function get(id) {
    return Channel.get(id).run();
}

function create(options) {
    var channel;

    options = options || {};

    channel = new Channel(options);

    return channel.save();
}

function incrementListeners(channelId) {
    get(channelId)
        .then(function(channel) {
            channel.numListeners += 1;
            channel.save();
        });
}

function decrementListeners(channelId) {
    get(channelId)
        .then(function(channel) {
            if (channel) {
                channel.numListeners -= 1;
                channel.save();
            }
        });
}

function removeRestrictedProperties(channel) {
    delete(channel.numListeners);
    delete(channel.pastSongs);
}

function updatePastSongs(channel, newChannel) {
    if (!channel.status || !channel.status.song) {
        return;
    }

    if (channel.status.song.url && channel.status.song.url !== newChannel.status.song.url) {
        channel.pastSongs.unshift(channel.status.song);
    }

    if (channel.pastSongs.length > 10) {
        channel.pastSongs.pop();
    }
}
