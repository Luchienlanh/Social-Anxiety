const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const predictRoute = require('./routes/predictRoute');
app.use('/api', predictRoute);

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Social Anxiety Prediction API is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
