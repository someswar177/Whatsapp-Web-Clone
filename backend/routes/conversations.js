const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// GET /api/conversations  => list conversations with lastMessage populated
router.get('/', async (req, res) => {
  try {
    const convs = await Conversation.find()
      .sort({ updatedAt: -1 })
      .populate({ path: 'lastMessage', model: 'Message' })
      .lean();
    res.json({ ok: true, conversations: convs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// GET /api/conversations/:wa_id/messages  => messages for that contact sorted asc
router.get('/:wa_id/messages', async (req, res) => {
  try {
    const wa_id = req.params.wa_id;
    // find conversation
    const conv = await Conversation.findOne({ wa_id });
    if (!conv) return res.status(404).json({ ok: false, message: 'Conversation not found' });

    const messages = await Message.find({ conversationId: conv._id })
      .sort({ 'timestamps.sentAt': 1, createdAt: 1 })
      .lean();

    res.json({ ok: true, conversation: conv, messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
