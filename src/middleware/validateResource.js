import Joi from "joi";
import mongoose from "mongoose";

// Regex kiểm tra tag chỉ bao gồm chữ cái và số (không ký tự đặc biệt)
const tagRegex = /^[a-zA-Z0-9]+$/;

// Danh sách Category hợp lệ
const allowedCategories = [
  "Frontend",
  "Backend",
  "DevOps",
  "AI",
  "Mobile",
  "UI/UX",
];

// Khai báo Schema Validation bằng Joi
const resourceJoiSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Title không được để trống",
    "string.min": "Title phải có ít nhất 3 ký tự",
    "string.max": "Title không được vượt quá 100 ký tự",
    "any.required": "Title là bắt buộc",
  }),
  url: Joi.string().trim().uri().required().messages({
    "string.empty": "URL không được để trống",
    "string.uri": "URL phải là một liên kết hợp lệ (vd: https://example.com)",
    "any.required": "URL là bắt buộc",
  }),
  category: Joi.string()
    .valid(...allowedCategories)
    .required()
    .messages({
      "any.only": `Category chỉ cho phép: ${allowedCategories.join(", ")}`,
      "any.required": "Category là bắt buộc",
    }),
  tags: Joi.array()
    .items(
      Joi.string().max(20).pattern(tagRegex).messages({
        "string.max": "Mỗi tag tối đa 20 ký tự",
        "string.pattern.base": "Tag không được chứa ký tự đặc biệt",
      }),
    )
    .min(1)
    .max(5)
    .required()
    .messages({
      "array.min": "Bắt buộc có tối thiểu 1 tag",
      "array.max": "Tối đa 5 tags",
      "any.required": "Tags là bắt buộc",
    }),
  summary: Joi.string().trim().max(300).allow("").optional().messages({
    "string.max": "Summary tối đa 300 ký tự",
  }),
});

/**
 * Middleware kiểm tra tính hợp lệ của dữ liệu truyền vào trong req.body
 */
export const validateResource = (req, res, next) => {
  const { error, value } = resourceJoiSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    // Thu thập tất cả các lỗi trả về cho client
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      message: "Dữ liệu không hợp lệ",
      errors: errorMessages,
    });
  }

  // Chuyển tất cả tags thành lowercase
  if (value.tags && Array.isArray(value.tags)) {
    value.tags = value.tags.map((tag) => tag.toLowerCase());
  }

  // Gán dữ liệu đã chuẩn hóa vào req.body
  req.body = value;
  next();
};

/**
 * Middleware kiểm tra MongoDB ObjectId hợp lệ
 */
export const validateObjectId = (req, res, next) => {
  const { id } = req.params;

  // Nếu ID truyền vào không tuân theo quy tắc 24 ký tự hex của ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "ID không hợp lệ",
    });
  }

  next();
};
