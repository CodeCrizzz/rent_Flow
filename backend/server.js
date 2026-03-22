const express = require('express');
const cors = require('cors');
require('./config/db'); 

const app = express();

app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');     // ADDED THIS
const tenantRoutes = require('./routes/tenantRoutes');   // ADDED THIS

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);                      // ADDED THIS
app.use('/api/tenant', tenantRoutes);                    // ADDED THIS

app.get('/', (req, res) => {
    res.send('Welcome to the RentFlow API');
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'RentFlow API is running!' });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});