const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash');

var RecordSchema = new mongoose.Schema({
    amount: {
        type: Number,
        require: false,
        default: 0
    },
    property: {
        type: Schema.Types.ObjectId,
        ref: 'Property'
    }
});

RecordSchema.methods.toJSON = function () {
    var record = this;
    var recordObject = record.toObject();

    return _.pick(recordObject, ['_id', 'amount', 'property']);
};

var Record = mongoose.model('Record', RecordSchema);

module.exports = { Record }
