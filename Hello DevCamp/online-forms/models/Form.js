const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fields: [
    {
      label: String,
      type: String,
      required: Boolean
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

const Form = mongoose.model('Form', FormSchema);
module.exports = Form;
