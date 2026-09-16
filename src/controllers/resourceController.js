import * as resourceService from "../services/resourceService.js";

/**
 * Controller: Tạo Resource mới
 * Endpoint: POST /api/resources
 */
export const create = async (req, res) => {
  try {
    const resource = await resourceService.createResource(req.body);

    res.status(201).json({
      message: "Tạo resource thành công",
      data: resource,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Lỗi server",
      error: error.message,
    });
  }
};

/**
 * Controller: Lấy danh sách Resource (Có hỗ trợ Search, Filter, Sort)
 * Endpoint: GET /api/resources
 */
export const getAll = async (req, res) => {
  try {
    const resources = await resourceService.getAllResources(req.query);

    res.status(200).json({
      message: "Lấy danh sách thành công",
      data: resources,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Lỗi server",
      error: error.message,
    });
  }
};

/**
 * Controller: Lấy chi tiết Resource theo ID
 * Endpoint: GET /api/resources/:id
 */
export const getDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await resourceService.getResourceById(id);

    if (!resource) {
      return res.status(404).json({
        message: "Không tìm thấy resource",
      });
    }

    res.status(200).json({
      message: "Lấy chi tiết thành công",
      data: resource,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Lỗi server",
      error: error.message,
    });
  }
};

/**
 * Controller: Cập nhật Resource theo ID
 * Endpoint: PUT /api/resources/:id
 */
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedResource = await resourceService.updateResource(id, req.body);

    if (!updatedResource) {
      return res.status(404).json({
        message: "Không tìm thấy resource",
      });
    }

    res.status(200).json({
      message: "Cập nhật resource thành công",
      data: updatedResource,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Lỗi server",
      error: error.message,
    });
  }
};

/**
 * Controller: Xóa Resource theo ID
 * Endpoint: DELETE /api/resources/:id
 */
export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedResource = await resourceService.deleteResource(id);

    if (!deletedResource) {
      return res.status(404).json({
        message: "Không tìm thấy resource",
      });
    }

    res.status(200).json({
      message: "Xóa resource thành công",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Lỗi server",
      error: error.message,
    });
  }
};

/**
 * Controller: Upvote Resource theo ID
 * Endpoint: PATCH /api/resources/:id/upvote
 */
export const upvote = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedResource = await resourceService.upvoteResource(id);

    if (!updatedResource) {
      return res.status(404).json({
        message: "Không tìm thấy resource",
      });
    }

    res.status(200).json({
      message: "Upvote thành công",
      data: {
        upvotes: updatedResource.upvotes,
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Lỗi server",
      error: error.message,
    });
  }
};
