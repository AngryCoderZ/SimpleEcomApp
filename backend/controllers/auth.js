const User = require("../models/user")
const { errorCode, errorMsg, errorMsg2 } = require('../helper/errorHandler')

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