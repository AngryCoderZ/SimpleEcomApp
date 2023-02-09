const mongoose = require("mongoose");
const validator = require("validator");
const { v4: uuidv4 } = require('uuid')
const crypto = require('crypto')

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'username is required'],
            unique: true,
            index: true,
            lowercase: true,
        },
        name: {
            type: String,
            required: [true, 'name is required'],
        },
        email: {
            type: String,
            required: [true, 'email is required'],
            unique: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("email is invalid")
                }
            }
        },
        hashed_password: {
            type: String,
            required: [true, 'password is required']
        },
        salt: String,
    },
    { timestamps: true }
)


userSchema.virtual("password")
    .set(function (v) {
        this._password = v;
        this.salt = uuidv4();
        this.hashed_password = this.encryptPassword(v)
    })
    .get(function () {
        return this._password
    })

userSchema.methods = {
    encryptPassword: function (password) {
        if (!password) return ""
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        }
        catch (err) {
            return "error in encrypting"
        }
    }
}




// userSchema.virtual("hash")
//     .set(function (v) {
//         this.name = v;
//     })
//     .get(function () {
//         return this.name
//     })


module.exports = mongoose.model("User", userSchema)
