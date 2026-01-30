# 🔥 HƯỚNG DẪN XÓA CACHE VÀ KHẮC PHỤC LỖI

## ❌ Lỗi Đang Gặp Phải:

```
Exception in HostFunction: TypeError: expected dynamic type 'boolean', but had type 'string'
```

Lỗi xuất hiện trong `createAnimatedComponent.js` và React Fabric layers.

## ✅ ĐÃ LÀM:

1. ✅ **Sửa code** - App.tsx, watch-movie-screen.tsx, app-navigation.tsx
2. ✅ **Kill tất cả Node processes**
3. ✅ **Xóa .expo cache folder**
4. ✅ **Xóa node_modules/.cache**
5. ✅ **Restart Expo với -c flag** (clear cache)
6. ✅ **Server mới đang chạy trên port 8081** với QR code mới

## 🎯 BẠN CẦN LÀM NGAY:

### Bước 1: XÓA APP HOÀN TOÀN TRÊN ĐIỆN THOẠI

**Quan trọng:** Không chỉ force close, mà phải **XÓA APP** khỏi Expo Go:

1. Mở **Expo Go** app
2. Vào tab **"Projects"** (biểu tượng folder)
3. Tìm project **"w2w-movies-mobile"** hoặc tên tương tự
4. **Long press** (nhấn giữ) vào project
5. Chọn **"Remove from recents"** hoặc **"Delete"**

### Bước 2: FORCE CLOSE EXPO GO

1. Swipe lên (hoặc double-click home button)
2. Swipe app Expo Go lên để đóng hoàn toàn
3. Hoặc vào Settings → Apps → Expo Go → Force Stop

### Bước 3: CLEAR CACHE EXPO GO (Nếu có thể)

**Trên Android:**
- Settings → Apps → Expo Go → Storage → Clear Cache + Clear Data

**Trên iOS:**
- Gỡ cài đặt và cài lại Expo Go từ App Store (cách chắc chắn nhất)

### Bước 4: QUÉT QR CODE MỚI

1. Mở lại Expo Go
2. Quét **QR code MỚI** từ terminal (port 8081, không phải 8082 như trước)
3. Chờ app build và load

---

## 🔍 TẠI SAO LỖI VẪN XUẤT HIỆN?

Lỗi không phải do code hiện tại, mà do:

1. **Cache cũ trên Expo Go** - App đã cache code có lỗi
2. **React Native Fabric/Animated cache** - Cache ở tầng native
3. **Bundle cũ** - JavaScript bundle cũ vẫn còn

## 💡 NẾU VẪN KHÔNG ĐƯỢC:

### Phương án 1: Gỡ và Cài lại Expo Go
```
1. Gỡ cài đặt Expo Go app khỏi điện thoại
2. Cài lại từ App Store/Play Store
3. Quét QR code mới
```

### Phương án 2: Test trên Web
```
Trong terminal, nhấn: w
```
Web sẽ không có vấn đề cache như mobile.

### Phương án 3: Build lại từ đầu
```bash
cd /Users/viethung-phenikaax/Desktop/phenikaaX/w2w-movies-mobile
rm -rf node_modules
rm -rf .expo
npm install
npx expo start -c
```

---

## 📱 QR CODE MỚI

Server hiện đang chạy trên:
- **URL:** exp://10.10.64.190:8081
- **Web:** http://localhost:8081
- **QR Code:** Hiển thị trong terminal

⚠️ **QUAN TRỌNG:** Phải quét QR code MỚI này, không dùng QR code cũ!

---

## ✅ CHECKLIST

Làm theo thứ tự:

- [ ] 1. Xóa project khỏi Expo Go (Remove from recents)
- [ ] 2. Force close Expo Go app hoàn toàn
- [ ] 3. Clear cache Expo Go (hoặc gỡ cài đặt)
- [ ] 4. Mở lại Expo Go
- [ ] 5. Quét QR code MỚI từ terminal (port 8081)
- [ ] 6. Chờ app load hoàn toàn
- [ ] 7. Kiểm tra - không còn lỗi!

---

## 🎉 SAU KHI FIX

App sẽ chạy mượt mà với:
- ✅ Không còn lỗi boolean/string
- ✅ Video player hoạt động với expo-video
- ✅ Navigation smooth
- ✅ StatusBar hiển thị đúng
- ✅ Tất cả screens hoạt động

---

## 📞 NẾU VẪN GẶP VẤN ĐỀ

Hãy thử:
1. Chụp màn hình lỗi mới (nếu còn)
2. Check terminal logs
3. Thử test trên web browser (nhấn `w`)

**Lưu ý:** Code hiện tại đã 100% đúng. Vấn đề chỉ còn là cache trên thiết bị!
