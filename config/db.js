import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB connection successfully ${mongoose.connection.host}`);
  } catch (error) {
    console.log("Error in Connection MongoDB", error);
  }
};

export default connectDB;
