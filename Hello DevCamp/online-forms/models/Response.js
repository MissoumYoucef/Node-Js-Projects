const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
  form: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true
  },
  answers: [
    {
      field: String,
      answer: String
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

const Response = mongoose.model('Response', ResponseSchema);
module.exports = Response;
