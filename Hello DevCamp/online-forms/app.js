const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const logger = require('./config/logger');
const morgan = require('morgan');
const ws = require('ws');
const path = require('path');
require('dotenv').config(); 
const app = express();
const PORT = process.env.PORT || 3000;

// Database config
require('./config/database')(mongoose);

// Passport config
require('./config/auth')(passport);

// Logger
app.use(morgan('tiny', { stream: logger.stream }));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// EJS
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Passport middleware
app.use(passport.initialize());

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/forms', require('./routes/forms'));

// WebSocket setup
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
// const wss = new ws.Server({ server });
// wss.on('connection', (socket) => {
//   console.log('WebSocket connection established');
//   socket.on('message', (message) => {
//     console.log('Received: %s', message);
//     socket.send(`Echo: ${message}`);
//   });
//   socket.on('close', () => {
//     console.log('WebSocket connection closed');
//   });
// });

module.exports = app;
