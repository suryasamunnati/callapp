const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
  callerId: { type: String, required: true },        // user phoneNumber or userId
  customerNumber: { type: String, required: true },  // number called
  status: { type: String, default: 'initiated' },    // initiated, ringing, connected, ended
  recordingUrl: { type: String, default: null },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Call', callSchema);
