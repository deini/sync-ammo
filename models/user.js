var thinky = require('../util/thinky.js'),
    type = thinky.type;

var User = thinky.createModel('User', {
    id: type.string(),
    name: type.string().min(3).max(10)
});

module.exports = User;

var Channel = require('./channel');

User.hasOne(Channel, 'user', 'id', 'ownerId');
