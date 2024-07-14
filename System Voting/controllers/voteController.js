const Vote = require('../models/Vote');
const Candidate = require('../models/Candidate');

exports.vote = async (req, res) => {
  const { candidateId } = req.body;

  const existingVote = await Vote.findOne({ userId: req.user.id });
  if (existingVote) return res.sendStatus(403);

  const vote = new Vote({ userId: req.user.id, candidateId });
  await vote.save();

  await Candidate.findByIdAndUpdate(candidateId, { $inc: { votes: 1 } });
  res.sendStatus(201);
};
