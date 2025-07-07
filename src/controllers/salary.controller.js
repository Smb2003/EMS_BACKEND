const { default: mongoose } = require("mongoose");
const { Employee } = require("../models/Employee.model");
const { Salary } = require("../models/Salary.model");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const ObjectId = mongoose.Types.ObjectId;

const addSalary = asyncHandler(async (req,res)=>{
    const {employeeID,basicSalary,allowance,monthlyDeduction,payDate} = req.body;
    if([employeeID,basicSalary,allowance,monthlyDeduction,payDate].some(item => (item.trim() == ""))){
        throw new ApiError(400,"All fields are required.");
    }
    const totalSalary = parseInt(basicSalary) + parseInt(allowance) - parseInt(monthlyDeduction);
    const createSalary = await Salary.create({
        employeeID,
        basicSalary,
        allowance,
        deduction: monthlyDeduction,
        payDate,
        netSalary: totalSalary || 0
    });
    res
    .status(200)
    .json(new ApiResponse(
        200,
        createSalary,
        "Salary is added successfully."
    ))
});

const getSalary = asyncHandler(async(req,res) => {
    const {id} = req.params;
    console.log(id)
    const findSalary = await Employee.aggregate([
        
        {
            $match:{
                $or: [
                    { _id: new ObjectId(id) },
                    { userID: new ObjectId(id) }
                ]

            }
        },
        {
            $lookup:{
                from: "salaries",
                localField: "_id",
                foreignField: "employeeID",
                as:"Salary"
            }
        },
        {
            $lookup:{
                from:"users",
                localField: "userID",
                foreignField: "_id",
                as:"empData"
            }
        }
    ])
    console.log(findSalary)
    if(!findSalary){
        throw new ApiError(400,"No record found!")
    }
    res
    .status(200)
    .json(new ApiResponse(
        200,
        findSalary,
        "Record fetched successfully"
    ))
})

const getAllSalaries = asyncHandler(async(req,res) => {
    const findSalaries = await Salary.find().populate("netSalary", "netSalary");
    if(!findSalaries || findSalaries.length === 0){
        throw new ApiError(400,"No record found!")
    }
    res
    .status(200)
    .json(new ApiResponse(
        200,
        findSalaries,
        "Record fetched successfully"
    ))
})
module.exports = {
    addSalary,
    getSalary,
    getAllSalaries
}