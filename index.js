const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 2010;

// Middleware
app.use(cors());
app.use(express.json());
// Folder 'public' adalah tempat kamu menyimpan file index.html yang tadi
app.use(express.static('public')); 

// ==========================================
// 2. TEMP MAIL (Versi Cmail.js / Temp-mail.io)
// ==========================================
const CMAIL_HEADERS = {
    'Content-Type': 'application/json',
    'Application-Name': 'web',
    'Application-Version': '4.0.0',
    'X-CORS-Header': 'iaWg3pchvFx48fY', // Header Wajib dari cmail.js
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

app.get('/api/tempmail/create', async (req, res) => {
    try {
        const url = 'https://api.internal.temp-mail.io/api/v3/email/new';
        const payload = { min_name_length: 10, max_name_length: 10 };
        
        const response = await axios.post(url, payload, { headers: CMAIL_HEADERS });
        
        // Response asli dari API ini: { email: "...", token: "..." }
        res.json(response.data);
    } catch (e) {
        console.error("Cmail Create Error:", e.message);
        res.status(500).json({ error: "Gagal membuat email (API Error)." });
    }
});

app.get('/api/tempmail/inbox/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const url = `https://api.internal.temp-mail.io/api/v3/email/${email}/messages`;
        
        const response = await axios.get(url, { headers: CMAIL_HEADERS });
        res.json(response.data); // Mengirim array pesan apa adanya
    } catch (e) {
        // Jika error, biasanya inbox kosong atau belum ada
        res.json([]);
    }
});

// Route Default untuk membuka Web
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Jalankan Server
app.listen(PORT, () => {
    console.log(`Server Cmail berjalan di http://localhost:${PORT}`);
});
