const { Schema } = require("mongoose");

const UserSchema = new Schema({
    username: String,
    email: String,
    password: String,
}, { timestamps: true });

module.exports = UserSchema;