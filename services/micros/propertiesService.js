const express = require('express');
const path = require('path');

const propertiesHandler = require('../../handlers/handlers/propertiesHandler');

module.exports = function (app) {
    const router = express.Router();
    router.get('/', propertiesHandler.getProperty);
    router.post('/', propertiesHandler.createProperty);
    app.use('/properties', router);
}