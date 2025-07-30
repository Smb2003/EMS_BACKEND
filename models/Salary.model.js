const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema({
    employeeID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required:true
    },
    basicSalary: {
        type: Number,
        required:true
    },
    allowance: {
        type: Number,
        required:true
    },
    deduction: {
        type: Number,
        required:true
    },
    netSalary: {
        type: Number,
        required:true
    },
    payDate:{
        type: String,
        required:true
    }
})

const Salary = mongoose.model("Salary",salarySchema);

module.exports = {Salary}