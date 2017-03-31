var express = require('express');
var app = express();
var reviewRouter = express.Router();
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var Review = require('../models/review');

module.exports = function(app, express) {
    reviewRouter.use(function(req, res, next) {
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
                    req.user = decoded;
                    req.decoded = decoded;
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
    reviewRouter.route('/')
        .post(function(req, res) {
            if (!req.body.name || !req.body.review) {
                res.json({
                    success: false,
                    message: "Please enter a name and your review"
                })
            } else {
                var newReview = new Review({
                    name: req.body.name,
                    review: req.body.review,
                    _creator: req.user.email,
                    city: req.body.city
                });
                newReview.save(function(err) {
                    if (err) {
                        return res.json({
                            success: false,
                            message: "an error with your review occured"
                        })
                    } else {
                        res.json({
                            success: true,
                            message: "Successfully created review"
                        });
                    }
                })
            }
        })
        .get(function(req, res) {
            mongoose.model('Review').find({}, function(err, reviews) {
                if (err) {
                    return console.log(err);
                } else {
                    res.json(reviews)
                }
            })
        });
    reviewRouter.route('/myreviews')
        .get(function(req, res) {
            Review.find({ _creator: req.user.email }, function(err,reviews) {
                return res.json(reviews);
            })
        });
    return reviewRouter;
}
