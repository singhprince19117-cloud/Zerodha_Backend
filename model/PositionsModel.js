const { model } = require("mongoose");


const { PositionsSchema } = require("../schemas/PositionsSchema.js");

const PositionsModel = new model("positions", PositionsSchema);

module.exports = { PositionsModel };