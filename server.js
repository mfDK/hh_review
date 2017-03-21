var express = require('express');
var app = express();
var apiRouter = express.Router();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');
var User = require('./app/models/user');
var jwt = require('jsonwebtoken');

mongoose.connect(config.database);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Acess-Control-Allow-Methods', 'GET', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization' );
    next();
});

app.get('/', function(req, res) {
    res.json({
        message: 'Welcome to the API'
    });
})

app.get('/', function(req, res) {
    res.json({
        message: 'Welcome to the API'
    });
})

// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3R0d29AZW1haWwuY29tIiwiaWF0IjoxNDkwMDU4MjQ4LCJleHAiOjE0OTAwNjgzMzh9.fwj0X3QpdJFF-4Osfhq_XK97LT6ZQ1LIougBRX1xb3c"
// api middleware
apiRouter.use(function(req, res, next) {
    var token = req.body.access_token || req.body.token || req.headers['x-access-control'];
    console.log(token);
    if (token) {
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                return res.status(403).send({
                    success: false,
                    message: 'Failed to authenticate token'
                });
            } else {
                req.decoded = decoded
                next();
            }
        });
    } else {
        // if no token
        return res.status(403).send({
            success: false,
            message: 'No Token Provided'
        })
    }
});

apiRouter.route('/users')
    .get(function(req, res) {
        mongoose.model('User').find({}, function(err, users) {
            if (err) {
                return console.log(err);
            } else {
                res.json(users);
            }
        });
    })
    .post(function(req,res) {
        if (!req.body.email || !req.body.password) {
            res.json({
                success: false,
                message: 'please enter email and password'
            })
        } else {
            var newUser = new User({
                email: req.body.email,
                password: req.body.password
            });
            newUser.save(function(err) {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'that email address already exists'
                    })
                }
                res.json({
                    success: true,
                    message: 'Succesfully created new user'
                });
            });
        }
    });

apiRouter.route('/users/:user_id')
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err) res.send(err);

            res.json(user);
        });
    })
    .put(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err) res.send(err);

            if (req.body.email) user.email = req.body.email;
            if (req.body.password) user.password = req.body.password;

            user.save(function(err) {
                if (err) res.send(err);

                res.json({
                    message: 'User updates'
                });
            });
        })
    })
    .delete(function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err) return res.send(err);

            res.json({
                message: 'Successfully deleted'
            })
        });
    });

// Authentication
apiRouter.post('/authenticate', function(req, res) {
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.json({
                success: false,
                message: 'Authentication failed. User not found'
            });
        } else if (user) {
            var validPassword = user.comparePassword(req.body.password);
            if (!validPassword) {
                res.json({
                    success: false,
                    message: 'Authentication failed. Wrong password'
                });
            } else {
                var token = jwt.sign({
                    email: user.email
                }, config.secret, {
                    expiresIn: 10090
                });

                res.json({
                    success: true,
                    message: 'Enjoy Your Token',
                    token: token
                });
            }
        }
    });
});

app.use('/api', apiRouter);
app.listen(config.port);
console.log('Server has Started on ' + config.port);
