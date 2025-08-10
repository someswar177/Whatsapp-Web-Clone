const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const mongoose = require('mongoose');

const BUSINESS_NUMBER = process.env.BUSINESS_NUMBER || '918329446654';

function parseTimestamp(tsString){
  const n = Number(tsString);
  if (!Number.isFinite(n)) return null;
  // webhook timestamps look like unix seconds; convert to ms
  return new Date(n * 1000);
}

async function findOrCreateConversation(wa_id, contactName, businessNumber = BUSINESS_NUMBER){
  // try to find conversation which has this wa_id and businessNumber
  let conv = await Conversation.findOne({ wa_id: wa_id });
  if (!conv) {
    conv = await Conversation.create({
      participants: [businessNumber, wa_id],
      wa_id,
      contactName
    });
  } else {
    // update contactName if missing or changed
    if (contactName && conv.contactName !== contactName) {
      conv.contactName = contactName;
      await conv.save();
    }
  }
  return conv;
}

async function processWebhookPayload(payload, options = {}) {
  // options: { io } optional
  const io = options.io;
  if (!payload || !payload.metaData) return;

  const entry = payload.metaData.entry?.[0];
  const change = entry?.changes?.[0];
  const value = change?.value;
  if (!value) return;

  // --- Handle incoming/ outgoing messages ---
  if (Array.isArray(value.messages)) {
    for (const m of value.messages) {
      try {
        const contact = value.contacts?.[0];
        const contactName = contact?.profile?.name || null;
        const wa_id = contact?.wa_id || m.from; // fallback to m.from
        const businessNumber = value.metadata?.display_phone_number || process.env.BUSINESS_NUMBER;

        // skip duplicate message by exact messageId or meta_msg_id
        const existing = await Message.findOne({
          $or: [{ messageId: m.id }, { metaMsgId: m.id }]
        });

        if (existing) continue;

        const conv = await findOrCreateConversation(wa_id, contactName, businessNumber);

        const sentAt = parseTimestamp(m.timestamp) || new Date();

        const doc = {
          messageId: m.id,
          metaMsgId: m.meta_msg_id || null,
          conversationId: conv._id,
          from: m.from,
          to: m.to || businessNumber,
          wa_id,
          contactName,
          body: m.text?.body || (m?.caption || ''),
          type: m.type || 'text',
          status: 'sent',
          timestamps: { sentAt }
        };

        const saved = await Message.create(doc);

        // update conversation last message
        conv.lastMessage = saved._id;
        await conv.save();

        // emit via socket.io if available
        if (io) {
          io.to(`user_${wa_id}`).emit('message:new', saved);
          io.to(`conv_${conv._id.toString()}`).emit('message:new', saved);
          io.emit('conversation:update', { conversationId: conv._id.toString(), lastMessage: saved });
        }
      } catch (err) {
        console.error('Error processing message:', err);
      }
    }
  }

  // --- Handle status updates ---
  if (Array.isArray(value.statuses)) {
    for (const s of value.statuses) {
      try {
        // find message by id or meta_msg_id
        const msg = await Message.findOne({
          $or: [{ messageId: s.id }, { metaMsgId: s.meta_msg_id }]
        });
        if (!msg) continue;

        const newStatus = s.status; // 'sent'|'delivered'|'read'
        msg.status = newStatus;

        const ts = parseTimestamp(s.timestamp) || new Date();
        if (newStatus === 'delivered') msg.timestamps.deliveredAt = ts;
        if (newStatus === 'read') msg.timestamps.readAt = ts;
        if (newStatus === 'sent') msg.timestamps.sentAt = ts;

        await msg.save();

        // emit status change
        if (io) {
          // send to conversation room & user room
          io.to(`conv_${msg.conversationId?.toString()}`).emit('message:updated', msg);
          io.to(`user_${msg.wa_id}`).emit('message:updated', msg);
          io.emit('conversation:update', { conversationId: msg.conversationId?.toString(), lastMessage: msg });
        }
      } catch (err) {
        console.error('Error processing status:', err);
      }
    }
  }
}

module.exports = { processWebhookPayload, findOrCreateConversation };
