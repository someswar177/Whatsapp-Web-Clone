# WhatsApp Web Clone

## Setup Instructions

### Backend
1. Navigate to the **backend** folder.
2. Create a `.env` file.
3. Add the following environment variables:
   ```env
   PORT=your_port_number
   MONGODBURL=your_mongodb_connection_url
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the server:
   ```bash
   npm start
   ```

### Frontend
1. Navigate to the **frontend** folder.
2. Create a `.env` file.
3. Add the following environment variable:
   ```env
   VITE_API_URL=your_backend_api_url
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

---
