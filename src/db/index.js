import mongoose from "mongoose";
import { DBNAME } from "../constants.js";



const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DBNAME}`)
        console.log(`\n MongoDB connect !! DB HOST: ${connectionInstance.connection.host}`);//*Look At console
    } catch (error) {

        console.log("ERROR :MongoDB : db/Index.js", error);
        process.exit(1);//*Read more about process 

    }
}

export default connectDB;