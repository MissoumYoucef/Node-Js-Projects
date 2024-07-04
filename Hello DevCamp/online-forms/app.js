const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const logger = require('./config/logger');
const morgan = require('morgan');
const ws = require('ws');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Database config
const connectDB=require('./config/database');
connectDB()
// Passport config
require('./config/auth')(passport);

// Express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Logger
app.use(morgan('combined', { stream: logger.stream }));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// EJS
// app.set('view engine', 'ejs');
// app.use(express.static(path.join(__dirname, 'public')));

// // Routes
// app.use('/', require('./routes/index'));
// app.use('/users', require('./routes/users'));
// app.use('/forms', require('./routes/forms'));

// // WebSocket setup
// const server = app.listen(PORT, () => {
//   console.log(`Server started on port ${PORT}`);
// });
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
