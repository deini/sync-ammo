var thinky = require('../util/thinky'),
    type   = thinky.type;

var Channel = thinky.createModel('Channel', {
    id             : type.string(),
    name           : type.string().min(3).max(10),
    ownerId        : type.string(),
    dj             : type.string(),
    numListeners   : type.number().default(0),
    pastSongs      : type.array().default([]),
    skipVoteEnabled: type.boolean().default(true),
    skipVotes      : type.number().default(0),
    currentStatus  : {
        playing        : type.boolean(),
        playingPosition: type.number(),
        song           : {
            name  : type.string(),
            artist: type.string(),
            url   : type.string()
        },
        startedAt      : type.date()
    }
});

module.exports = Channel;

var User = require('./user');

Channel.belongsTo(User, 'owner', 'ownerId', 'id');
