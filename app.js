const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.listen(4000, () => console.log('🚀 Server running on http://localhost:4000'));

