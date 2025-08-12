const Message = require('../models/Message');
const { findOrCreateConversation } = require('../services/webhookService');

const sendMessage = async (req, res) => {
  try {
    const io = req.app.get('io');
    const { wa_id, body } = req.body;

    if (!wa_id || !body) {
      return res.status(400).json({ ok: false, message: 'wa_id and body required' });
    }

    const contactName = null;
    const conv = await findOrCreateConversation(wa_id, contactName);

    // Generate local message ID
    const messageId = `local-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const msgDoc = {
      messageId,
      metaMsgId: null,
      conversationId: conv._id,
      from: process.env.BUSINESS_NUMBER || 'BUSINESS',
      to: wa_id,
      wa_id,
      contactName: conv.contactName,
      body,
      type: 'text',
      status: 'sent',
      timestamps: { sentAt: new Date() }
    };

    const saved = await Message.create(msgDoc);

    // Update last message in conversation
    conv.lastMessage = saved._id;
    await conv.save();

    // Emit socket events
    if (io) {
      io.to(`user_${wa_id}`).emit('message:new', saved);
      io.to(`conv_${conv._id.toString()}`).emit('message:new', saved);
      io.emit('conversation:update', {
        conversationId: conv._id.toString(),
        lastMessage: saved
      });
    }

    res.json({ ok: true, message: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

module.exports = {
  sendMessage
};
