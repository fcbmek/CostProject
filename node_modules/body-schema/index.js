'use strict';

var tv4 = require('tv4');

module.exports = function(schema) {
    return function(req, res, next) {
        if (tv4.validate(req.body, schema)) {
            next();
        } else {
            next(tv4.error);
        }
    };
};
