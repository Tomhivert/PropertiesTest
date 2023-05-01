const { Property } = require('../../database/models/property');
const { Record } = require('../../database/models/record');
const _ = require('lodash');

const getProperties = async () => {
    const props = await Property.find(() => {})

    return props;
}

const getPropertyBalance = async (propertyId) => {
    const property = await Property.findById(propertyId);
    return { balance: property.balance };
}

const createProperty = async (name) => {
    var prop = new Property({name: name});
    const savedProp = await prop.save();

    return savedProp.toString();
}

const addRecord = async (propertyId, amount, recordType) => {
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

        const record = new Record({
            property: propertyId,
            amount: amount,
            startingBalance,
            endingBalance,
            date: Date.now(),
            type: recordType
        })
        await record.save();

        return record;
    }

    return null;
}

const getRecords = async (propertyId, queryParams, dateFrom, dateTo, order) => {
    const dateObject = {};
    const searchObject = _.pick(queryParams, ['amount', 'type', 'property'])
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
    const records = await Record.find(searchObject).sort({date: order});
    return records;
}

const getReport = async (propertyId, month) => {
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
        return "No results found";
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
    return resultString;
}

module.exports = {
    getProperties,
    getPropertyBalance,
    createProperty,
    addRecord,
    getRecords,
    getReport
}