# 📚 DEV PULSE – API Integration Guide For Frontend

Tài liệu hướng dẫn chi tiết toàn bộ **REST API Routes**, **Request Payloads**, **Query Parameters**, **Responses**, **TypeScript Interfaces** và **Mã nguồn gọi API mẫu** cho Frontend tích hợp vào Backend DevPulse.

---

## 🌐 1. Thông Tin Chung (General Information)

- **Base URL (Local)**: `http://localhost:3001`
- **Base URL (Production/Cloud)**: `https://devpulse-w7o8.onrender.com` (hoặc URL server thực tế của bạn)
- **Content-Type**: `application/json`
- **Interactive Swagger UI**: `http://localhost:3001/api-docs`

---

## 📋 2. TypeScript Interfaces (Types Dành Cho Frontend)

```typescript
// 1. Danh mục tài nguyên hợp lệ
export type Category =
  | "Frontend"
  | "Backend"
  | "DevOps"
  | "AI"
  | "Mobile"
  | "UI/UX";

// 2. Kiểu sắp xếp danh sách
export type SortOption = "newest" | "upvoted";

// 3. Đối tượng Resource hoàn chỉnh từ API
export interface Resource {
  _id: string;
  title: string;
  url: string;
  category: Category;
  tags: string[];
  summary?: string;
  codeSnippet?: string;
  upvotes: number;
  createdAt: string; // ISO 8601 Date
  updatedAt: string; // ISO 8601 Date
}

// 4. Payload gửi lên khi tạo mới (POST) hoặc cập nhật (PUT)
export interface ResourceInput {
  title: string;
  url: string;
  category: Category;
  tags: string[];
  summary?: string;
  codeSnippet?: string;
}

// 5. Query parameters khi gọi API GET danh sách
export interface GetResourcesParams {
  search?: string;
  category?: Category;
  tag?: string;
  sort?: SortOption;
}

// 6. Cấu trúc Response chuẩn thành công (Single Item)
export interface ApiResponse<T = Resource> {
  message: string;
  data: T;
}

// 7. Cấu trúc Response chuẩn thành công (List Items)
export interface ApiListResponse<T = Resource> {
  message: string;
  data: T[];
}

// 8. Cấu trúc Response khi Upvote thành công
export interface UpvoteResponse {
  message: string;
  data: {
    upvotes: number;
  };
}

// 9. Cấu trúc Response khi xóa thành công
export interface DeleteResponse {
  message: string;
}

// 10. Cấu trúc Response khi gặp lỗi Validation (400)
export interface ValidationErrorResponse {
  message: string; // "Dữ liệu không hợp lệ"
  errors: string[]; // Danh sách chi tiết lỗi
}

// 11. Cấu trúc Response lỗi thông thường (400, 404, 500)
export interface ErrorResponse {
  message: string;
  error?: string;
}
```

---

## 🛡️ 3. Quy Tắc Validation (Input Validation Rules)

Áp dụng cho Request Body của **POST `/api/resources`** và **PUT `/api/resources/:id`**:

| Trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc & Quy tắc |
| :--- | :--- | :---: | :--- |
| `title` | `string` | **Có** | Từ `3` đến `100` ký tự. Tự động cắt khoảng trắng đầu/cuối (`trim`). Không để trống. |
| `url` | `string` | **Có** | Phải là định dạng URL hợp lệ (VD: `https://react.dev`). |
| `category` | `string` | **Có** | Phải thuộc 1 trong 6 danh mục: `"Frontend"`, `"Backend"`, `"DevOps"`, `"AI"`, `"Mobile"`, `"UI/UX"`. |
| `tags` | `string[]` | **Có** | Mảng từ `1` đến `5` phần tử. Mỗi phần tử tối đa `20` ký tự, chỉ chứa chữ và số (`/^[a-zA-Z0-9]+$/`), tự động chuyển thành chữ thường (`lowercase`). |
| `summary` | `string` | Không | Tối đa `300` ký tự. Có thể để chuỗi rỗng `""` hoặc bỏ qua. |
| `codeSnippet` | `string` | Không | Đoạn mã nguồn minh họa (Code Snippet). Có thể để chuỗi rỗng `""` hoặc bỏ qua. |

> ⚠️ **Lưu ý quan trọng**:
> - Trường `upvotes` do server tự quản lý, client **không** gửi `upvotes` trong body khi `POST` hoặc `PUT`.
> - ID trong URL của các route `/:id` phải là một **MongoDB ObjectId** 24 ký tự hex hợp lệ.

---

## 🚀 4. Chi Tiết Toàn Bộ Endpoints (API Endpoints)

### 📌 Bảng tổng quan (Overview)

| Method | Endpoint | Mô tả chức năng | Request Body | Status Codes |
| :--- | :--- | :--- | :---: | :---: |
| `GET` | `/` | Kiểm tra trạng thái máy chủ (Health check) | Không | `200` |
| `POST` | `/api/resources` | Tạo mới một tài nguyên | Có (`ResourceInput`) | `201`, `400`, `500` |
| `GET` | `/api/resources` | Lấy danh sách (kèm search, filter, sort) | Không | `200`, `400`, `500` |
| `GET` | `/api/resources/:id` | Lấy chi tiết tài nguyên theo ID | Không | `200`, `400`, `404`, `500` |
| `PUT` | `/api/resources/:id` | Cập nhật thông tin tài nguyên theo ID | Có (`ResourceInput`) | `200`, `400`, `404`, `500` |
| `DELETE` | `/api/resources/:id` | Xóa tài nguyên theo ID | Không | `200`, `400`, `404`, `500` |
| `PATCH` | `/api/resources/:id/upvote` | Tăng 1 lượt Upvote cho tài nguyên | Không | `200`, `400`, `404`, `500` |

---

### 1. Health Check (Kiểm tra máy chủ)

- **Method**: `GET`
- **URL**: `/`
- **Auth**: Public

#### 📤 Response `200 OK`
```json
{
  "message": "🚀 DEV PULSE API Server đang hoạt động!",
  "swaggerUI": "http://localhost:3001/api-docs"
}
```

---

### 2. Tạo Mới Tài Nguyên (Create Resource)

- **Method**: `POST`
- **URL**: `/api/resources`
- **Headers**: `Content-Type: application/json`

#### 📥 Request Body (Payload)
```json
{
  "title": "React Documentation",
  "url": "https://react.dev",
  "category": "Frontend",
  "tags": ["react", "javascript", "frontend"],
  "summary": "Tài liệu chính thức của thư viện React",
  "codeSnippet": "import { useState } from 'react';\n\nfunction App() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;\n}\nexport default App;"
}
```

#### 📤 Responses

- **Status `201 Created` (Thành công)**:
```json
{
  "message": "Tạo resource thành công",
  "data": {
    "_id": "66ea10a8b9c1d2e3f4567890",
    "title": "React Documentation",
    "url": "https://react.dev",
    "category": "Frontend",
    "tags": ["react", "javascript", "frontend"],
    "summary": "Tài liệu chính thức của thư viện React",
    "codeSnippet": "import { useState } from 'react';\n\nfunction App() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;\n}\nexport default App;",
    "upvotes": 0,
    "createdAt": "2026-09-17T06:15:00.000Z",
    "updatedAt": "2026-09-17T06:15:00.000Z"
  }
}
```

- **Status `400 Bad Request` (Dữ liệu không hợp lệ)**:
```json
{
  "message": "Dữ liệu không hợp lệ",
  "errors": [
    "Title phải có ít nhất 3 ký tự",
    "URL phải là một liên kết hợp lệ (vd: https://example.com)",
    "Category chỉ cho phép: Frontend, Backend, DevOps, AI, Mobile, UI/UX",
    "Bắt buộc có tối thiểu 1 tag"
  ]
}
```

- **Status `500 Internal Server Error`**:
```json
{
  "message": "Lỗi server",
  "error": "Error details message"
}
```

---

### 3. Lấy Danh Sách Tài Nguyên (Get All Resources)

- **Method**: `GET`
- **URL**: `/api/resources`

#### 📥 Query Parameters (Tùy chọn)

| Parameter | Type | Default | Example | Mô tả |
| :--- | :--- | :---: | :--- | :--- |
| `search` | `string` | _None_ | `react` | Tìm kiếm không phân biệt hoa/thường theo `title` hoặc `summary`. |
| `category` | `string` | _None_ | `Frontend` | Lọc chính xác theo danh mục (`Frontend`, `Backend`, `DevOps`, `AI`, `Mobile`, `UI/UX`). |
| `tag` | `string` | _None_ | `javascript` | Lọc theo 1 thẻ tag (tự động chuyển thành chữ thường khi tìm). |
| `sort` | `string` | `newest` | `upvoted` | Sắp xếp: `newest` (mới nhất) hoặc `upvoted` (lượt upvote cao nhất). |

**Ví dụ URL đầy đủ**:
`GET /api/resources?search=react&category=Frontend&tag=javascript&sort=upvoted`

#### 📤 Responses

- **Status `200 OK` (Thành công)**:
```json
{
  "message": "Lấy danh sách thành công",
  "data": [
    {
      "_id": "66ea10a8b9c1d2e3f4567890",
      "title": "React Documentation",
      "url": "https://react.dev",
      "category": "Frontend",
      "tags": ["react", "javascript", "frontend"],
      "summary": "Tài liệu chính thức của thư viện React",
      "codeSnippet": "console.log('React 19');",
      "upvotes": 25,
      "createdAt": "2026-09-17T06:15:00.000Z",
      "updatedAt": "2026-09-17T06:20:00.000Z"
    }
  ]
}
```

- **Status `400 Bad Request` (Category không hợp lệ)**:
```json
{
  "message": "Category không hợp lệ. Chỉ chấp nhận: Frontend, Backend, DevOps, AI, Mobile, UI/UX",
  "error": "Category không hợp lệ. Chỉ chấp nhận: Frontend, Backend, DevOps, AI, Mobile, UI/UX"
}
```

---

### 4. Lấy Chi Tiết Tài Nguyên (Get Detail By ID)

- **Method**: `GET`
- **URL**: `/api/resources/:id`

#### 📥 Path Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `id` | `string` | **Có** | MongoDB ObjectId (24 hex characters) |

#### 📤 Responses

- **Status `200 OK` (Thành công)**:
```json
{
  "message": "Lấy chi tiết thành công",
  "data": {
    "_id": "66ea10a8b9c1d2e3f4567890",
    "title": "React Documentation",
    "url": "https://react.dev",
    "category": "Frontend",
    "tags": ["react", "javascript", "frontend"],
    "summary": "Tài liệu chính thức của thư viện React",
    "codeSnippet": "console.log('React 19');",
    "upvotes": 25,
    "createdAt": "2026-09-17T06:15:00.000Z",
    "updatedAt": "2026-09-17T06:20:00.000Z"
  }
}
```

- **Status `400 Bad Request` (ID sai định dạng)**:
```json
{
  "message": "ID không hợp lệ"
}
```

- **Status `404 Not Found` (Không tìm thấy tài nguyên)**:
```json
{
  "message": "Không tìm thấy resource"
}
```

---

### 5. Cập Nhật Tài Nguyên (Update Resource)

- **Method**: `PUT`
- **URL**: `/api/resources/:id`
- **Headers**: `Content-Type: application/json`

#### 📥 Path Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `id` | `string` | **Có** | MongoDB ObjectId của tài nguyên cần sửa |

#### 📥 Request Body (Payload)
```json
{
  "title": "React Documentation (Cập nhật 2026)",
  "url": "https://react.dev",
  "category": "Frontend",
  "tags": ["react", "javascript", "codex"],
  "summary": "cháy khu vực lớn",
  "codeSnippet": "// dán hoặc chỉnh sửa mã nguồn minh họa tại đây...\nimport React from 'react';"
}
```

#### 📤 Responses

- **Status `200 OK` (Cập nhật thành công)**:
```json
{
  "message": "Cập nhật resource thành công",
  "data": {
    "_id": "66ea10a8b9c1d2e3f4567890",
    "title": "React Documentation (Cập nhật 2026)",
    "url": "https://react.dev",
    "category": "Frontend",
    "tags": ["react", "javascript", "codex"],
    "summary": "cháy khu vực lớn",
    "codeSnippet": "// dán hoặc chỉnh sửa mã nguồn minh họa tại đây...\nimport React from 'react';",
    "upvotes": 25,
    "createdAt": "2026-09-17T06:15:00.000Z",
    "updatedAt": "2026-09-17T06:30:00.000Z"
  }
}
```

- **Status `400 Bad Request` (ID không hợp lệ hoặc dữ liệu Body vi phạm validation)**:
```json
{
  "message": "Dữ liệu không hợp lệ",
  "errors": ["Title phải có ít nhất 3 ký tự"]
}
```

- **Status `404 Not Found` (Không tìm thấy tài nguyên để cập nhật)**:
```json
{
  "message": "Không tìm thấy resource"
}
```

---

### 6. Xóa Tài Nguyên (Delete Resource)

- **Method**: `DELETE`
- **URL**: `/api/resources/:id`

#### 📥 Path Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `id` | `string` | **Có** | MongoDB ObjectId của tài nguyên cần xóa |

#### 📤 Responses

- **Status `200 OK` (Xóa thành công)**:
```json
{
  "message": "Xóa resource thành công"
}
```

- **Status `400 Bad Request` (ID sai định dạng)**:
```json
{
  "message": "ID không hợp lệ"
}
```

- **Status `404 Not Found` (Không tìm thấy tài nguyên)**:
```json
{
  "message": "Không tìm thấy resource"
}
```

---

### 7. Upvote Tài Nguyên (Upvote Resource)

- **Method**: `PATCH`
- **URL**: `/api/resources/:id/upvote`

> ℹ️ API này thực hiện tăng số lượng `upvotes` lên 1 bằng Atomic Operation `$inc`, bảo đảm dữ liệu chính xác khi có nhiều người cùng vote.

#### 📥 Path Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `id` | `string` | **Có** | MongoDB ObjectId của tài nguyên cần upvote |

#### 📥 Request Body
_Không cần truyền body._

#### 📤 Responses

- **Status `200 OK` (Upvote thành công)**:
```json
{
  "message": "Upvote thành công",
  "data": {
    "upvotes": 26
  }
}
```

- **Status `400 Bad Request` (ID không hợp lệ)**:
```json
{
  "message": "ID không hợp lệ"
}
```

- **Status `404 Not Found` (Không tìm thấy tài nguyên)**:
```json
{
  "message": "Không tìm thấy resource"
}
```

---

## 💻 5. Frontend API Client Code Mẫu (React / TypeScript / Axios / Fetch)

### 🔹 Cách 1: Sử dụng Axios Module (`api/resourceApi.ts`)

```typescript
import axios from "axios";
import type {
  Resource,
  ResourceInput,
  GetResourcesParams,
  ApiResponse,
  ApiListResponse,
  UpvoteResponse,
  DeleteResponse,
} from "./types";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001/api/resources",
  headers: {
    "Content-Type": "application/json",
  },
});

export const resourceApi = {
  // 1. Lấy danh sách tài nguyên
  getAll: async (params?: GetResourcesParams) => {
    const res = await apiClient.get<ApiListResponse<Resource>>("/", { params });
    return res.data;
  },

  // 2. Lấy chi tiết tài nguyên
  getById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<Resource>>(`/${id}`);
    return res.data;
  },

  // 3. Tạo mới tài nguyên
  create: async (data: ResourceInput) => {
    const res = await apiClient.post<ApiResponse<Resource>>("/", data);
    return res.data;
  },

  // 4. Cập nhật tài nguyên
  update: async (id: string, data: ResourceInput) => {
    const res = await apiClient.put<ApiResponse<Resource>>(`/${id}`, data);
    return res.data;
  },

  // 5. Xóa tài nguyên
  delete: async (id: string) => {
    const res = await apiClient.delete<DeleteResponse>(`/${id}`);
    return res.data;
  },

  // 6. Upvote tài nguyên
  upvote: async (id: string) => {
    const res = await apiClient.patch<UpvoteResponse>(`/${id}/upvote`);
    return res.data;
  },
};
```

---

### 🔹 Cách 2: Sử dụng Fetch API tiêu chuẩn (Native Fetch)

```typescript
const BASE_URL = "http://localhost:3001/api/resources";

// Hàm hỗ trợ gửi request và xử lý lỗi
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.errors ? data.errors.join(", ") : data.message || "Đã có lỗi xảy ra";
    throw new Error(errorMessage);
  }

  return data as T;
}

// 1. Lấy danh sách
export function getResources(query?: { search?: string; category?: string; tag?: string; sort?: string }) {
  const params = new URLSearchParams(query as Record<string, string>).toString();
  return request<{ message: string; data: Resource[] }>(params ? `/?${params}` : "/");
}

// 2. Tạo mới tài nguyên
export function createResource(payload: ResourceInput) {
  return request<{ message: string; data: Resource }>("/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// 3. Cập nhật tài nguyên
export function updateResource(id: string, payload: ResourceInput) {
  return request<{ message: string; data: Resource }>(`/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// 4. Xóa tài nguyên
export function deleteResource(id: string) {
  return request<{ message: string }>(`/${id}`, {
    method: "DELETE",
  });
}

// 5. Upvote
export function upvoteResource(id: string) {
  return request<{ message: string; data: { upvotes: number } }>(`/${id}/upvote`, {
    method: "PATCH",
  });
}
```
