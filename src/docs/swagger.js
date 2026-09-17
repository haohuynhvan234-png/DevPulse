import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Cấu hình OpenAPI 3.0 Specification
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DEV PULSE – Bookmark & Resource Directory API",
      version: "1.0.0",
      description: `
REST API Backend cho ứng dụng **DEV PULSE**, hỗ trợ lưu trữ, phân loại, tìm kiếm, lọc và upvote tài nguyên lập trình.

### 📌 Đặc điểm Kỹ thuật:
- **Tech Stack**: Node.js + Express.js + MongoDB + Mongoose + Joi
- **Architecture**: Controller - Service - Model
- **Security / Authentication**: Không yêu cầu (Public API)
      `,
      contact: {
        name: "DEV PULSE Support Team",
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Development Local Server",
      },
    ],
    tags: [
      {
        name: "Resources",
        description: "Quản lý các tài nguyên lập trình (Bookmark & Directory)",
      },
    ],
    components: {
      schemas: {
        Resource: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "66e71234567890abcdef1234",
              description: "MongoDB ObjectId",
            },
            title: {
              type: "string",
              minLength: 3,
              maxLength: 100,
              example: "React Documentation",
              description: "Tên tiêu đề tài nguyên (3-100 ký tự)",
            },
            url: {
              type: "string",
              format: "uri",
              example: "https://react.dev",
              description: "Đường dẫn URL hợp lệ",
            },
            category: {
              type: "string",
              enum: ["Frontend", "Backend", "DevOps", "AI", "Mobile", "UI/UX"],
              example: "Frontend",
              description: "Danh mục tài nguyên",
            },
            tags: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["react", "javascript", "frontend"],
              description:
                "Thẻ gắn kèm (1-5 tags, lowercase, không ký tự đặc biệt)",
            },
            summary: {
              type: "string",
              maxLength: 300,
              example:
                "Tài liệu chính thức của React dành cho lập trình viên Web",
              description: "Tóm tắt nội dung tài nguyên",
            },
            codeSnippet: {
              type: "string",
              example: "console.log('Hello DevPulse!');",
              description: "Mã nguồn minh họa (Code Snippet)",
            },
            upvotes: {
              type: "integer",
              minimum: 0,
              example: 10,
              description: "Số lượt bình chọn (mặc định 0)",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-09-16T14:41:30.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-09-16T14:41:30.000Z",
            },
          },
        },
        ResourceInput: {
          type: "object",
          required: ["title", "url", "category", "tags"],
          properties: {
            title: {
              type: "string",
              minLength: 3,
              maxLength: 100,
              example: "React Documentation",
            },
            url: {
              type: "string",
              format: "uri",
              example: "https://react.dev",
            },
            category: {
              type: "string",
              enum: ["Frontend", "Backend", "DevOps", "AI", "Mobile", "UI/UX"],
              example: "Frontend",
            },
            tags: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["React", "JavaScript", "Frontend"],
            },
            summary: {
              type: "string",
              maxLength: 300,
              example:
                "Tài liệu chính thức của React dành cho lập trình viên Web",
            },
            codeSnippet: {
              type: "string",
              example: "console.log('Hello DevPulse!');",
            },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Lấy dữ liệu thành công",
            },
            data: {
              $ref: "#/components/schemas/Resource",
            },
          },
        },
        SuccessListResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Lấy danh sách thành công",
            },
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Resource",
              },
            },
          },
        },
        UpvoteSuccessResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Upvote thành công",
            },
            data: {
              type: "object",
              properties: {
                upvotes: {
                  type: "integer",
                  example: 11,
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Không tìm thấy resource",
            },
          },
        },
        ValidationErrorResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Dữ liệu không hợp lệ",
            },
            errors: {
              type: "array",
              items: {
                type: "string",
              },
              example: [
                "Title phải có ít nhất 3 ký tự",
                "URL phải là một liên kết hợp lệ (vd: https://example.com)",
              ],
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

// Khởi tạo Swagger Spec
const swaggerSpec = swaggerJSDoc(options);

/**
 * Tích hợp Swagger UI vào ứng dụng Express
 */
export const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swaggerSpec;
