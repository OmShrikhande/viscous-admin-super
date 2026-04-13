const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes/index');
const errorHandler = require('./middleware/errorHandler');
const env = require('./config/env');
const ApiError = require('./utils/ApiError');

const app = express();

// Set security HTTP headers
app.use(helmet());

// Logging
if (env.env !== 'test') {
  app.use(morgan('dev'));
}

// Parse json request body
app.use(express.json());

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Enable cors
app.use(cors());

// v1 api routes
app.use('/api/v1', routes);

// Base route
app.get('/', (req, res) => {
  res.send('Viscous Super Admin API is running.');
});

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(404, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorHandler);

module.exports = app;
