const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
    employeeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    },
    leaveType: {
        type:String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    status:{
        type: String,
        enum: ["Pending","Approved","Rejected"],
        default: "Pending"
    },
    appliedOn: {
        type:Date,
        default:Date.now
    },
    admin:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
},{timestamps: true})

const Leave = mongoose.model("Leave",leaveSchema);

module.exports = {Leave}