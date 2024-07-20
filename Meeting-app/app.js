// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const { v4: uuidV4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

mongoose.connect('mongodb://0.0.0.0:27017/meeting_app', 
   { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));


app.use(express.json());
app.use('/auth', authRoutes);

app.get('/meeting/:meetingId', (req, res) => {
  res.sendFile(__dirname + '/public/meeting.html');
});

app.get('/create-meeting', (req, res) => {
    // const meetingId = uuidV4();
    // res.redirect(`/meeting/${meetingId}`);
    res.sendFile(__dirname + '/public/index.html');
  });
  

io.on('connection', (socket) => {
  socket.on('join-meeting', (meetingId, userId) => {
    socket.join(meetingId);
    socket.to(meetingId).broadcast.emit('user-connected', userId);

    socket.on('message', (message) => {
      io.to(meetingId).emit('message', message);
    });

    socket.on('disconnect', () => {
      socket.to(meetingId).broadcast.emit('user-disconnected', userId);
    });
  });
});


server.listen(3000, () => console.log('Server running on port 3000'));
