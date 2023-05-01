const express = require('express');
const path = require('path');

const propertiesHandler = require('../../handlers/handlers/propertiesHandler');
const propetriesController = require('../../controllers/propertiesController');

module.exports = function (app) {
    const router = express.Router();

    router.post('/', propetriesController.createProperty);
    router.post('/:propertyid/record', propetriesController.addRecord);
    router.get('/', propetriesController.getProperties);
    router.get('/:propertyid/record', propetriesController.getRecords);
    router.get('/:propertyid/balance', propetriesController.getPropertyBalance);
    router.get('/:propertyid/get-report/:month', propetriesController.getReport);

    app.use('/properties', router);
}