const mongoose = require('mongoose');
const _ = require('lodash');

var PropertySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 25
    },
    balance: {
        type: Number,
        require: false,
        minlength: 6,
        default: 0
    },
});

PropertySchema.methods.toJSON = function () {
    var property = this;
    var propertyObject = property.toObject();

    return _.pick(propertyObject, ['_id', 'name', 'balance']);
};

var Property = mongoose.model('Property', PropertySchema);

module.exports = { Property }
