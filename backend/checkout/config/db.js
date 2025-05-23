import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    // console.log(`MongoDB Connected: ${conn.connection.name}`);
  } catch (error) {
    // console.error(`Error: ${error.message}`);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
