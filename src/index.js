// require('dotenv').config({ path: './env' })//*No issue with this but not using module

import dotenv from 'dotenv';
import connectDB from "./db/index.js";
import { app } from './app.js';


dotenv.config({
    path: '.env'
})

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is Running At Port ${process.env.PORT}`);
        })

    }).catch((error) => {
        console.log("Mongo DB connection Failed ", error);
    })


























//*First Approach For Connection with Database
/*
(async () => {

    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        app.on("error", (error) => {
            console.log("ERROR:EXPRESS:INDEX ", error);
            throw error;
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening in port ${process.env.PORT}`);
        })



    } catch (error) {
        console.error("ERROR :: MONGODCONECTION:INDEX.JS", error);
        throw error;
    }


})()*/