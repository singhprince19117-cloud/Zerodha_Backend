require("dotenv").config();


const express = require("express");
const mongoose = require("mongoose");
const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const bodyParser = require("body-parser");
const cors = require("cors");
const { OrdersModel } = require("./model/OrdersModel");
const { UsersModel } = require("./model/UsersModel");
const jwt = require("jsonwebtoken");
const { isLoggedIn } = require("./middlware/auth.middleware");



const app = express();



port = process.env.PORT;
MONGO_URI = process.env.MONGO_URL;




app.use(cors());
app.use(bodyParser.json());


app.get("/allHoldings", isLoggedIn, async (req, res) => {
    let allHoldings = await HoldingsModel.find({});

    res.json(allHoldings);
});

app.get("/allPositions", isLoggedIn, async (req, res) => {
    let allPositions = await PositionsModel.find({});

    res.json(allPositions);
});

app.post("/newOrder", isLoggedIn, async (req, res) => {
    let newOrder = new OrdersModel({
        name: req.body.name,
        qty: req.body.qty,
        price: req.body.price,
        mode: req.body.mode,
    });

    newOrder.save();

    res.send("done");
});

app.get("/orders", isLoggedIn, async (req, res) => {
    let orders = await OrdersModel.find({});

    res.json(orders);
});

app.post("/sellOrder", isLoggedIn, async (req, res) => {
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
});

app.post("/register", async (req, res) => {
    const { name, email } = req.body;

    const isExists = await UsersModel.findOne({ email });

    if (isExists) {
        return res.status(422).json({
            message: "User already exists with this email",
            status: "failed",
        });
    };

    const user = new UsersModel(req.body);

    user.save();

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
    )

    return res.status(201).json({
        token,
        user: {
            _id: user._id,
            email: email,
            name: name
        }
    })
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const users = await UsersModel.findOne({ email });

    if (!users) {
        return res.json("Email is wrong");
    }

    const isValid = await users.comparePassword(password);

    if (!isValid) {
        return res.json("Password is wrong");
    }

    const token = jwt.sign(
        { userId: users._id },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
    )

    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({
        user: {
            _id: users._id,
            email: users.email,
            name: users.name,
        },
        token
    });
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