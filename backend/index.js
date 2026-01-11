const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const bookingRoutes = require('./Routes/bookingRoutes'); 
require('dotenv').config();
require('./models/db');

const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());

// Your existing routes
app.use('/auth', AuthRouter);

app.use('/api/bookings', bookingRoutes); 

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

// ```

// ---

// ## 📁 **Your Project Structure Should Look Like:**
// // ```
// your-project/
// ├── frontend/                  ← React app
// │   ├── src/
// │   │   ├── components/
// │   │   ├── pages/
// │   │   │   └── Home.js       ← Enhanced Home component
// │   │   ├── App.js
// │   │   └── index.js          ← React index.js (DON'T add routes here)
// │   └── package.json
// │
// ├── backend/                   ← Node.js/Express server
// │   ├── Models/
// │   │   ├── User.js
// |   |   ├── db.js
// │   │   └── Booking.js        ← NEW: Add this
// │   ├── Routes/
// │   │   ├── AuthRouter.js
// │   │   └── bookingRoutes.js  ← NEW: Add this
// │   ├── Middlewares/
// │   │   └── Auth.js & AuthValidation.js
// │   ├── index.js              ← Backend server (ADD routes here)
// │   └── package.json