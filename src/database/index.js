const mongoose = require("mongoose");
const { DB_NAME } = require("../constant");

const connect_to_database = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.MONGODB_NAME}:${process.env.MONGODB_PASSWORD}@cluster0.6tisqfc.mongodb.net/${DB_NAME}`);

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