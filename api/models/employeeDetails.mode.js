const mongoose = require("mongoose")

const schema = mongoose.Schema

const employeeSchema = new schema({
    name: String,
    surname: String,
    email: String,
    phone_no: String,
    DOJ: String,
    salary: Number,
    present_employee: Boolean
})


module.exports = mongoose.model("employee", employeeSchema, "employees")