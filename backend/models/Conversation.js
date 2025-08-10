const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  participants: [{ type: String }], // e.g. [businessNumber, contactWaId]
  wa_id: { type: String, index: true }, // primary contact wa_id for quick lookups
  contactName: String,
  lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', ConversationSchema);
