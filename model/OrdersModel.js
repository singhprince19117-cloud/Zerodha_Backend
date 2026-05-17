const { model } = require("mongoose");


const { OrdersSchema } = require("../schemas/OrdersSchema.js");

const OrdersModel = new model("orders", OrdersSchema);

module.exports = { OrdersModel };