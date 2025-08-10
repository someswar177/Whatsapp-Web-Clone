const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  messageId: { type: String, index: true },      // webhook 'id'
  metaMsgId: { type: String, index: true },
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', index: true },
  from: String,   // sender number (wa_id or business)
  to: String,
  wa_id: String,  // contact's wa_id (contact)
  contactName: String,
  body: String,
  type: { type: String, default: 'text' },
  status: { type: String, enum: ['sent','delivered','read'], default: 'sent' },
  timestamps: {
    sentAt: Date,
    deliveredAt: Date,
    readAt: Date
  }
}, { timestamps: true, collection: 'processed_messages' });

module.exports = mongoose.model('Message', MessageSchema);
