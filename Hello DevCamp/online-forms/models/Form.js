const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FieldSchema = new Schema({
  label: {
    type: String,
    required: true
  }
});

const FormSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fields: {
    type: [FieldSchema],
    required: true
  }
});

const Form = mongoose.model('Form', FormSchema);
module.exports = Form;
