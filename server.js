// server.js
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("./backend-codes/db/dataBase.js");
const dotenv = require("dotenv");
// const cookieParser = require("cookie-parser");
const cors = require("cors");
dotenv.config();
const router = require("./backend-codes/Routes/user.route.js");

// Routes

app.use(express.json());
app.use(cors());
// Middleware
app.use("/api", router);
// app.use(cookieParser());

// MongoDB Connection

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
