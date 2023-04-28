const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash');

var RecordSchema = new mongoose.Schema({
    amount: {
        type: Number,
        require: true,
        default: 0
    },
    property: {
        type: Schema.Types.ObjectId,
        ref: 'Property'
    },
    date: {
        type: Date,
        require: true
    },
    startingBalance: {
        type: Number,
        require: true,
        default: 0
    },
    endingBalance: {
        type: Number,
        require: true,
        default: 0
    },
    type: {
        type: String,
        require: true,
        enum: ['EXPENSE', 'INCOME'] 
    }
});

RecordSchema.methods.toJSON = function () {
    var record = this;
    var recordObject = record.toObject();

    return _.pick(recordObject, ['_id', 'amount', 'type', 'startingBalance', 
    'endingBalance', 'date', 'property']);
};

var Record = mongoose.model('Record', RecordSchema);

module.exports = { Record }
