import mongoose from "mongoose";

// Định nghĩa Mongoose Schema cho Resource
const resourceSchema = new mongoose.Schema(
  {
    // 1. Title: Tên tài nguyên (Bắt buộc, từ 3 - 100 ký tự, tự động cắt khoảng trắng đầu/cuối)
    title: {
      type: String,
      required: [true, "Title là bắt buộc"],
      trim: true,
      minlength: [3, "Title phải có ít nhất 3 ký tự"],
      maxlength: [100, "Title không được quá 100 ký tự"],
    },

    // 2. URL: Đường dẫn tài nguyên (Bắt buộc)
    url: {
      type: String,
      required: [true, "URL là bắt buộc"],
      trim: true,
    },

    // 3. Category: Danh mục tài nguyên (Bắt buộc, thuộc danh sách cố định)
    category: {
      type: String,
      required: [true, "Category là bắt buộc"],
      enum: {
        values: ["Frontend", "Backend", "DevOps", "AI", "Mobile", "UI/UX"],
        message: "Category không hợp lệ",
      },
    },

    // 4. Tags: Danh sách thẻ gắn kèm (Từ 1-5 tags, tự động chuyển chữ thường)
    tags: {
      type: [String],
      required: [true, "Tags là bắt buộc"],
      validate: [
        {
          validator: function (val) {
            return Array.isArray(val) && val.length >= 1 && val.length <= 5;
          },
          message: "Số lượng tag phải từ 1 đến 5 tags",
        },
        {
          validator: function (val) {
            // Mỗi tag tối đa 20 ký tự, không chứa ký tự đặc biệt (chỉ chứa chữ cái và số)
            return val.every(
              (tag) =>
                typeof tag === "string" &&
                tag.length <= 20 &&
                /^[a-zA-Z0-9]+$/.test(tag),
            );
          },
          message: "Mỗi tag tối đa 20 ký tự và không chứa ký tự đặc biệt",
        },
      ],
      // Tự động chuyển tất cả các tag thành chữ thường
      set: (tags) =>
        Array.isArray(tags) ? tags.map((t) => t.toLowerCase()) : tags,
    },

    // 5. Summary: Tóm tắt nội dung tài nguyên (Tùy chọn, tối đa 300 ký tự)
    summary: {
      type: String,
      trim: true,
      maxlength: [300, "Summary không được vượt quá 300 ký tự"],
      default: "",
    },

    // 6. Upvotes: Số lượt upvote tài nguyên (Mặc định là 0, tối thiểu là 0)
    upvotes: {
      type: Number,
      default: 0,
      min: [0, "Upvotes không được nhỏ hơn 0"],
    },
  },
  {
    // Tự động tạo 2 trường: createdAt (thời gian tạo) và updatedAt (thời gian cập nhật gần nhất)
    timestamps: true,
  },
);

const Resource = mongoose.model("Resource", resourceSchema);

export default Resource;
