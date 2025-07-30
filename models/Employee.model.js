const mongoose = require("mongoose");
const mongooseAggregation = require("mongoose-aggregate-paginate-v2");
const employeeSchema = new mongoose.Schema({
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    employeeID: {
        type: String,
        required: true,
        lowercase: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true
    },
    designation: {
        type: String,
        required: true,
        lowercase: true
    },
    gender: {
        type: String,
        required: true,
        lowercase: true
    },
    martialStatus: {
        type: String,
        required: true,
        lowercase: true
    },
    salary: {
        type: String,
        required: true,
        lowercase: true
    },
    dob: {
        type: String,
        required: true,
        lowercase: true
    },
})
employeeSchema.plugin(mongooseAggregation);
const Employee = mongoose.model("Employee",employeeSchema);
module.exports = {Employee};