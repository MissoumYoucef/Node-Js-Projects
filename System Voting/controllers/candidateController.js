const Candidate = require('../models/Candidate');

exports.addCandidate = async (req, res) => {
  const { name } = req.body;
  const candidate = new Candidate({ name });
  await candidate.save();
  res.sendStatus(201);
};
