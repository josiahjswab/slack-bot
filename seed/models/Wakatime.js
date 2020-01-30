const mongoose = require('mongoose');

const { Schema } = mongoose;

const WakaTimeSchema = new Schema(
  {
    slack_id: { type: String, required: true, ref: 'student' },
    duration: { type: Number },
    date: { type: Date },
  },
  {
    collection: 'wakatime',
  },
);

module.exports = mongoose.model('wakatime', WakaTimeSchema);
