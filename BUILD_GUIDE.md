# Build Guide - W2W Movies Mobile

## 📱 Hướng dẫn Build App

### Chuẩn bị

1. **Cài đặt EAS CLI** (nếu chưa có):
```bash
npm install -g eas-cli
```

2. **Đăng nhập Expo**:
```bash
eas login
```

3. **Configure project**:
```bash
eas build:configure
```

---

## 🔨 Build Options

### 1. **Build APK để Test (Nhanh nhất)** ⚡

Build APK file có thể cài trực tiếp lên Android (không cần Google Play):

```bash
npm run build:apk
```

**Hoặc:**
```bash
eas build -p android --profile preview
```

**Kết quả:** File `.apk` (~50-80MB) tải về và cài trực tiếp lên điện thoại

---

### 2. **Build Production Android** 📦

Build file AAB để upload lên Google Play Store:

```bash
npm run build:android
```

**Hoặc:**
```bash
eas build --platform android --profile production
```

**Kết quả:** File `.aab` (Android App Bundle) để submit lên store

---

### 3. **Build iOS** 🍎

Build cho iPhone/iPad (cần Apple Developer Account):

```bash
npm run build:ios
```

**Hoặc:**
```bash
eas build --platform ios --profile production
```

**Yêu cầu:**
- Apple Developer Account ($99/năm)
- Certificates & Provisioning Profiles

---

### 4. **Build cả Android và iOS** 🚀

```bash
npm run build:all
```

---

### 5. **Build Local** (Trên máy của bạn)

Nếu muốn build trên máy thay vì cloud:

```bash
npm run build:android:local
```

**Yêu cầu:**
- Android Studio đã cài đặt
- Java JDK
- Android SDK

---

## 📥 Sau khi Build xong

### Android APK:
1. EAS sẽ cho link download file `.apk`
2. Tải về điện thoại
3. Mở file và cài đặt (cần bật "Cài đặt từ nguồn không xác định")

### Android AAB (Production):
1. Upload file `.aab` lên Google Play Console
2. Tạo release mới
3. Google Play sẽ tự động tạo APK cho từng thiết bị

### iOS:
1. Submit lên App Store Connect
2. Chờ Apple review (1-3 ngày)

---

## 🎯 Recommended: Build APK để Test

Nếu bạn chỉ muốn test app, chọn option **Build APK**:

```bash
npm run build:apk
```

**Ưu điểm:**
- ✅ Nhanh nhất (15-20 phút)
- ✅ Không cần account developer
- ✅ Cài trực tiếp lên điện thoại
- ✅ Share cho người khác test dễ dàng

---

## 🔧 Troubleshooting

### Lỗi "No project ID"
```bash
eas init
```

### Lỗi credentials
```bash
eas credentials
```

### Build failed
- Check terminal logs
- Đảm bảo `app.json` đúng format
- Kiểm tra `eas.json` profile

---

## 📊 Build Status

Theo dõi build tại: https://expo.dev/accounts/[your-account]/projects/w2w-movies-mobile/builds

---

## 💡 Tips

1. **First time build:** Có thể mất 20-30 phút
2. **Next builds:** Nhanh hơn nhờ cache (10-15 phút)
3. **APK size:** Khoảng 50-80MB
4. **AAB size:** Nhỏ hơn APK (~30-50MB)

---

## 🚀 Quick Start (Recommended)

**Để build APK ngay:**

```bash
# 1. Login
eas login

# 2. Init project
eas build:configure

# 3. Build APK
npm run build:apk
```

Sau 15-20 phút sẽ có link download APK! 🎉
