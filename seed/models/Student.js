const mongoose = require('mongoose');

const { Schema } = mongoose;

const StudentSchema = new Schema(
  {
    name: { type: String, required: true },
    slack_id: { type: String, required: true },
    github_id: { type: String },
    wakatime_key: { type: String },
    type: { type: String },
    _id: { type: Number, required: true },
  },
  {
    collection: 'student',
  },
);

module.exports = mongoose.model('student', StudentSchema);
