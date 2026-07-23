const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Read rewrites from vercel.json
const vercelConfigPath = path.join(__dirname, 'vercel.json');
let rewrites = [];

if (fs.existsSync(vercelConfigPath)) {
  try {
    const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
    if (config.rewrites) {
      rewrites = config.rewrites;
    }
  } catch (err) {
    console.error('Error reading vercel.json:', err);
  }
}

// Log incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// 1. Serve static assets directly (resolves physical files like /assets/style.css)
app.use(express.static(path.join(__dirname, 'public')));

// 2. Apply vercel rewrites for clean URLs (for paths that don't match physical files)
rewrites.forEach(route => {
  app.get(route.source, (req, res) => {
    const destPath = path.join(__dirname, 'public', route.destination);
    if (fs.existsSync(destPath)) {
      res.sendFile(destPath);
    } else {
      res.status(404).send(`Destination file not found: ${route.destination}`);
    }
  });
});

// 3. Fallback for undefined routes
app.use((req, res) => {
  res.status(404).send('Halaman tidak ditemukan (404)');
});

app.listen(PORT, () => {
  console.log('==================================================');
  console.log(`🚀 YUKgas.in Local Server is running!`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`⌨️  Press Ctrl+C to stop`);
  console.log('==================================================');
});
