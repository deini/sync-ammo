var thinky = require('../util/thinky'),
    type   = thinky.type;

var Channel = thinky.createModel('Channel', {
    id             : type.string(),
    name           : type.string().min(3).max(50).default(function() { return this.id; }),
    ownerId        : type.string(),
    dj             : type.string().default(function() { return this.ownerId; }),
    numListeners   : type.number().default(0),
    pastSongs      : type.array().default([]),
    skipVoteEnabled: type.boolean().default(true),
    skipVotes      : type.number().default(0),
    status  : {
        playing        : type.boolean(),
        playingPosition: type.number(),
        song           : {
            name   : type.string(),
            artist : type.string(),
            image  : type.string(),
            url    : type.string(),
            webUrl : type.string()
        },
        updatedAt      : type.date()
    }
});

module.exports = Channel;

var User = require('./user');

Channel.belongsTo(User, 'owner', 'ownerId', 'id');
