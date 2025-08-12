const express = require('express');
const router = express.Router();
const {
  getAllConversations,
  getConversationMessages
} = require('../controllers/conversationController');

router.get('/', getAllConversations);
router.get('/:wa_id/messages', getConversationMessages);

module.exports = router;
