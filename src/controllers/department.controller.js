const { Department } = require("../models/Department.model");
const { Employee } = require("../models/Employee.model");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const add_department = asyncHandler(async(req,res)=>{
    const {name,description} = req.body;
    if(!name){
        throw new ApiError(400,"Name is required");
    }
    const existingDepartment = await Department.findOne({name});
    if(existingDepartment){
        throw new ApiError(400,"Department already exist.");
    }
    const add_Department = await Department.create({
        name,
        description
    });

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            add_Department,
            "Department has beed added successfully.",
        )
    )
});

const getDepartments = asyncHandler(async (req,res)=>{
    const department =  await Department.find();
    if(!department){
        throw new ApiError(400,"No record found.")
    }
    res
    .status(200)
    .json(new ApiResponse(
        200,
        department,
        "Department record fetched successfully!"
    ))
}) 
const editDepartment = asyncHandler(async (req,res)=>{
    const {name,description} = req.body;
    if(name){
        throw new ApiError(400,"Name field is required");
    }
    const department =  await Department.findOneAndUpdate({name},{
        name,
        description
    });
    if(!department){
        throw new ApiError(400,"No record found.")
    }
    res
    .status(200)
    .json(new ApiResponse(
        200,
        department,
        "Record updated successfully!"
    ))
}) 

const deleteDepartment = asyncHandler(async (req,res)=>{
    const {id} = req.params;
    console.log(id);
    
    if(!id){
        throw new ApiError(400,"No ID found.");
    }
    const findDepartment = await Department.findOneAndDelete({ _id: id });

    if(!findDepartment){
        throw new ApiError(400,"No record available for this ID");
    }
    res
    .status(200)
    .json(new ApiResponse(
        200,
        "Record deleted successfully."
    ))
})
module.exports = {add_department,getDepartments,editDepartment,deleteDepartment}