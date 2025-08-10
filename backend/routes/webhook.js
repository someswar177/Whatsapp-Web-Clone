const express = require('express');
const router = express.Router();
const { webhookHandler } = require('../controllers/webhookController');

// POST /api/webhook
router.post('/', webhookHandler);

module.exports = router;
