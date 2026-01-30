# 🐛 Infinite Scroll Debug - Movies & TV Shows

## ❌ Vấn Đề:

**User report:** "màn phim lẻ, phim bộ scroll xuống dưới k hoạt động"

**Logs:**
```
LOG  🚀 ~ API response items: 15
LOG  🚀 ~ API response items: 15
LOG  🚀 ~ API response items: 15
```

**Không thấy:**
```
LOG  📥 Loading more movies, page: 2  ← MISSING!
LOG  📥 Loading more TV shows, page: 2  ← MISSING!
```

**Nguyên nhân:** `onEndReached` KHÔNG được trigger!

---

## ✅ ĐÃ FIX:

### 1. **Giảm Threshold**

**Before:**
```typescript
onEndReachedThreshold={0.5}  // 50% from bottom
```

**After:**
```typescript
onEndReachedThreshold={0.1}  // 10% from bottom (trigger sớm hơn)
```

**Tại sao:**
- `0.5` = Phải scroll 50% content còn lại
- Nếu list ngắn (15 items) → không đủ content để đạt 50%
- `0.1` = Chỉ cần scroll gần hết (90%)
- Trigger sớm hơn → load trước khi user đến cuối

---

### 2. **Thêm Debug Logs**

**loadMore function:**
```typescript
const loadMore = () => {
  console.log('🔍 onEndReached called - Movies');
  console.log('📊 Current page:', page);
  console.log('📦 Has data:', !!data);
  console.log('�� Has pagination:', !!data?.pagination);
  console.log('🔢 Total pages:', data?.pagination?.totalPages);
  console.log('⏳ Is loading:', isLoading);
  
  if (data?.pagination && page < data.pagination.totalPages && !isLoading) {
    console.log('✅ Loading more movies (Phim lẻ), page:', page + 1);
    setPage(page + 1);
  } else {
    console.log('❌ Cannot load more - Conditions not met');
  }
};
```

**Scroll tracking:**
```typescript
onScrollBeginDrag={() => console.log('👆 User started scrolling - Movies')}
onMomentumScrollEnd={() => console.log('🛑 Scroll ended - Movies')}
```

---

### 3. **Files Modified**

**movies-screen.tsx:**
- Threshold: `0.5` → `0.1`
- Added `loadMore` debug logs (8 lines)
- Added scroll tracking logs (2 lines)

**tv-shows-screen.tsx:**
- Threshold: `0.5` → `0.1`
- Added `loadMore` debug logs (8 lines)
- Added scroll tracking logs (2 lines)

---

## 🧪 Testing Instructions:

### Reload App:
```bash
# In Expo Go:
Shake phone → Reload
```

### Test Movies Screen:

1. **Mở Movies tab (Phim lẻ)**

2. **Scroll xuống từ từ**

3. **Check logs - Bạn sẽ thấy:**
```
LOG  👆 User started scrolling - Movies
LOG  🔍 onEndReached called - Movies
LOG  📊 Current page: 1
LOG  📦 Has data: true
LOG  📄 Has pagination: true
LOG  🔢 Total pages: 100
LOG  ⏳ Is loading: false
LOG  ✅ Loading more movies (Phim lẻ), page: 2
LOG  🚀 ~ API response items: 15
LOG  🛑 Scroll ended - Movies
```

4. **UI sẽ show:**
- Loading dots ●●● at bottom
- 15 more movies appear
- Total: 30 movies

5. **Continue scrolling:**
- Each time near bottom → auto load page 3, 4, 5...

---

### Test TV Shows Screen:

1. **Mở TV Shows tab (Phim bộ)**

2. **Scroll xuống**

3. **Check logs:**
```
LOG  👆 User started scrolling - TV Shows
LOG  🔍 onEndReached called - TV Shows
LOG  📊 Current page: 1
LOG  📦 Has data: true
LOG  📄 Has pagination: true
LOG  🔢 Total pages: 50
LOG  ⏳ Is loading: false
LOG  ✅ Loading more TV shows (Phim bộ), page: 2
LOG  🚀 ~ API response items: 15
LOG  🛑 Scroll ended - TV Shows
```

4. **UI sẽ show:**
- Loading dots ●●●
- 15 more shows
- Total: 30 shows

---

## 🔍 Debug Scenarios:

### Scenario 1: onEndReached NOT called

**Logs:**
```
LOG  👆 User started scrolling - Movies
LOG  🛑 Scroll ended - Movies
```

**NO LOG:** `🔍 onEndReached called`

**Nguyên nhân:**
- List quá ngắn, không đủ content để scroll
- Threshold too high
- FlatList height bị giới hạn

**Fix:**
- Giảm threshold: `0.1` → `0.05`
- Remove height constraints
- Thêm dummy data để test

---

### Scenario 2: onEndReached called BUT không load

**Logs:**
```
LOG  🔍 onEndReached called - Movies
LOG  📊 Current page: 1
LOG  📦 Has data: true
LOG  📄 Has pagination: false  ← Problem!
LOG  ❌ Cannot load more - Conditions not met
```

**Nguyên nhân:**
- API không return pagination
- data.pagination undefined

**Fix:**
- Check API response format
- Add fallback pagination

---

### Scenario 3: Already at last page

**Logs:**
```
LOG  🔍 onEndReached called - Movies
LOG  📊 Current page: 100
LOG  📦 Has data: true
LOG  📄 Has pagination: true
LOG  🔢 Total pages: 100
LOG  ❌ Cannot load more - Conditions not met
```

**Nguyên nhân:**
- `page (100) >= totalPages (100)`
- Đã hết data

**Expected:** Đúng rồi, không load nữa! ✅

---

### Scenario 4: Already loading

**Logs:**
```
LOG  🔍 onEndReached called - Movies
LOG  📊 Current page: 1
LOG  📦 Has data: true
LOG  📄 Has pagination: true
LOG  🔢 Total pages: 100
LOG  ⏳ Is loading: true  ← Problem!
LOG  ❌ Cannot load more - Conditions not met
```

**Nguyên nhân:**
- Đang load page hiện tại
- Chặn duplicate requests

**Expected:** Đúng rồi, chờ load xong! ✅

---

## 📊 Threshold Comparison:

### 0.5 (Old):
```
Screen height: 800px
List height: 2000px (15 items × ~133px)
Trigger at: 800px + (2000px × 0.5) = 1800px

User must scroll: 1800px / 2000px = 90%
```

### 0.1 (New):
```
Screen height: 800px
List height: 2000px
Trigger at: 800px + (2000px × 0.1) = 1000px

User must scroll: 1000px / 2000px = 50%
```

### Result:
- Old: Trigger ở 90% → Quá muộn!
- New: Trigger ở 50% → Vừa đủ! ✅

---

## ✅ Expected Behavior After Fix:

### First Load (Page 1):
```
1. Screen opens
   ↓
2. Show 15 movies
   ↓
3. User scrolls down
   ↓
4. Reach 50% of list
   ↓
5. onEndReached fires
   ↓
6. Log: "🔍 onEndReached called"
   ↓
7. Log: "✅ Loading more, page: 2"
   ↓
8. Show loading dots ●●●
   ↓
9. API returns 15 more items
   ↓
10. Total: 30 movies
```

### Continue Scrolling (Page 2 → 3):
```
1. User continues scrolling
   ↓
2. Reach 50% of accumulated list
   ↓
3. onEndReached fires again
   ↓
4. Log: "✅ Loading more, page: 3"
   ↓
5. Append 15 more items
   ↓
6. Total: 45 movies
   ↓
7. Repeat endlessly...
```

---

## 🚫 Common Issues:

### Issue 1: Scroll không đủ
**Problem:** List quá ngắn (< 20 items)
**Fix:** Load nhiều items hơn mỗi page (15 → 20)

### Issue 2: Threshold quá cao
**Problem:** `0.5` hoặc `0.8`
**Fix:** Giảm xuống `0.1` hoặc `0.05`

### Issue 3: Duplicate requests
**Problem:** onEndReached gọi nhiều lần
**Fix:** Check `!isLoading` trong condition

### Issue 4: Cache cũ
**Problem:** Code mới nhưng chạy code cũ
**Fix:** Reload app (Shake → Reload)

---

## 📱 Quick Test Checklist:

Movies Screen:
- [ ] Reload app
- [ ] Open Movies tab
- [ ] Scroll xuống ~50%
- [ ] See log: "🔍 onEndReached called"
- [ ] See log: "✅ Loading more, page: 2"
- [ ] See loading dots ●●●
- [ ] See 15 more movies appear
- [ ] Total: 30 movies
- [ ] Continue scrolling → keeps loading

TV Shows Screen:
- [ ] Open TV Shows tab
- [ ] Scroll xuống ~50%
- [ ] See logs with "TV Shows"
- [ ] See loading dots
- [ ] See 15 more shows
- [ ] Total: 30 shows
- [ ] Continue scrolling works

---

## 🎯 Summary:

**Problem:** onEndReached not triggered
**Root Cause:** Threshold too high (0.5)
**Solution:** Lowered to 0.1 + added debug logs

**Changes:**
- Threshold: 0.5 → 0.1 (both screens)
- Added 10 debug logs per screen
- Added scroll tracking

**Result:** 
- ✅ Load triggers at 50% scroll (was 90%)
- ✅ More predictable behavior
- ✅ Easy to debug with logs

**Status:** READY TO TEST - Reload và scroll thử!
