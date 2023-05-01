const express = require('express');
const path = require('path');

const propertiesHandler = require('../../handlers/handlers/propertiesHandler');

module.exports = function (app) {
    const router = express.Router();

    router.get('/', propertiesHandler.getProperty);
    router.post('/', propertiesHandler.createProperty);
    router.post('/:propertyid/record', propertiesHandler.addRecord);
    router.get('/:propertyid/record', propertiesHandler.getRecords);
    router.get('/:propertyid/balance', propertiesHandler.getPropertyBalance);
    router.get('/:propertyid/get-report/:month', propertiesHandler.getReport);

    app.use('/properties', router);
}