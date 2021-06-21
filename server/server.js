const express = require('express');
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());


app.listen(PORT,() => {
    console.log(`server is active on ${PORT}`)
})