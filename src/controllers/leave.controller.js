const asyncHandler = require("../utils/asyncHandler");
const {ApiError} = require("../utils/ApiError");
const {ApiResponse} = require("../utils/ApiResponse")
const { Leave } = require("../models/Leave.model");
const {Employee} = require("../models/Employee.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const addLeave = asyncHandler(async (req,res)=>{
    const {startDate,endDate,leaveType,description} = req.body;
    const userID = req?.user?._id;
    console.log(startDate,endDate,leaveType,description);
    if(!startDate || !endDate || !leaveType) {
        throw new ApiError(400,"All fields are required.");
    }
    if(new Date(startDate) >= new Date(endDate)) {
        throw new ApiError(400,"Start date must be before end date.");
    }

    const leave = await Leave.create({
        employeeID: userID,
        leaveType,
        startDate,
        endDate,
        description
    })
    console.log("leave",leave);
    res
    .status(200)
    .json(new ApiResponse(
        200,
        leave,
        "Leave request added successfully."
    ))

});

const getEachEmployeeLeave = asyncHandler(async (req,res)=> {
    const userID = req?.user?._id;
    if(!userID){
        throw new ApiError(400,"No user exist.");
    }
    const result = await Employee.aggregate([
        {
            $match: {
                userID: new Object(userID),
            }
        },
        {
            $lookup: {
                from: "leaves",
                localField: "userID",
                foreignField: "employeeID",
                as: "Employee"
            }
        },
        {
            $project:{
                "Employee":1
            }
        }
    ]);
    console.log("result of leave: ",result)
    res
    .status(200)
    .json(new ApiResponse(
        200,
        result,
        "Record fetched Successfully."
    ))
})

const getLeaves = asyncHandler(async (req,res)=> {
    
    const result = await Employee.aggregate([
        {
            $lookup: {
                from: "leaves",
                localField: "userID",
                foreignField: "employeeID",
                as: "Employee"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "userID",
                foreignField: "_id",
                as: "User"
            }
        },
        {
            $project:{
                "Employee":1,
                "User":1
            }
        }
    ]);
    console.log("result of leave: ",result)
    res
    .status(200)
    .json(new ApiResponse(
        200,
        result,
        "Record fetched Successfully."
    ))
})

const updateLeaveStatus = asyncHandler(async (req,res)=> {
    const userID = req?.user?._id;
    if(!userID){
        throw new ApiError(400,"No user exist.");
    }
    const {leaveID,status} = req.body;
    console.log(leaveID,status);
    if(!leaveID || !status) {
        throw new ApiError(400,"All fields are required.");
    }
    const leave = await Leave.findByIdAndUpdate(leaveID,
        {
            status,
            admin: userID
        },
        {
            new:true
        }
    );
    if(!leave) {
        throw new ApiError(404,"Leave request not found.");
    }
    res
    .status(200)
    .json(new ApiResponse(
        200,
        leave,
        "Leave request status updated successfully."
    ))
})
module.exports = {
    addLeave,
    getEachEmployeeLeave,
    getLeaves,
    updateLeaveStatus
}