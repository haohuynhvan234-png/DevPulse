import express from "express";
import * as resourceController from "../controllers/resourceController.js";
import {
  validateResource,
  validateObjectId,
} from "../middleware/validateResource.js";

const router = express.Router();

/**
 * @openapi
 * /api/resources:
 *   post:
 *     summary: Tạo mới resource tài nguyên
 *     description: Tạo một tài nguyên bookmark mới trong hệ thống. Dữ liệu được kiểm tra bằng Joi Middleware.
 *     tags:
 *       - Resources
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResourceInput'
 *     responses:
 *       201:
 *         description: Tạo resource thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Dữ liệu không hợp lệ (Validation Failure)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       500:
 *         description: Lỗi hệ thống server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", validateResource, resourceController.create);

/**
 * @openapi
 * /api/resources:
 *   get:
 *     summary: Lấy danh sách tài nguyên (Hỗ trợ Search, Filter, Sort)
 *     description: Lấy danh sách tất cả các resource. Có thể kết hợp lọc, tìm kiếm và sắp xếp.
 *     tags:
 *       - Resources
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo từ khóa trong tiêu đề (title) hoặc tóm tắt (summary)
 *         example: react
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Frontend, Backend, DevOps, AI, Mobile, UI/UX]
 *         description: Lọc tài nguyên theo danh mục
 *         example: Frontend
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Lọc tài nguyên theo thẻ tag
 *         example: javascript
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, upvoted]
 *           default: newest
 *         description: Sắp xếp theo mới nhất (newest) hoặc lượt upvote cao nhất (upvoted)
 *         example: upvoted
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessListResponse'
 *       400:
 *         description: Category query không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Lỗi hệ thống server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", resourceController.getAll);

/**
 * @openapi
 * /api/resources/{id}:
 *   get:
 *     summary: Lấy chi tiết một tài nguyên theo ID
 *     description: Tìm và trả về thông tin chi tiết của resource theo MongoDB ObjectId.
 *     tags:
 *       - Resources
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId của resource
 *         example: 66e71234567890abcdef1234
 *     responses:
 *       200:
 *         description: Lấy chi tiết thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: ID không hợp lệ định dạng ObjectId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Không tìm thấy resource với ID tương ứng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Lỗi hệ thống server
 */
router.get("/:id", validateObjectId, resourceController.getDetail);

/**
 * @openapi
 * /api/resources/{id}:
 *   put:
 *     summary: Cập nhật thông tin tài nguyên theo ID
 *     description: Cập nhật title, url, category, tags, summary. Không cho sửa trực tiếp upvotes.
 *     tags:
 *       - Resources
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId của resource cần sửa
 *         example: 66e71234567890abcdef1234
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResourceInput'
 *     responses:
 *       200:
 *         description: Cập nhật resource thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: ID không hợp lệ hoặc Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: Không tìm thấy resource để cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Lỗi hệ thống server
 */
router.put(
  "/:id",
  validateObjectId,
  validateResource,
  resourceController.update,
);

/**
 * @openapi
 * /api/resources/{id}:
 *   delete:
 *     summary: Xóa một tài nguyên theo ID
 *     description: Xóa vĩnh viễn tài nguyên ra khỏi cơ sở dữ liệu.
 *     tags:
 *       - Resources
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId của resource cần xóa
 *         example: 66e71234567890abcdef1234
 *     responses:
 *       200:
 *         description: Xóa resource thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Xóa resource thành công
 *       400:
 *         description: ID không hợp lệ định dạng ObjectId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Không tìm thấy resource để xóa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Lỗi hệ thống server
 */
router.delete("/:id", validateObjectId, resourceController.remove);

/**
 * @openapi
 * /api/resources/{id}/upvote:
 *   patch:
 *     summary: Tăng 1 lượt bình chọn (Upvote) cho tài nguyên
 *     description: Tăng upvotes thêm 1 bằng toán tử $inc (Atomic Operation).
 *     tags:
 *       - Resources
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId của resource cần upvote
 *         example: 66e71234567890abcdef1234
 *     responses:
 *       200:
 *         description: Upvote thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpvoteSuccessResponse'
 *       400:
 *         description: ID không hợp lệ định dạng ObjectId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Không tìm thấy resource để upvote
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Lỗi hệ thống server
 */
router.patch("/:id/upvote", validateObjectId, resourceController.upvote);

export default router;
