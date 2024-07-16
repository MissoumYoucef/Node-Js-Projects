const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const winston = require('winston');
const { v4: uuidv4 } = require('uuid');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/game.log' }),
    new winston.transports.Console()
  ]
});

app.use(express.static('public'));

let rooms = {};

// Handle WebSocket connections
io.on('connection', (socket) => {
  logger.info(`New connection: ${socket.id}`);

  socket.on('createRoom', () => {
    const roomID = uuidv4();
    rooms[roomID] = {
      players: [],
      board: Array(9).fill(null),
      currentPlayer: 'X'
    };
    socket.join(roomID);
    rooms[roomID].players.push(socket.id);
    socket.emit('roomCreated', roomID);
    logger.info(`Room created: ${roomID} by ${socket.id}`);
  });

  socket.on('joinRoom', (roomID) => {
    if (rooms[roomID] && rooms[roomID].players.length < 2) {
      socket.join(roomID);
      rooms[roomID].players.push(socket.id);
      socket.emit('roomJoined', roomID);
      io.to(roomID).emit('startGame');
      logger.info(`Player ${socket.id} joined room ${roomID}`);
    } else {
      socket.emit('roomFull');
      logger.info(`Player ${socket.id} attempted to join full or non-existent room ${roomID}`);
    }
  });

  socket.on('makeMove', ({ roomID, index }) => {
    const room = rooms[roomID];
    if (room && room.board[index] === null) {
      room.board[index] = room.currentPlayer;
      io.to(roomID).emit('moveMade', { index, player: room.currentPlayer });
      logger.info(`Player ${socket.id} made move ${room.currentPlayer} at ${index} in room ${roomID}`);

      // Check for win or draw
      if (checkWin(room.board, room.currentPlayer)) {
        io.to(roomID).emit('gameOver', `${room.currentPlayer} wins!`);
        logger.info(`Game over: ${room.currentPlayer} wins in room ${roomID}`);
        delete rooms[roomID];
      } else if (room.board.every(cell => cell !== null)) {
        io.to(roomID).emit('gameOver', 'Draw!');
        logger.info(`Game over: Draw in room ${roomID}`);
        delete rooms[roomID];
      } else {
        room.currentPlayer = room.currentPlayer === 'X' ? 'O' : 'X';
      }
    }
  });

  socket.on('disconnect', () => {
    logger.info(`Connection lost: ${socket.id}`);
    for (let roomID in rooms) {
      const room = rooms[roomID];
      if (room.players.includes(socket.id)) {
        io.to(roomID).emit('opponentDisconnected');
        logger.info(`Player ${socket.id} disconnected from room ${roomID}`);
        delete rooms[roomID];
      }
    }
  });
});

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

function checkWin(board, player) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return winPatterns.some(pattern => pattern.every(index => board[index] === player));
}
