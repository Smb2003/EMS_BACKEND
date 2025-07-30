const mongoose = require("mongoose");
const { DB_NAME } = require("../constant");

const connect_to_database = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_CONNECTION_STRING}/${DB_NAME}`);

        mongoose.connection.on("on", ()=>{
            console.log("Database connected successfuly!");
        })
        
        mongoose.connection.on('error',()=>{
            console.log("Error occured in connecting DB");
        })
        
    } catch (error) {
        console.log("Error: ",error);
        process.exit(1);
    }
}   
module.exports = {connect_to_database}