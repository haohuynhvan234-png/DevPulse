import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import { setupSwagger } from "./docs/swagger.js";

// 1. Cấu hình load biến môi trường từ file .env
dotenv.config();

// 2. Khởi tạo ứng dụng Express
const app = express();

// 3. Kết nối Cơ sở dữ liệu MongoDB
connectDB();

// 4. Middlewares toàn cục
// Cho phép tất cả các nguồn (origin) truy cập API (CORS cho Frontend ReactJS)
app.use(cors());

// Middleware đọc dữ liệu JSON từ request body gửi lên
app.use(express.json());

// 5. Khởi tạo Giao diện Swagger UI Document tại route /api-docs
setupSwagger(app);

// 6. Khai báo các Routes chính của ứng dụng
app.use("/api/resources", resourceRoutes);

// Route mặc định kiểm tra server
app.get("/", (req, res) => {
  res.json({
    message: "🚀 DEV PULSE API Server đang hoạt động!",
    swaggerUI: "http://localhost:3001/api-docs",
  });
});

// 7. Cấu hình Cổng lắng nghe (PORT)
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`📚 Tài liệu Swagger UI: http://localhost:${PORT}/api-docs`);
});
