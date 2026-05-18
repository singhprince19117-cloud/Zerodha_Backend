const { Schema } = require("mongoose");
const bcrypt = require("bcrypt");


const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
}, { timestamps: true });

UserSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(this.password, salt);
    this.password = hash;

    return;
});

UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = UserSchema;