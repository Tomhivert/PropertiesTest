const { Property } = require('../../database/models/property');
const { Record } = require('../../database/models/record');
const _ = require('lodash');

const getProperty = async (req,res) => {
    const props = await Property.find(() => {})

    res.status(200).send(props);
}

const getPropertyBalance = async (req,res) => {
    const propertyId = req.params.propertyid;
    const property = await Property.findById(propertyId);
    res.status(200).send({ balance: property.balance });
}

const createProperty = async (req,res) => {
    const body = _.pick(req.body, ['name']);
    var prop = new Property(body);
    const savedProp = await prop.save();

    res.status(200).send(savedProp.toString());
}

const addRecord = async (req, res) => {
    const propertyId = req.params.propertyid;
    const body = _.pick(req.body, ['amount', 'type']);
    const amount = body.amount;
    const recordType = body.type;

    const amountAsNumber = Number.parseInt(amount);

    const property = await Property.findById(propertyId);

    if (property) {
        const startingBalance = property.balance;
        let endingBalance;

        if (recordType === 'EXPENSE') {
            endingBalance = startingBalance - amountAsNumber;
        } else if (recordType === 'INCOME') {
            endingBalance = startingBalance + amountAsNumber;
        }
        
        property.balance = endingBalance;
        await property.save();

        record = new Record({
            property: propertyId,
            amount: amount,
            startingBalance,
            endingBalance,
            date: Date.now(),
            type: body.type
        })
        await record.save();

        return res.status(200).send(record);
    }

    res.status(400).send('No property found by that ID');
}

const getRecords = async (req, res) => {
    const propertyId = req.params.propertyid;
    const queryParams = _.pick(req.query, ['amount', 'type', 'dateFrom', 'dateTo', 'order']);
    const searchObject = _.pick(queryParams, ['amount', 'type', 'property'])
    const dateFrom = queryParams.dateFrom;
    const dateTo = queryParams.dateTo;
    const order = queryParams.order;
    const dateObject = {};
    if (dateFrom) {
        dateObject.$gte = queryParams.dateFrom;
    }
    if (dateTo) {
        dateObject.$lt = queryParams.dateTo;
    }

    if (dateFrom || dateTo) {
        searchObject.date = dateObject;
    }
    searchObject.property = propertyId;
    try {
        const records = await Record.find(searchObject).sort({date: order});
        return res.status(200).send(records);
    } catch (error) {
        console.log(error)
        return res.status(500).send(error);
    }
}

const getReport = async (req, res) => {
    const month = req.params.month;
    const propertyId = req.params.propertyid;
    const currentDate = new Date(Date.now());
    const year = currentDate.getFullYear();
    const day = 1;
    
    const startingDate = new Date(year, month-1, day);
    const endingDate = new Date(year, month, day);

    const dateSearchObject = {
        $gte: startingDate,
        $lte: endingDate
    }

    const relevantRecords = await Record.find({property: propertyId, date: dateSearchObject}).sort({date: 1});
    if (!relevantRecords || relevantRecords.length === 0) {
        return res.status(200).send("No results found");
    }
    let resultString = "";
    let balance = 0;
    for (let i=0; i<relevantRecords.length; i++) {
        const record = relevantRecords[i];

        if (i==0) {
            balance = record.startingBalance;
            resultString = `Starting balance: ${balance}\n`;
        }

        resultString = resultString.concat(`before: ${balance}`);
        if (record.type === 'INCOME') {
            resultString = resultString.concat(` Adding: ${record.amount}`);
            balance += record.amount;
        } else {
            resultString = resultString.concat(` Substracting: ${record.amount}`);
            balance -= record.amount;
        }
        resultString = resultString.concat(` after: ${balance}\n`)
    }

    resultString = resultString.concat(`Ending balance: ${balance}\n`);
    return res.status(200).send(resultString);
}

module.exports = {
    getProperty,
    getPropertyBalance,
    createProperty,
    addRecord,
    getRecords,
    getReport
}