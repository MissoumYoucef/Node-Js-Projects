const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ username, password: hashedPassword, role });
  await user.save();
  res.sendStatus(201);
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) return res.sendStatus(401);

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);
  res.json({ token });
};
