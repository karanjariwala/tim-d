'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _quickstart = require('./quickstart');

var _quickstart2 = _interopRequireDefault(_quickstart);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use(_express2.default.static(_path2.default.join(__dirname, '../public')));
var token = null;

app.get('/code', function (req, res) {
    console.log(req.query.code);
    (0, _quickstart.storeToken)(req.query.code).then(function () {
        return res.redirect('/abc');
    });
    // authorize((events) => {success(res)(events)}, (authUrl) => getToken(res)(authUrl));
    // res.send(res);
});

app.get('/abc', function (req, res) {
    console.log('i am here');
    (0, _quickstart2.default)(function (events) {
        success(res)(events);
    }, function (authUrl) {
        return getToken(res)(authUrl);
    });
    // res.send(res);
});

var success = function success(res) {
    return function (events) {
        //  console.log(events);
        var cache = [];
        res.send(JSON.stringify(events
        //     function(key, value) {
        //     if (typeof value === 'object' && value !== null) {
        //         if (cache.indexOf(value) !== -1) {
        //             // Circular reference found, discard key
        //             console.log(value);
        //             return;
        //         }
        //         // Store value in our collection
        //         cache.push(value);
        //     }
        //     return value;
        // }
        ));
        cache = null;
    };
};

var getToken = function getToken(res) {
    return function (authUrl) {
        //  console.log(events);
        console.log('i am here too');
        res.redirect(authUrl);
    };
};

app.listen(8089);