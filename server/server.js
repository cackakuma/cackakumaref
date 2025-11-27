const express = require('express');
require("dotenv").config();
const cors = require('cors');
const path = require('path');
const connectDB = require('./configs/db');
const routes = require('./Routes/Routes');
const app = express();

connectDB();
app.use(cors({
  origin: "*", 
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', routes);

const PORT = process.env.PORT;

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
