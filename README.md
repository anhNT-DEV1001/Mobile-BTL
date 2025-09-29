# ỨNG DỤNG THỂ DỤC TẠI NHÀ

---

## 1. Giới thiệu tổng quan

**Ứng dụng "Thể dục tại nhà"** được thiết kế để cung cấp một nền tảng toàn diện, giúp người dùng rèn luyện sức khỏe hiệu quả ngay tại nhà hoặc phòng gym. Với mục tiêu cá nhân hóa và tiện lợi, ứng dụng này tích hợp các tính năng cốt lõi bao gồm: tìm kiếm và tham khảo bài tập, xem video hướng dẫn, theo dõi tiến độ cá nhân, và tạo lịch tập đơn giản.

---

## 2. Mục tiêu dự án

Mục tiêu chính của dự án là xây dựng một ứng dụng di động mạnh mẽ và thân thiện với người dùng. Các mục tiêu cụ thể bao gồm:

* **Tìm kiếm & tham khảo bài tập:** Giúp người dùng dễ dàng tìm kiếm các bài tập phù hợp với mục tiêu của họ (tăng cơ, giảm cân, yoga, cardio).
* **Hướng dẫn video:** Cung cấp video chất lượng cao và mô tả chi tiết, giúp người dùng thực hiện đúng kỹ thuật và tránh chấn thương.
* **Theo dõi tiến độ:** Hỗ trợ người dùng ghi lại và theo dõi quá trình tập luyện qua nhật ký và biểu đồ thống kê trực quan.
* **Tạo kế hoạch:** Cho phép người dùng tự tạo và quản lý các kế hoạch tập luyện cá nhân, giúp duy trì sự kỷ luật.

---

## 3. Đối tượng sử dụng

Ứng dụng hướng tới những người muốn duy trì lối sống lành mạnh và chủ động rèn luyện thể chất, đặc biệt là:

* Nam và nữ trong độ tuổi **18-40**.
* Những người có lịch trình bận rộn, ưu tiên tập luyện tại nhà.
* Người mới bắt đầu (**beginner**) và có kinh nghiệm trung cấp (**intermediate**).

---

## 4. Công nghệ sử dụng

Dự án được xây dựng trên một ngăn xếp công nghệ hiện đại, đảm bảo hiệu suất và khả năng mở rộng:

* **Frontend:** **React Native** (iOS và Android) để xây dựng giao diện người dùng.
* **Backend:** **NestJS** (Node.js) để xử lý logic phía máy chủ.
* **Database:** **MongoDB** với Replica Set để lưu trữ dữ liệu một cách an toàn và có khả năng chịu lỗi.

---

## 5. Các chức năng cốt lõi

Đây là các tính năng bắt buộc để ứng dụng có thể hoạt động đầy đủ và đáp ứng nhu cầu cơ bản của người dùng:

### 5.1. Đăng nhập và bảo mật

* **Đăng ký tài khoản:** Bằng email.
* **Đăng nhập:** Bằng email và mật khẩu.
* **Bảo mật:** Sử dụng **JWT** và **refresh token** để bảo vệ dữ liệu người dùng.

### 5.2. Danh sách bài tập

* **Danh mục bài tập:** Phân loại theo mục tiêu (**Tăng cơ**, **Giảm cân**, **Yoga**, **Cardio**).
* **Tìm kiếm:** Cho phép tìm bài tập theo tên.
* **Thông tin chi tiết:** Hiển thị mô tả, độ khó, số lần lặp lại (reps), và thời gian.

### 5.3. Hướng dẫn video

* **Video hướng dẫn:** Xem video trực tiếp trong ứng dụng.
* **Mô tả:** Có kèm theo hướng dẫn bằng văn bản và lưu ý từ huấn luyện viên.
* **Yêu thích:** Lưu các bài tập ưa thích vào danh sách cá nhân.

### 5.4. Theo dõi tiến độ

* **Ghi lại buổi tập:** Nhật ký ghi lại ngày, số reps, set, và thời gian.
* **Lịch sử:** Hiển thị lịch sử luyện tập chi tiết.
* **Thống kê:** Biểu đồ thống kê tiến độ theo tuần và tháng.

### 5.5. Tùy chỉnh kế hoạch tập luyện

* **Tạo kế hoạch:** Tự tạo lịch tập bằng cách chọn và sắp xếp các bài tập yêu thích.
* **Chỉnh sửa/Xóa:** Dễ dàng thay đổi hoặc xóa kế hoạch đã tạo.
* **Áp dụng kế hoạch:** Kích hoạt kế hoạch để bắt đầu theo dõi.

### 5.6. Nhắc nhở lịch tập

* **Đặt giờ nhắc nhở:** Người dùng có thể tùy chỉnh thời gian nhận thông báo.
* **Thông báo đẩy:** Gửi thông báo trực tiếp đến thiết bị di động (push notification).
* **Bật/Tắt:** Cho phép người dùng quản lý chế độ nhắc nhở.

---

## 6. Phân quyền cơ bản

Hệ thống sẽ có hai loại người dùng chính:

* **Admin:** Quản lý toàn bộ thông tin của ứng dụng như thêm/sửa/xóa bài tập, danh mục bài tập, v.v.
* **User:** Sử dụng các chức năng cá nhân để theo dõi và cải thiện quá trình tập luyện của mình.

- thiết kế tăng dần theo level



























































































































































































