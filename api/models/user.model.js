const mongoose = require("mongoose")

const schema = mongoose.Schema

const userSchema = new schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    phone_no: String
})


module.exports = mongoose.model("user", userSchema, "users")