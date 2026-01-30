# 📱 Hướng Dẫn Build APK - W2W Movies Mobile

## 🚀 Cách Build APK Nhanh Nhất (15-20 phút)

### Bước 1: Tạo EAS Project
```bash
eas init
```
- Khi hỏi: `Would you like to create a project for @caoviethung/w2w-movies-mobile?`
- **Nhấn `Y` và Enter**
- Project ID sẽ tự động được thêm vào `app.json`

### Bước 2: Build APK
```bash
eas build --platform android --profile preview
```
- Chọn: `Generate a new Android Keystore` (nhấn Enter)
- Build sẽ chạy trên cloud của Expo
- Thời gian: 15-20 phút

### Bước 3: Tải APK
- Sau khi build xong, terminal sẽ hiện link download
- Hoặc vào: https://expo.dev/accounts/caoviethung/projects/w2w-movies-mobile/builds
- Tải file APK và cài trực tiếp lên điện thoại

---

## 🏭 Cách Build Production (cho Google Play Store)

### Build AAB File
```bash
eas build --platform android --profile production
```
- File AAB này dùng để submit lên Google Play Store
- Cần tạo Google Play Developer Account ($25 one-time fee)

---

## 📝 EAS Build Profiles (đã config sẵn trong eas.json)

### Preview (APK - Test nhanh)
- Buildable type: APK
- Development client: false
- Không cần Google Play Console

### Production (AAB - Release)
- Buildable type: AAB
- Auto-increment version code
- Tối ưu cho production

---

## ⚡ Build Local (Không cần EAS account)

Nếu muốn build trên máy của bạn (nhanh hơn nhưng phức tạp):

### Yêu cầu:
- Android Studio đã cài đặt
- Android SDK & Build Tools
- JDK 17

### Lệnh build:
```bash
# Pre-build
npx expo prebuild --platform android

# Build APK
cd android
./gradlew assembleRelease

# File APK tạo ra ở:
# android/app/build/outputs/apk/release/app-release.apk
```

---

## 🔑 Signing APK (Nếu build local)

### Tạo keystore:
```bash
keytool -genkey -v -keystore w2w-movies.keystore \
  -alias w2w-movies -keyalg RSA -keysize 2048 -validity 10000
```

### Config trong `android/gradle.properties`:
```properties
MYAPP_UPLOAD_STORE_FILE=w2w-movies.keystore
MYAPP_UPLOAD_KEY_ALIAS=w2w-movies
MYAPP_UPLOAD_STORE_PASSWORD=yourpassword
MYAPP_UPLOAD_KEY_PASSWORD=yourpassword
```

---

## 🎯 KHUYẾN NGHỊ

**Dùng EAS Build (Cloud)** vì:
- ✅ Không cần setup Android Studio
- ✅ Tự động sign APK/AAB
- ✅ Build trên cloud (không tốn tài nguyên máy)
- ✅ Free cho open-source projects
- ✅ Quản lý build history

**Chỉ build local nếu:**
- ❌ Không có internet ổn định
- ❌ Cần build offline
- ❌ Muốn custom native code nhiều

---

## 📊 EAS Build Commands Summary

| Command | Description | Output |
|---------|-------------|--------|
| `eas build -p android --profile preview` | Build APK test | .apk |
| `eas build -p android --profile production` | Build AAB release | .aab |
| `eas build -p ios --profile preview` | Build iOS test | Simulator build |
| `eas build -p ios --profile production` | Build iOS release | App Store build |

---

## 🐛 Troubleshooting

### Lỗi: "Invalid UUID appId"
**Fix:** Xóa `extra.eas.projectId` trong `app.json` và chạy lại `eas init`

### Lỗi: "Build failed"
**Check:** 
1. `eas build:view` để xem logs chi tiết
2. Kiểm tra `app.json` và `eas.json` config
3. Đảm bảo package.json không có dependency lỗi

### Lỗi: "Keystore not found"
**Fix:** Chọn "Generate a new Android Keystore" khi build lần đầu

---

## 🎉 Sau Khi Build Xong

### APK File:
1. Tải về điện thoại Android
2. Bật "Install from Unknown Sources"
3. Cài đặt APK
4. Test app

### AAB File (Production):
1. Upload lên Google Play Console
2. Chờ Google review (2-3 ngày)
3. Publish app lên Store

---

## 📞 Support

- EAS Docs: https://docs.expo.dev/build/introduction/
- Build Status: https://expo.dev/accounts/caoviethung/projects/w2w-movies-mobile/builds
- Expo Forums: https://forums.expo.dev/
