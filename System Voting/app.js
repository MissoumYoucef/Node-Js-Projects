require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const voteRoutes = require('./routes/voteRoutes');

const app = express();
const PORT = process.env.PORT;

connectDB();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/votes', voteRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
