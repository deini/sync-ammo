var Channel = require('./all').Channel;

module.exports = {
    create: create,
    incrementListeners: incrementListeners,
    decrementListeners: decrementListeners
};

function get(id) {
    return Channel.get(id).run();
}

function create(options) {
    options = options || {};

    const channel = new Channel(options);

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
