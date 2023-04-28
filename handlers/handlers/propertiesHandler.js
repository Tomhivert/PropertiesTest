const { Property } = require('../../database/models/property');
const { Record } = require('../../database/models/record');
const _ = require('lodash');

const getProperty = async (req,res) => {
    const props = await Property.find(() => {})

    res.send(props);
}

const createProperty = async (req,res) => {
    const body = _.pick(req.body, ['name']);
    var prop = new Property(body);
    const savedProp = await prop.save();

    res.status(200).send(savedProp.toString());
}

const addRecord = async (req, res) => {
    const propertyId = req.params.propertyid;
    const amount = req.body.amount;
    const amountAsNumber = Number.parseInt(amount);

    const property = await Property.findById(propertyId);

    if (property) {
        property.balance += amountAsNumber;
        await property.save();
        record = new Record({property: propertyId, amount: amount})
        await record.save();

        return res.status(200).send(record);
    }

    res.status(400).send('No property found by that ID');
}

module.exports = {
    getProperty,
    createProperty,
    addRecord
}