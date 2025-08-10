require('dotenv').config();
const path = require('path');
const fs = require('fs');
const db = require('../config/db');
const { processWebhookPayload } = require('../services/webhookService');

const SAMPLES_DIR = path.join(__dirname, 'sample_payloads');

async function run() {
  try {
    const files = fs.readdirSync(SAMPLES_DIR).filter(f => f.endsWith('.json'));
    for (const f of files) {
      const full = path.join(SAMPLES_DIR, f);
      console.log('Processing', full);
      const raw = fs.readFileSync(full, 'utf8');
      let payload;
      try {
        payload = JSON.parse(raw);
      } catch (e) {
        console.error('Invalid JSON in', full, e);
        continue;
      }
      await processWebhookPayload(payload, { io: null });
    }
    console.log('All sample payloads processed.');
    process.exit(0);
  } catch (err) {
    console.error('Error processing samples', err);
    process.exit(1);
  }
}

run();
