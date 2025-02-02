
const mongoose=require("mongoose");
const connectDB = async () =>{
    await mongoose.connect("mongodb+srv://AnkushPundir:Ankush123@nodesync.fyzmt.mongodb.net/devCollab");

};
module.exports = connectDB; 