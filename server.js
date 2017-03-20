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
api.Router.use(function(req, res, next) {
    console.log('somebody just came to our app');
    next();
})

apiRouter.get('/', function(req, res) {
    res.json({
        message: "This is working"
    });
});

app.use('/api', apiRouter);
app.listen(config.port);
console.log('Server has Started on ' + config.port);
