const jwt = require("jsonwebtoken");
const { UsersModel } = require("../model/UsersModel");

async function isLoggedIn(res, req, next) {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access, token is missing"
        });
    };

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        const user = await UsersModel.findById(decode.user._id);

        if (!user) {
            return res.json("user not found");
        }

        req.user = user;
        next();

    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        });
    }
}

module.exports = { isLoggedIn };



// "name": "WIPRO",
//   "qty": 10,
//   "price": 10000,
//   "mode": "BUY"