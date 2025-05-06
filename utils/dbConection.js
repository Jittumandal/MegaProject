import mongoose from "mongoose";

const dbConection = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URl);
        console.log('Your database is connected');
        
    } catch (error) {
        console.log("Your database is not connected", error);
    }
}


export default dbConection