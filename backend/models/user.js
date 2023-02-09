const mongoose = require("mongoose");
const validator = require("validator");

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
        password: String,
    },
    { timestamps: true }
)

module.exports = mongoose.model("User", userSchema)
