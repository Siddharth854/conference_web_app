const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const bookingRoutes = require('./Routes/bookingRoutes');
require('dotenv').config();
require('./Models/db');

const PORT = process.env.PORT || 8080;

/* =======================
   MIDDLEWARES
======================= */
app.use(bodyParser.json());
app.use(cors());

/* =======================
   ROOT ROUTE (IMPORTANT)
   This prevents "Cannot GET /"
======================= */
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Conference Room Booking API is running 🚀',
    status: 'OK'
  });
});

/* =======================
   API ROUTES
======================= */
app.use('/auth', AuthRouter);
app.use('/api/bookings', bookingRoutes);

/* =======================
   404 HANDLER (OPTIONAL)
======================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

/* =======================
   START SERVER
======================= */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
