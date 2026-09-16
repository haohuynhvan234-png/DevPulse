import Resource from "../models/resourceModel.js";

// Danh sách Category hợp lệ để kiểm tra khi filter
const ALLOWED_CATEGORIES = [
  "Frontend",
  "Backend",
  "DevOps",
  "AI",
  "Mobile",
  "UI/UX",
];

/**
 * Service: Tạo mới một Resource
 */
export const createResource = async (data) => {
  // Loại bỏ upvotes nếu client truyền vào khi tạo mới
  delete data.upvotes;
  return await Resource.create(data);
};

/**
 * Service: Lấy danh sách Resource (kèm Search, Filter Category, Filter Tag, Sort)
 */
export const getAllResources = async (queryParams = {}) => {
  const { search, category, tag, sort } = queryParams;

  // Khởi tạo điều kiện lọc (Filter Query)
  const filter = {};

  // 1. Filter theo Category
  if (category) {
    if (!ALLOWED_CATEGORIES.includes(category)) {
      const error = new Error(
        `Category không hợp lệ. Chỉ chấp nhận: ${ALLOWED_CATEGORIES.join(", ")}`,
      );
      error.statusCode = 400;
      throw error;
    }
    filter.category = category;
  }

  // 2. Filter theo Tag
  if (tag) {
    filter.tags = tag.toLowerCase();
  }

  // 3. Tìm kiếm không phân biệt chữ hoa/thường theo Title hoặc Summary
  if (search) {
    const searchRegex = new RegExp(search, "i");
    filter.$or = [{ title: searchRegex }, { summary: searchRegex }];
  }

  // 4. Sắp xếp (Sort)
  // Mặc định sort=newest (createdAt giảm dần)
  let sortOption = { createdAt: -1 };

  if (sort === "upvoted") {
    sortOption = { upvotes: -1 };
  } else if (sort === "newest") {
    sortOption = { createdAt: -1 };
  }

  return await Resource.find(filter).sort(sortOption);
};

/**
 * Service: Lấy chi tiết Resource theo ID
 */
export const getResourceById = async (id) => {
  return await Resource.findById(id);
};

/**
 * Service: Cập nhật Resource theo ID (Không cho phép cập nhật upvotes)
 */
export const updateResource = async (id, data) => {
  // Bảo vệ không cho sửa upvotes qua API PUT
  delete data.upvotes;

  return await Resource.findByIdAndUpdate(id, data, {
    new: true, // Trả về document sau khi đã update
    runValidators: true, // Chạy lại mongoose validation
  });
};

/**
 * Service: Xóa Resource theo ID
 */
export const deleteResource = async (id) => {
  return await Resource.findByIdAndDelete(id);
};

/**
 * Service: Tăng lượt upvote theo cách Atomic Operation bằng $inc
 */
export const upvoteResource = async (id) => {
  return await Resource.findByIdAndUpdate(
    id,
    { $inc: { upvotes: 1 } },
    { new: true },
  );
};
