-----

# 🏋️ My Strength Level - Ứng dụng Quản lý Tập luyện & Sức khỏe

## 📖 Giới thiệu

**My Strength Level** là ứng dụng di động hỗ trợ người dùng xây dựng lộ trình tập luyện cá nhân hóa, quản lý lịch tập, theo dõi các chỉ số cơ thể (BMI, BMR, TDEE) và tương tác với AI Personal Trainer.

Dự án được xây dựng với mục tiêu giải quyết hạn chế của các ứng dụng hiện có (như MyFitnessPal, Nike Training Club) bằng cách tập trung sâu vào khả năng **tùy biến Template bài tập**, **lập lịch thông minh** và tích hợp **Chatbot AI** hỗ trợ kiến thức tập luyện.

Dự án là bài tập lớn môn **Phát triển Ứng dụng cho thiết bị di động** - Học viện Công nghệ Bưu chính Viễn thông (PTIT).

-----

## 🚀 Tính năng Chính

### 1\. Quản lý Người dùng & Đo lường (Health & Profile)

  * **Authentication:** Đăng ký, Đăng nhập (JWT Access/Refresh Token), Bảo mật mật khẩu (Bcrypt).
  * **Profile:** Quản lý thông tin cá nhân, cập nhật Avatar.
  * **Đo lường sức khỏe:** Tự động tính toán và đánh giá BMI (theo chuẩn WHO & Asia-Pacific), BMR (Mifflin-St Jeor) và TDEE dựa trên mức độ vận động.

### 2\. Quản lý Tập luyện (Workout & Schedule)

  * **Workout Templates:** Tạo, sửa, xóa các mẫu bài tập (Template) để tái sử dụng.
  * **Schedule (Lịch tập):** Lên kế hoạch tập luyện theo tuần, gán Template vào lịch.
  * **Tracking:** Ghi lại kết quả buổi tập (Sets, Reps, Weight), tính toán Volume tập luyện.

### 3\. Hệ thống Bài tập (Exercises)

  * **Thư viện bài tập:** Danh sách bài tập đa dạng, hỗ trợ lọc theo nhóm cơ (Muscle), dụng cụ (Equipment), độ khó (Level).
  * **Chi tiết bài tập:** Hướng dẫn tập luyện chi tiết kèm hình ảnh minh họa/GIF.

### 4\. Tính năng Nâng cao

  * **Notification System:** Hệ thống nhắc nhở lịch tập tự động (Push Notifications) sử dụng cơ chế hàng đợi (Queue).
  * **AI Chatbot:** "PT ảo" tích hợp LLM (Gemini) qua n8n workflow, hỗ trợ giải đáp thắc mắc và gợi ý bài tập.

-----

## 🛠 Công nghệ Sử dụng

### 📱 Mobile App (Frontend)

  * **Framework:** React Native (Expo SDK 52).
  * **Routing:** Expo Router (File-based routing).
  * **State Management:**
      * `Zustand`: Quản lý Global State (Auth, User Session).
      * `TanStack Query (React Query)`: Quản lý Server State, Caching, Sync.
  * **UI Library:** React Native Paper.
  * **HTTP Client:** Axios (kèm Interceptors xử lý Token).

### 🔙 Backend Server

  * **Framework:** NestJS (Modular Architecture).
  * **Language:** TypeScript.# Đảm bảo các biến môi trường cho MONGO_URI, REDIS, JWT_SECRET được thiết lập.

  * **Database:** MongoDB Replica Set (đảm bảo tính toàn vẹn dữ liệu và Transaction).
  * **ORM:** Mongoose.
  * **Queue & Cache:** Redis + BullMQ (xử lý tác vụ nền và thông báo).
  * **API Docs:** Swagger UI.

### 🤖 AI & Automation

  * **Workflow:** n8n (Docker).
  * **Model:** Google Gemini (thông qua API).

### Infrastructure

  * **Docker & Docker Compose:** Container hóa MongoDB Cluster, Redis và n8n.

-----

## 📂 Cấu trúc Dự án

Dự án được tổ chức theo mô hình Monorepo:

```bash
Mobile-BTL/
├── mb-server/           # Source code Backend (NestJS)
│   ├── src/
│   │   ├── modules/     # Các module chức năng (Auth, User, Workout, etc.)
│   │   ├── common/      # Guards, Decorators, Filters, Utils
│   │   └── notification/# Cron jobs & Queue processors
│   ├── docker-compose.yml # Cấu hình Mongo Replica Set & Redis
│   └── ...
├── mobile/              # Source code Mobile App (Expo)
│   ├── src/
│   │   ├── app/         # Expo Router Screens
│   │   ├── common/      # Components, Hooks, Stores, Services
│   │   └── screens/     # Logic chi tiết từng màn hình
│   └── ...
└── README.md
```

-----

## ⚙️ Hướng dẫn Cài đặt & Chạy Dự án

### 1\. Yêu cầu tiên quyết (Prerequisites)

  * Node.js (\>= 18.x)
  * Docker & Docker Compose
  * Expo Go (trên thiết bị di động) hoặc Android Emulator/iOS Simulator.

### 2\. Cài đặt Cơ sở dữ liệu & Hạ tầng

Dự án sử dụng MongoDB Replica Set và Redis chạy trên Docker.

```bash
cd mb-server

# Cấp quyền cho file key của Mongo (Bắt buộc để chạy Replica Set)
chmod 400 mongo-key/mongo-keyfile

# Khởi chạy các container
docker-compose up -d
```

*Lưu ý: Đợi khoảng 1-2 phút để MongoDB khởi tạo Replica Set thành công.*

### 3\. Chạy Backend (mb-server)

```bash
cd mb-server

# Cài đặt thư viện
npm install

# Tạo file .env (Copy từ .env.example nếu có hoặc cấu hình như bên dưới)
# Đảm bảo các biến môi trường cho MONGO_URI, REDIS, JWT_SECRET được thiết lập.

# Chạy server ở chế độ development
npm run dev
```

*Server sẽ chạy tại: `http://localhost:3000`*
*Swagger Docs: `http://localhost:3000/api/docs`*

### 4\. Chạy Mobile App (mobile)

```bash
cd mobile

# Cài đặt thư viện
npm install

# Tạo file .env và trỏ API_URL về địa chỉ IP mạng LAN của máy tính bạn (không dùng localhost)
# Ví dụ: EXPO_PUBLIC_API_URL=http://192.168.1.5:3000

# Khởi chạy ứng dụng
npx expo start
```

*Quét mã QR bằng ứng dụng **Expo Go** trên điện thoại để trải nghiệm.*

-----
-----

## 👥 Thành viên Thực hiện (Nhóm 02)

| Thành viên | Vai trò & Chức năng đảm nhận |
| :--- | :--- |
| **Bùi Quang Anh** | **Frontend & Backend:** Quản lý Template, Workout, Logic tính Level bài tập. Tích hợp dữ liệu hình ảnh (GIF). |
| **Nguyễn Tuấn Anh** | **Backend Lead:** Auth (JWT, Refresh Token), Schedule, Notification System (Queue/Cron), Cấu trúc Source Code. |
| **Trần Hoàng Anh** | **Frontend:** Danh sách bài tập, Bộ lọc (Filter), Chi tiết bài tập. **AI:** Tích hợp Chatbot AI. |
| **Mai Thế Dương** | **Frontend:** UI/UX Authentication (Đăng nhập/Đăng ký), UI Quản lý Template & Workout. |

-----

-----

## 📝 License
UNLICENSED.
