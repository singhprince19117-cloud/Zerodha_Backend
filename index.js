require("dotenv").config();


const express = require("express");
const mongoose = require("mongoose");
const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const bodyParser = require("body-parser");
const cors = require("cors");
const { OrdersModel } = require("./model/OrdersModel");



const app = express();



port = process.env.PORT;
MONGO_URI = process.env.MONGO_URL;




app.use(cors());
app.use(bodyParser.json());


app.get("/allHoldings", async (req, res) => {
    let allHoldings = await HoldingsModel.find({});

    res.json(allHoldings);
});

app.get("/allPositions", async (req, res) => {
    let allPositions = await PositionsModel.find({});

    res.json(allPositions);
});

app.post("/newOrder", async (req, res) => {
    let newOrder = new OrdersModel({
        name: req.body.name,
        qty: req.body.qty,
        price: req.body.price,
        mode: req.body.mode,
    });

    newOrder.save();

    res.send("done");
});

app.get("/orders", async (req, res) => {
    let orders = await OrdersModel.find({});

    res.json(orders);
});

app.post("/sellOrder", async (req, res) => {
    let ans = true;

    let qty = req.body.qty;

    while (ans) {
        let newOrder = await OrdersModel.find({ name: req.body.name }).limit(1);

        if (qty > newOrder[0].qty) {
            qty -= newOrder[0].qty;
            await OrdersModel.findByIdAndDelete(newOrder[0]._id);
        }
        else {
            newOrder[0].qty -= qty;
            await OrdersModel.findByIdAndUpdate(newOrder[0]._id, { $set: { qty: newOrder[0].qty } });

            ans = false;
        }
    }

    res.send("done");
})

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