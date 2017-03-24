var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    review: {
        type: String,
        unique: true
    },
    _creator: {
        type: Schema.Types.String,
        ref: 'User'
    }
})

module.exports = mongoose.model('Review', reviewSchema);
