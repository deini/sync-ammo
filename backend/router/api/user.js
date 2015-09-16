var api    = require('express-api-helper');
var router = require('express').Router();

router.get('', getUser);

function getUser(req, res) {
    api.ok(req, res, req.session.user);
}

module.exports = router;
