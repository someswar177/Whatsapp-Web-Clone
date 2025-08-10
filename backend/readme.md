# WhatsApp Web Clone - Backend (scaffold)

1. Copy files into backend/ folder.

2. Create .env from .env.example and set:
   - MONGO_URI
   - CLIENT_URL
   - BUSINESS_NUMBER

3. Install:
   npm install

4. Start server:
   npm start
   or for dev:
   npm run dev

5. Process sample payload JSON files:
   - Put JSONs in scripts/sample_payloads/ (one JSON payload per file)
   - Run:
     npm run process-samples

6. REST endpoints:
   - POST /api/webhook   -> accepts webhook JSON payloads (same format as sample files)
   - GET  /api/conversations  -> list conversations (populates lastMessage)
   - GET  /api/conversations/:wa_id/messages -> messages for contact
   - POST /api/messages -> send demo message
       body: { wa_id: "<contact wa id>", body: "<text>" }

7. Socket.IO:
   - Connect to backend socket (same host as server)
   - After connect emit `join` events:
       socket.emit('join', { type: 'user', id: '<contact_wa_id>' });
       socket.emit('join', { type: 'conv', id: '<conversationId>' });
   - Server emits:
       - 'message:new' (full message doc)
       - 'message:updated' (message doc after status update)
       - 'conversation:update' (summary object)
