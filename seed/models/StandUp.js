const mongoose = require('mongoose');

const { Schema } = mongoose;

const StandUpSchema = new Schema(
  {
    slack_id: { type: String, required: true },
    date: { type: Date },
    tasks_yesterday: { type: String },
    tasks_today: { type: String },
    blockers: { type: String },
    studentId: { type: Number, ref: 'student' },
  },
  {
    collection: 'standup',
  },
);

module.exports = mongoose.model('standup', StandUpSchema);
