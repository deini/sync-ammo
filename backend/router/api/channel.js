var _             = require('lodash');
var api           = require('express-api-helper');
var channelHelper = require('../../helpers/channel');
var pubsubClient  = require('../../util/pubsub').client();
var router        = require('express').Router();

router.get('/:channel/status', getChannel);
router.get('/:channel', getChannel);
router.post('/:channel', setChannel);
router.post('', findOrCreateChannel);

function getChannel(req, res) {
    channelHelper.get(req.params.channel)
        .then(function(channel) {
            api.ok(req, res, channel);
        })
        .catch(function() {
            api.notFound(req, res);
        });
}

function setChannel(req, res) {
    var user = req.session.user;

    if (!user) {
        return api.unauthorized(req, res);
    }

    channelHelper.get(req.params.channel)
        .then(function(channel) {
            if (user.id !== channel.dj) {
                api.unauthorized(req, res);
            }

            channelHelper.updatePastSongs(channel, req.body);
            channelHelper.removeRestrictedProperties(req.body);

            _.assign(channel, req.body);

            return channel.save();
        })
        .then(function(channel) {
            notifyClients(channel);

            return api.ok(req, res, channel);
        })
        .catch(function(err) {
            return api.badRequest(req, res, err);
        });
}

function notifyClients(channel) {
    pubsubClient.publish('/' + channel.id, _.assign({}, channel));
}

function findOrCreateChannel(req, res) {
    channelHelper.find({ ownerId: req.session.user.id })
        .then(function(channel) {
            req.session.channel = channel.id;

            api.ok(req, res, channel);
        })
        .catch(function() {
            channelHelper.create({ ownerId: req.session.user.id })
                .then(function(channel) {
                    req.session.channel = channel.id;

                    api.ok(req, res, channel);
                });
        });
}

module.exports = router;
