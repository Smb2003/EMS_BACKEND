const mongoose = require("mongoose");
const mongooseAggregation = require("mongoose-aggregate-paginate-v2");
const { Employee } = require("./Employee.model");
const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        index:true,
        unique: true
    },
    description: {
        type: String,
        lowercase: true,
        index:true,
        unique: true
    }
},{timestamps:true})
departmentSchema.plugin(mongooseAggregation)
departmentSchema.pre('findOneAndDelete', async function (next) {
  try {
    const departmentId = this.getQuery()["_id"]; // deleted department's ID

    const employees = await Employee.find({ department: departmentId });

    const userIDs = employees.map(emp => emp.userID); 

    await User.deleteMany({ _id: { $in: userIDs } });
    await Employee.deleteMany({ department: departmentId });

    next();
  } catch (err) {
    console.error("Error in department deletion cascade:", err);
    next(err);
  }
});


const Department = mongoose.model("Department",departmentSchema);
module.exports = {Department}