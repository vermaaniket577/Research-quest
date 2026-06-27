  const express = require('express');
  const router = express.Router();
  const authMiddleware = require('../middlewares/auth.middleware');

  // GET - Protected Dashboard Info
  router.get('/', authMiddleware, (req, res) => {
    res.json({
      user: {
        id: req.user.id,
        fullName: req.user.fullName || 'ResearchQuest User',
        email: req.user.email,
      },
    });
  });

  module.exports = router;