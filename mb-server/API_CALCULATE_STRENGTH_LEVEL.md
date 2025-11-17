# API Tính Toán Strength Level

## Endpoint
```
POST /workout/calculate-strength-level
```

## Mô tả
API này giúp tính toán mức độ sức mạnh (strength level) dựa trên:
- Trọng lượng tạ đã nâng
- Số lần lặp (reps)
- Thông tin cá nhân người dùng (cân nặng, chiều cao, tuổi, giới tính)

## Thuật toán

### Bước 1: Tính 1RM (One-Rep Max)
Sử dụng công thức Brzycki:
```
1RM = weight / (1.0278 - 0.0278 × reps)
```

### Bước 2: Điều chỉnh theo tuổi
```
- Dưới 20 tuổi: × 0.95
- 20-30 tuổi: × 1.0
- 31-40 tuổi: × 0.98
- 41-50 tuổi: × 0.95
- Trên 50 tuổi: × 0.90
```

### Bước 3: Tính tỷ lệ so với cân nặng
```
strengthRatio = adjustedOneRM / bodyWeight
```

### Bước 4: Áp dụng hệ số giới tính
```
- Nam: × 1.0
- Nữ: × 1.33 (1 / 0.75)
```

### Bước 5: Xác định Level
```
- adjustedRatio < 0.5  → BEGINNER (< 50% body weight)
- adjustedRatio < 0.75 → NOVICE (50-75% body weight)
- adjustedRatio < 1.0  → INTERMEDIATE (75-100% body weight)
- adjustedRatio < 1.5  → ADVANCED (100-150% body weight)
- adjustedRatio ≥ 1.5  → GYMLORD (> 150% body weight)
```

## Request Body
```json
{
  "weight": 70,
  "reps": 8
}
```

### Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| weight | number | Yes | Trọng lượng tạ (kg) |
| reps | number | Yes | Số lần lặp |

## Response
```json
{
  "status": "success",
  "message": "Tính toán strength level thành công!",
  "data": {
    "level": "novice",
    "estimatedOneRM": 86.9,
    "adjustedOneRM": 88.4,
    "strengthRatio": 1.04,
    "percentileByAge": 39,
    "percentileByWeight": 30,
    "details": {
      "weight": 70,
      "reps": 8,
      "bodyWeight": 85,
      "age": 21,
      "gender": "male"
    }
  }
}
```

### Response Fields
| Field | Type | Description |
|-------|------|-------------|
| level | string | Mức độ sức mạnh (beginner, novice, intermediate, advanced, gymlord) |
| estimatedOneRM | number | 1RM ước tính (kg) |
| adjustedOneRM | number | 1RM đã điều chỉnh theo tuổi (kg) |
| strengthRatio | number | Tỷ lệ so với cân nặng cơ thể |
| percentileByAge | number | Phần trăm so với người cùng độ tuổi (ước tính) |
| percentileByWeight | number | Phần trăm so với người cùng hạng cân (ước tính) |
| details | object | Chi tiết tính toán |

## Ví dụ sử dụng

### Example 1: Người mới tập
**Request:**
```bash
curl -X POST https://api.example.com/workout/calculate-strength-level \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "weight": 30,
    "reps": 10
  }'
```

**Response:**
```json
{
  "data": {
    "level": "beginner",
    "estimatedOneRM": 40.1,
    "adjustedOneRM": 40.1,
    "strengthRatio": 0.47,
    "percentileByAge": 24,
    "percentileByWeight": 19
  }
}
```

### Example 2: Người tập trung cấp
**Request:**
```bash
curl -X POST https://api.example.com/workout/calculate-strength-level \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "weight": 70,
    "reps": 8
  }'
```

**Response:**
```json
{
  "data": {
    "level": "novice",
    "estimatedOneRM": 86.9,
    "adjustedOneRM": 88.4,
    "strengthRatio": 1.04,
    "percentileByAge": 39,
    "percentileByWeight": 30
  }
}
```

### Example 3: Người tập nâng cao
**Request:**
```bash
curl -X POST https://api.example.com/workout/calculate-strength-level \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "weight": 120,
    "reps": 5
  }'
```

**Response:**
```json
{
  "data": {
    "level": "advanced",
    "estimatedOneRM": 135.3,
    "adjustedOneRM": 135.3,
    "strengthRatio": 1.59,
    "percentileByAge": 80,
    "percentileByWeight": 64
  }
}
```

## Error Responses

### 400 Bad Request - Thiếu thông tin cá nhân
```json
{
  "status": "error",
  "message": "Vui lòng cập nhật thông tin cá nhân trước!",
  "statusCode": 400
}
```

### 400 Bad Request - Validation Error
```json
{
  "status": "error",
  "message": [
    "Vui lòng nhập trọng lượng!",
    "Trọng lượng phải là số!"
  ],
  "statusCode": 400
}
```

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Unauthorized",
  "statusCode": 401
}
```

## Notes

- Người dùng phải cập nhật đầy đủ thông tin cá nhân (cân nặng, chiều cao, ngày sinh, giới tính) trước khi sử dụng API này
- Công thức Brzycki chỉ chính xác với reps từ 1-12. Với reps > 12, hệ thống sẽ trả về weight gốc
- Percentile được ước tính dựa trên công thức đơn giản, không phải từ dữ liệu thực tế
- API này hữu ích để người dùng xem trước strength level trước khi lưu bài tập

## Use Cases

1. **Preview trước khi lưu**: Người dùng có thể xem level trước khi thêm set vào workout
2. **So sánh tiến độ**: Kiểm tra xem mình đã cải thiện bao nhiêu so với trước
3. **Đặt mục tiêu**: Tính toán cần nâng bao nhiêu kg để đạt level tiếp theo
4. **Validation**: Kiểm tra xem số liệu nhập có hợp lý không

## Related APIs

- `POST /workout/exercises` - Tạo user exercise (tự động tính level)
- `PATCH /workout/exercises/:id` - Cập nhật user exercise (tính lại level)
- `GET /workout/:workoutId/exercises` - Xem danh sách exercises với level
