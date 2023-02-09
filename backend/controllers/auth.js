const User = require("../models/user")
const { errorCode, errorMsg, errorMsg2 } = require('../helper/errorHandler')
const jwt = require('jsonwebtoken')
const { expressjwt: expressJwt } = require("express-jwt")

exports.signup = (req, res) => {
    const { username, name, email, password } = req.body;
    if (!username || !name || !email || !password) {
        return res.status(400).json({
            error: "all field required"
        })
    }

    User.findOne({ $or: [{ "username": username }, { "email": email }] })
        .exec((err, existUser) => {
            if (existUser) {
                return res.status(400).json({
                    error: "user already exist"
                })
            }
            const newUser = new User({ username, name, email, password });
            newUser.save((err, user) => {
                if (err) {
                    return err.code === 11000 ?
                        errorCode(res, 400, errorMsg2(err))
                        :
                        errorCode(res, 400, errorMsg(err))
                }
                res.json(user)
            })
        });
}

exports.signin = (req, res) => {
    let { email, username, password } = req.body;
    // if (!username || !email || !password) {
    //     return errorCode(res, 400, "all field required")
    // }
    User.findOne({ $or: [{ "username": username }, { "email": email }] })
        .exec((err, user) => {
            if (err || !user) {
                return errorCode(res, 401, `user with that ${email}${username} doesn't match`)
            }
            if (!user.authenticate(password)) {
                return errorCode(res, 401, `user with that ${email}${username} doesn't match`)
            }
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn : '9d' })
            const { _id, name, username, email, role } = user
            res.json({
                token,
                user: { _id, name, username, email, role }
            })
        })
}

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth',
    algorithms: ["HS256"]
})