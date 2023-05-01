const propertiesHandler = require('./../handlers/handlers/propertiesHandler');
const _ = require('lodash');

const getReport = async (req, res) => {
    try {
        const month = req.params.month;
        const propertyId = req.params.propertyid;
        const result = await propertiesHandler.getReport(propertyId, month)
        if (result) {
            res.status(200).send(result);
        }
    } catch (error) {
        console.log(`an internal error has occured on getReport API, ${error}`);
        res.status(500).send(error);
    }
}

const getRecords = async (req,res) => {
    try {
        const propertyId = req.params.propertyid;
        const queryParams = _.pick(req.query, ['amount', 'type', 'dateFrom', 'dateTo', 'order']);
        const dateFrom = queryParams.dateFrom;
        const dateTo = queryParams.dateTo;
        const order = queryParams.order;
        const result = await propertiesHandler.getRecords(propertyId, queryParams, dateFrom, dateTo, order)
        if (result) {
            res.status(200).send(result);
        }
    } catch (error) {
        console.log(`an internal error has occured on getRecords API, ${error}`);
        res.status(500).send(error);
    }
}

const addRecord = async (req, res) => {
    try {
        const propertyId = req.params.propertyid;
        const body = _.pick(req.body, ['amount', 'type']);
        const amount = body.amount;
        const recordType = body.type;
        const result = await propertiesHandler.addRecord(propertyId, amount, recordType);
        if (result) {
            res.status(200).send(result);
        }
    } catch (error) {
        console.log(`an internal error has occured on addRecord API, ${error}`);
        res.status(500).send(error);
    }
}
const createProperty = async (req,res) => {
    try {
        const body = _.pick(req.body, ['name']);
        const result = await propertiesHandler.createProperty(body.name);
        if (result) {
            res.status(200).send(result);
        }
    } catch (error) {
        console.log(`an internal error has occured on createProperty API, ${error}`);
        res.status(500).send(error);
    }
}

const getPropertyBalance = async (req,res) => {
    try {
        const propertyId = req.params.propertyid;
        const result = await propertiesHandler.getPropertyBalance(propertyId);
        if (result) {
            res.status(200).send(result);
        }
    } catch (error) {
        console.log(`an internal error has occured on getPropertyBalance API, ${error}`);
        res.status(500).send(error);
    }
}

const getProperties = async (req,res) => {
    try {
        const result = await propertiesHandler.getProperties();
        if (result) {
            res.status(200).send(result);
        }
    } catch (error) {
        console.log(`an internal error has occured on getProperty API, ${error}`);
        res.status(500).send(error);
    }
}


module.exports = {
    getProperties,
    getPropertyBalance,
    createProperty,
    addRecord,
    getRecords,
    getReport
}
