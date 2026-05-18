const { model } = require("mongoose");


const UserSchema = require("../schemas/UserSchema.js");

const UsersModel = new model("users", UserSchema);

module.exports = { UsersModel };