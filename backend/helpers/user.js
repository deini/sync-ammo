var User = require('../models/all').User;

module.exports = {
    createUser: createUser
};

function createUser(data) {
    var user = new User(data);

    return user.save();
}
