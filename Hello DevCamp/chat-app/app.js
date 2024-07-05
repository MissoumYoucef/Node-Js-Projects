const express = require('express');
const http = require('http');
const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./resolvers');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const schema = makeExecutableSchema({ typeDefs, resolvers });
const apolloServer = new ApolloServer({ schema });

(async () => {
  await apolloServer.start();
  
  apolloServer.applyMiddleware({ app });

  app.use(cors());
  app.use(bodyParser.json());

  let onlineUsers = [];

  io.on('connection', (socket) => {
    socket.on('joinRoom', ({ username, room }) => {
      socket.join(room);
      onlineUsers.push({ id: socket.id, username, room });
      io.to(room).emit('message', `${username} has joined the room`);
    });

    socket.on('chatMessage', ({ room, message }) => {
      io.to(room).emit('message', message);
    });

    socket.on('disconnect', () => {
      const user = onlineUsers.find((user) => user.id === socket.id);
      if (user) {
        io.to(user.room).emit('message', `${user.username} has left the room`);
        onlineUsers = onlineUsers.filter((user) => user.id !== socket.id);
      }
    });
  });

  server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}${apolloServer.graphqlPath}`);
  });
})();
