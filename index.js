require("dotenv").config();


const express = require("express");
const mongoose = require("mongoose");




const app = express();



port = process.env.PORT;
MONGO_URI = process.env.MONGO_URL;




app.listen(port, () => {
    console.log("server is connected");

    mongoose.connect(process.env.MONGO_URL || MONGO_URI)
        .then(() => {
            console.log("server is connected to DB");
        })
        .catch(err => {
            console.log("Error connecting to DB", err),
                process.exit(1);
        })
});