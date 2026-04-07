const express = require('express');
const cors = require('cors');
require('./config/db'); 

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');     
const tenantRoutes = require('./routes/tenantRoutes');   
const billingRoutes = require('./routes/billingRoutes'); 
const requestRoutes = require('./routes/requestRoutes'); 

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/bills', billingRoutes);              
app.use('/api/admin', adminRoutes);                     
app.use('/api/tenant', tenantRoutes);                   
app.use('/api/requests', requestRoutes);                 

app.get('/', (req, res) => {
    res.send('Welcome to the RentFlow API');
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'RentFlow API is running!' });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port: http://localhost:${PORT}`);
});