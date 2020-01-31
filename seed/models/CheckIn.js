const mongoose = require('mongoose');

const { Schema } = mongoose;

const CheckInSchema = new Schema(
  {
    slack_id: { type: String, required: true },
    auto_checkout: { type: Boolean },
    checkin_time: { type: Date },
    checkout_time: { type: Date },
    hours: { type: Number },
    notAtSchool: { type: Boolean },
  },
  {
    collection: 'checkin',
  },
);

module.exports = mongoose.model('checkin', CheckInSchema);
