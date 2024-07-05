const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const resolvers = {
  Query: {
    users: async () => await User.find(),
  },
  Mutation: {
    register: async (_, { username, password }) => {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new Error('User already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashedPassword });
      await user.save();
      return user;
    },
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('User not found');
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      return { token };
    },
    updateStatus: async (_, { userId, isOnline }) => {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      user.isOnline = isOnline;
      await user.save();
      return user;
    },
  },
};

module.exports = resolvers;
