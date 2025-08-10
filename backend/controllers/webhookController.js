const { processWebhookPayload } = require('../services/webhookService');

async function webhookHandler(req, res) {
  const payload = req.body;
  const io = req.app.get('io');
  try {
    await processWebhookPayload(payload, { io });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}

module.exports = { webhookHandler };
