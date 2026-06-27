const express = require('express');
const router = express.Router();
const paperSearchController = require('../controllers/paperSearch.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Public endpoints
router.get('/simple-search', paperSearchController.simpleSearch);
router.post('/simple-search', paperSearchController.simpleSearch);

// Protected endpoints (Requires authentication)
router.get('/deep-search', authMiddleware, paperSearchController.deepSearch);
router.post('/deep-search', authMiddleware, paperSearchController.deepSearch);

module.exports = router;