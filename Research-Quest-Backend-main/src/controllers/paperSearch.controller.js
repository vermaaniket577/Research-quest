const paperSearchService = require('../features/paperSearch/services/paperSearch.service');
const paperSearchQueries = require('../features/paperSearch/database/paperSearch.queries');
const schemas = require('../features/paperSearch/schemas/paperSearch.schema');

exports.simpleSearch = async (req, res) => {
  try {
    const payload = req.method === 'GET' ? req.query : req.body;
    
    const errors = schemas.validateSimpleSearch(payload);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Fetch from external Python API
    const results = await paperSearchService.performSimpleSearch(payload.subject);

    // Get user ID if logged in, otherwise set to null for guests
    const userId = req.user ? req.user.id : null;
    const resultsCount = Array.isArray(results.papers) ? results.papers.length : 0;

    // Save search history and results for BOTH cases (Logged in & Guests)
    await paperSearchQueries.saveSearchHistory(userId, payload, 'simple', resultsCount, results.papers);

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deepSearch = async (req, res) => {
  try {
    const payload = req.method === 'GET' ? req.query : req.body;

    // Convert keywords from string to array of strings if necessary to satisfy schema validation
    if (typeof payload.keywords === 'string') {
      payload.keywords = payload.keywords.split(',').map(k => k.trim()).filter(Boolean);
    }

    const errors = schemas.validateDeepSearch(payload);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Fetch from external Python API
    const results = await paperSearchService.performDeepSearch(payload);

    // Get user ID if logged in, otherwise set to null for guests
    const userId = req.user ? req.user.id : null;
    const resultsCount = Array.isArray(results.papers) ? results.papers.length : 0;

    // Save search history and results for BOTH cases (Logged in & Guests)
    await paperSearchQueries.saveSearchHistory(userId, payload, 'deep', resultsCount, results.papers);

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};