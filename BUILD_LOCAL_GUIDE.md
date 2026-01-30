# Build Local Guide - Không cần Expo Account

## 🚀 Build APK trực tiếp trên máy (Không cần EAS)

### Option 1: Dùng Expo Prebuild + Android Studio

#### Bước 1: Generate native Android code
```bash
cd /Users/viethung-phenikaax/Desktop/phenikaaX/w2w-movies-mobile
npx expo prebuild --platform android
```

#### Bước 2: Build APK
```bash
cd android
./gradlew assembleRelease
```

**Kết quả:** APK file tại `android/app/build/outputs/apk/release/app-release.apk`

---

### Option 2: Dùng Expo Export (Web-like)

#### Bước 1: Export app
```bash
npx expo export --platform android
```

#### Bước 2: Tạo APK từ export
```bash
npx eas-cli build --platform android --local --non-interactive
```

---

### Option 3: Dùng React Native CLI

#### Bước 1: Init project
```bash
npx react-native init W2WMovies
# Copy code từ src/ vào project mới
```

#### Bước 2: Build
```bash
cd android
./gradlew assembleRelease
```

---

## ⚡ FASTEST: Dùng Expo Go để test (Không cần build)

Nếu chỉ muốn test app, không cần build APK:

```bash
# 1. Start Expo
npm start

# 2. Cài Expo Go app trên điện thoại
# 3. Scan QR code
```

**Ưu điểm:**
- ✅ Không cần build
- ✅ Không cần account
- ✅ Update real-time
- ✅ Test ngay lập tức

**Nhược điểm:**
- ❌ Phải có Expo Go app
- ❌ Không phải standalone app

---

## 🎯 Recommendation

**Nếu muốn test:** Dùng Expo Go (đang chạy rồi!)

**Nếu muốn APK file để share:** 
1. Tạo Expo account mới (miễn phí)
2. Build qua EAS (dễ nhất)

---

## 📱 Steps để tạo Expo Account mới

```bash
# 1. Truy cập
https://expo.dev/signup

# 2. Hoặc dùng CLI
eas register

# 3. Login
eas login
```

Sau đó build:
```bash
npm run build:apk
```

---

Bạn muốn cách nào?
- **A**: Build local (phức tạp, cần Android Studio)
- **B**: Tạo Expo account mới và build qua EAS (dễ, recommend)
- **C**: Test qua Expo Go (đang chạy sẵn)
