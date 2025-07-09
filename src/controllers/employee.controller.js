const { Department } = require("../models/Department.model");
const { Employee } = require("../models/Employee.model");
const { User } = require("../models/User.model");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { uploadToCloudinary } = require("../utils/cloudinary");

const addEmployee = asyncHandler(async (req,res)=>{
    const {name,email,employeeID,designation,department,gender,role,salary,dob,password,martialStatus} = req.body;

    if([name,email,employeeID,designation,department,gender,martialStatus,role,password].some((item)=>{
        return item?.trim() == ""
    })){
        throw new ApiError(400,"Fill each required field.");
    }
    const img = req.files;
    console.log(img)
    const imagefile = req?.files?.image[0]?.path;
    console.log("Image->",imagefile);
    
    if(!imagefile){
        throw new ApiError(400,"Image is required.")
    }
    const image = await uploadToCloudinary(imagefile);
    console.log("cloudinary->",image.url);
    
    if(!image){
        throw new ApiError(400,"No image found");
    }
    const existingUser = await User.findOne({email});
    if(existingUser){
        throw new ApiError(400,"User already exsist.")
    }

    const user = await User.create({
        name,
        email,
        role,
        password,
        profileImage: image?.url || ""
    })

    const employee = await Employee.create({
        userID:user?._id,
        employeeID,
        dob,
        martialStatus,
        gender,
        designation,
        department,
        salary,
        image: image?.url || ""
    })

    res
    .status(200)
    .json(new ApiResponse(
        200,
        employee,
        "Employee added successfully!"
    ))
})

const getEmployees = asyncHandler(async (req,res) => {

    const result = await Employee.aggregate([
        {
            $lookup:{
                from: "users",
                localField: "userID",
                foreignField: "_id",
                as:"employee"
            }
        },
        {
            $lookup:{
                from: "departments",
                localField: "department",
                foreignField: "_id",
                as:"depData"
            }
        },
        {
            $project: {
                "employee.password": 0 ,
                "employee.refreshToken":0
            }
        }
    ])
   
    console.log("EMPrslt",result)

    if(!result){
        throw new ApiError(400,"No record found.")
    }
    res
    .status(200)
    .json(new ApiResponse(
        200,
        result,
        "Employee record fetched successfully!"
    ))
})

const editEmployee = asyncHandler(async (req,res)=>{
    const {id} = req.params;
    
    const {name,email,employeeID,designation,gender,role,salary,dob,password,martialStatus,depName,description} = req.body;
    
    if([name,email,employeeID,designation,gender,martialStatus,role,password,depName,salary,dob].some((item)=>{
        return item?.trim() == ""
    })){
        throw new ApiError(400,"Fill each required field.");
    }
    const findEmployee = await Employee.findById(id);
    if(!findEmployee){
        throw new ApiError(400,"No user found.");
    }
    const findUser = await User.findByIdAndUpdate(findEmployee?.userID,{
        name,
        password,
        role,
        email
    }).select("-password -refreshToken");
    if(!findUser){
        throw new ApiError(400,"Error occured while updating User.")
    }
    const findDepartment = await Department.findByIdAndUpdate(findEmployee?.department,{
        name: depName,
        description
    }) 
     if(!findDepartment){
        throw new ApiError(400,"Error occured while updating department.")
    }
    const updateEmployee = await Employee.findByIdAndUpdate(id,{
        designation,
        gender,
        salary,
        dob,
        martialStatus,
        employeeID
    })
    res
    .status(200)
    .json(new ApiResponse(
        200,
        updateEmployee,
        "Record updated successfully."
    ))
})

const deleteEmployee = asyncHandler(async (req,res)=>{
    const {id} = req.params;

    const findEmployee = await Employee.findById(id);
    if(!findEmployee){
        throw new ApiError(400,"No user found.");
    }
    const findUser = await User.findByIdAndDelete(findEmployee?.userID);
    await Employee.findByIdAndDelete(id);

    res
    .status(200)
    .json(new ApiResponse(
        200,
        "Record deleted successsfully."
    ))
})

module.exports = {
    addEmployee,
    getEmployees,
    editEmployee,
    deleteEmployee
}