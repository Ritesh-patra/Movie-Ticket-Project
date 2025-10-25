import mongoose from "mongoose";

const connectDb = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("✅ Database connected")
    );

    await mongoose.connect(process.env.MONGODB_URL);
  } catch (error) {
    console.error("❌ Database connection error:", error);
  }
};

export default connectDb;
