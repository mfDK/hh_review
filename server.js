var express = require('express');
var app = express();
var apiRouter = express.Router();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');
var User = require('./app/models/user');

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

// api middleware
apiRouter.use(function(req, res, next) {
    console.log('somebody just came to our app');
    next();
})

apiRouter.get('/', function(req, res) {
    res.json({
        message: "This is working"
    });
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

app.use('/api', apiRouter);
app.listen(config.port);
console.log('Server has Started on ' + config.port);
