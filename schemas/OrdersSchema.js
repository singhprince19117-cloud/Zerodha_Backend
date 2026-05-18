const { Schema } = require("mongoose");

const OrdersSchema = new Schema({
    name: String,
    qty: Number,
    price: Number,
    mode: String,

    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
    }
}, { timestamps: true });

module.exports = { OrdersSchema };