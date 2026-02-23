const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();


// middleware

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);

// test route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// server start
const PORT = process.env.PORT || 5000;
connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});