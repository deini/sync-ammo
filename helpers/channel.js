var Channel = require('../models/all').Channel;

module.exports = {
    incrementListeners: incrementListeners,
    decrementListeners: decrementListeners
};

function incrementListeners(channelName) {
    Channel.filter({ name: channelName }).run()
        .then(function(channels) {
            if (channels[0]) {
                channels[0].numListeners += 1;
                channels[0].save();
            }
        });

    // TODO: Update the count with next dj message
}

function decrementListeners(channelName) {
    Channel.filter({ name: channelName }).run()
        .then(function(channels) {
            if (channels[0]) {
                channels[0].numListeners -= 1;
                channels[0].save();
            }
        });
}
