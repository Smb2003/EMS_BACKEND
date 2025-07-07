const express = require('express');
const { register, login, logOut, RefreshAccessToken, updatePassword } = require('../controllers/auth.controller.js');
const { upload } = require('../middleware/multer.middleware');
const { verifyJWT } = require('../middleware/auth.middleware');
const { add_department, getDepartments, editDepartment, deleteDepartment } = require('../controllers/department.controller.js');
const { addEmployee, getEmployees, editEmployee, deleteEmployee } = require('../controllers/employee.controller.js');
const { addSalary, getSalary, getAllSalaries } = require('../controllers/salary.controller.js');
const { addLeave,getEachEmployeeLeave, getLeaves, updateLeaveStatus } = require('../controllers/leave.controller.js');
const router = express.Router();

const uploadFileMiddleware = upload.fields([{ name: 'profileImage', maxCount: (1 || 0) }]);
router.route("/register").post(uploadFileMiddleware,register);
router.route("/login").post(login);
router.route("/refreshToken").post(RefreshAccessToken);
router.route("/logOut").get(verifyJWT,logOut);
router.route("/updatePassword").post(verifyJWT,updatePassword);
router.route("/check").get(verifyJWT,(req,res)=>{
    res.status(200).json({
        success: true,
        user: req.user
    })
});
//department routes..
router.route("/department_add").post(verifyJWT,add_department);
router.route("/department_get").get(verifyJWT,getDepartments);
router.route("/department_edit").put(verifyJWT,editDepartment);
router.route("/department_delete/:id").delete(verifyJWT,deleteDepartment);

//employee routes
router.route("/employee_add").post(upload.fields([{ name: 'image', maxCount: 1 }]),verifyJWT,addEmployee);
router.route("/employee_get").get(verifyJWT,getEmployees);
router.route("/employee_edit/:id").put(upload.fields([{ name: 'image', maxCount: 1 }]),verifyJWT,editEmployee);
router.route("/department_delete/:id").delete(verifyJWT,deleteEmployee);


router.route("/salary_add").post(verifyJWT,addSalary);
router.route("/salary_get/:id").get(verifyJWT,getSalary);
router.route("/salary_allGet").get(verifyJWT,getAllSalaries);


router.route("/leave_add").post(verifyJWT,addLeave);
router.route("/emplyeeLeave_get").get(verifyJWT,getEachEmployeeLeave);
router.route("/leave_get").get(verifyJWT,getLeaves);
router.route("/leave_update").put(verifyJWT,updateLeaveStatus);







module.exports = {router};


