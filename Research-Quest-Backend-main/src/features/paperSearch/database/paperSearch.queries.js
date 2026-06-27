const SearchHistory = require('../models/searchHistory.model');

exports.saveSearchHistory = async (userId, parameters, searchType, resultsCount, resultsData) => {
  try {
    const searchRecord = new SearchHistory({
      user: userId || null,
      searchType,
      parameters,
      resultsCount,
      results: resultsData || []
    });
    return await searchRecord.save();
  } catch (error) {
    console.error('Error saving search history:', error);
    // Non-blocking error; we don't want to fail the search if logging fails
    return null; 
  }
};

exports.getSearchHistory = async (userId, limit = 10) => {
  return await SearchHistory.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};