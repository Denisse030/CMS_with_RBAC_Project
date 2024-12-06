const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  createdAt: { type: Date, default: Date.now },
});

const Content = mongoose.model('content', ContentSchema);
module.exports = Content;
