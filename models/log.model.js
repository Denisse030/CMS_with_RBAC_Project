const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: Object },
});

const Log = mongoose.model('log', LogSchema);

module.exports = Log;

