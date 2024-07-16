const socket = io();

const cells = document.querySelectorAll('.cell');
const statusDiv = document.getElementById('status');
const createRoomBtn = document.getElementById('create-room');
const joinRoomBtn = document.getElementById('join-room');
const roomIdInput = document.getElementById('room-id');

let roomID = null;
let playerSymbol = null;
let isMyTurn = false;

createRoomBtn.addEventListener('click', () => {
  socket.emit('createRoom');
});

joinRoomBtn.addEventListener('click', () => {
  const roomID = roomIdInput.value.trim();
  if (roomID) {
    socket.emit('joinRoom', roomID);
  }
});

cells.forEach(cell => {
  cell.addEventListener('click', () => {
    if (isMyTurn && cell.textContent === '') {
      socket.emit('makeMove', { roomID, index: cell.dataset.index });
    }
  });
});

socket.on('roomCreated', id => {
  roomID = id;
  statusDiv.textContent = `Room created. ID: ${roomID}`;
});

socket.on('roomJoined', id => {
  roomID = id;
  playerSymbol = 'O';
  statusDiv.textContent = `Joined room ${roomID}. Waiting for opponent...`;
});

socket.on('startGame', () => {
  playerSymbol = 'X';
  isMyTurn = true;
  statusDiv.textContent = 'Game started. Your turn!';
});

socket.on('moveMade', ({ index, player }) => {
  cells[index].textContent = player;
  isMyTurn = player !== playerSymbol;
  statusDiv.textContent = isMyTurn ? 'Your turn!' : 'Opponent\'s turn';
});

socket.on('gameOver', message => {
  statusDiv.textContent = message;
});

socket.on('opponentDisconnected', () => {
  statusDiv.textContent = 'Opponent disconnected. You win!';
});
