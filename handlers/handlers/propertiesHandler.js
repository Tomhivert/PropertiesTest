const { Property } = require('../../database/models/property');
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

module.exports = {
    getProperty,
    createProperty
}