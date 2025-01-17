const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/auth', require('./routes/auth'));
app.listen(process.env.PORT || 5000, () =>
 console.log(`Server running on port ${process.env.PORT || 5000}`)
);
