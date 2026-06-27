const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Optional because simple search might be public
  },
  searchType: {
    type: String,
    enum: ['simple', 'deep'],
    required: true,
  },
  parameters: {
    type: Object,
    required: true,
  },
  resultsCount: {
    type: Number,
    default: 0,
  },
  results: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SearchHistory', searchHistorySchema);