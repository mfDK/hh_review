var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    review: {
        type: String,
        unique: true,
        required: true
    },
    _creator: {
        type: Schema.Types.String,
        ref: 'User'
    },
    city: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Review', reviewSchema);
