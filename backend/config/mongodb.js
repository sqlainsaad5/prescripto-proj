import mongoose from "mongoose";

const connectDB = async () =>{
    mongoose.connection.on('connected', () => console.log("Database Connected"))
    mongoose.connection.on('error', (err) => {
        console.error("Database Connection Error:", err.message)
    })

    await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`)
}

export default connectDB