const express = require('express');
const connectDB=require("./config/db")
const cors = require("cors");
const errorHandler = require("./middleware/error")
require('dotenv').config({ path: "./config.env" });
connectDB();

const app = express();

app.use(cors());

app.use(express.json())

app.use ('/api/auth',require('./routes/auth'));
app.use ('/api/private',require('./routes/private'));

app.use(errorHandler)
const PORT = process.env.PORT || 8000;

app.listen(PORT,() => {
    console.log(`server is active on ${PORT}`)
})
