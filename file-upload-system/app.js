// app.js
const express = require('express');
const mongoose = require('mongoose');
const fileRoutes = require('./routes/fileRoutes');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); // For parsing form data
app.use('/api/files', fileRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});