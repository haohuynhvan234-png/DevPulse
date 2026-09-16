import mongoose from "mongoose";

/**
 * Hàm kết nối với cơ sở dữ liệu MongoDB
 */
const connectDB = async () => {
  try {
    // Kết nối MongoDB bằng kết nối URI lấy từ file .env
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Connection Failed:", error.message);
    // Dừng tiến trình nếu kết nối thất bại
    process.exit(1);
  }
};

export default connectDB;
