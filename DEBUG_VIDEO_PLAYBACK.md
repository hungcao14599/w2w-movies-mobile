# 🐛 Debug Guide: Video Playback Issue

## 🎯 Objective
Fix video playback functionality to match web version

## 📋 Testing Checklist

### Step 1: Check API Response
1. **Open app in Expo Go**
2. **Navigate to Home screen** - Xem các carousel có hiển thị không
3. **Click vào 1 phim** từ carousel
4. **Check terminal logs** để xem:

**Expected Logs:**
```
🎬 Fetching movie detail for slug: [slug-name]
📦 Full response keys: ["status", "msg", "movie", ...]
📦 Response.status: true
📦 Response.msg: success
✅ Has movie object
🎬 Movie name: [Tên phim]
📺 Episodes array length: X
🎯 First episode server: [Server name]
📝 First server episodes: Y
🎥 First episode name: [Tập 1]
🔗 Has link_m3u8: true
🔗 Has link_embed: true
```

**If you see:**
- `❌ No movie object` → API response structure wrong
- `⚠️ No episodes found` → Movie has no episodes data
- `Episodes array length: 0` → API không trả về episodes

### Step 2: Navigate to Watch Screen
1. **Click "Watch" button** trên detail screen
2. **Hoặc click vào episode** trong danh sách
3. **Check terminal logs**:

**Expected Logs:**
```
📦 Raw response: exists
📦 Response keys: ["status", "msg", "movie"]
🎬 Movie exists: true
🎬 Movie name: [Tên phim]
📺 Episodes count: X
📺 Episodes structure: ["server_name", "server_data"]
🎯 Current server: 0 [Server name]
📝 Server episodes: Y
🎥 Current episode: Tập 1
🔗 Video URL (m3u8): https://...
🔗 Video URL (embed): https://...
✅ Final video URL: https://...
🔄 Changing video to: https://...
```

**If you see:**
- `Episodes count: 0` → No episodes in response
- `Server episodes: 0` → Server has no episodes
- `Current episode: undefined` → Episode index wrong
- `Video URL: undefined` → No video links

### Step 3: Test Video Playback
1. **Video should start playing automatically**
2. **If shows "Không có video khả dụng":**
   - Check terminal logs
   - Screenshot the error
   - Share logs with developer

## 🔍 Common Issues & Solutions

### Issue 1: "Episodes count: 0"

**Cause:** API không trả về episodes

**Solutions:**
1. **Check API endpoint:**
   ```
   curl https://phimapi.com/phim/[slug]
   ```
2. **Verify response has `movie.episodes`**
3. **Check if slug is correct**

### Issue 2: "Video URL: undefined"

**Cause:** Episode data không có link video

**Solutions:**
1. **Try different movie** - một số phim có thể chưa có link
2. **Check if `link_m3u8` hoặc `link_embed` tồn tại**
3. **Verify server has video data**

### Issue 3: Video không play

**Cause:** URL format hoặc codec không support

**Solutions:**
1. **Check video URL format** - phải là .m3u8 hoặc valid embed
2. **Test URL in browser** trước
3. **Try different server**

## 📱 Test Cases

### Test Case 1: Phim Lẻ (Single Movie)
1. Find "Phim lẻ" carousel
2. Click any movie
3. Should see 1 episode
4. Click "Watch"
5. Video should play

### Test Case 2: Phim Bộ (TV Series)
1. Find "Phim bộ" carousel
2. Click any series
3. Should see multiple episodes
4. Click episode 1
5. Video should play
6. Try switching to episode 2
7. Video should change

### Test Case 3: Multiple Servers
1. Open any movie with multiple servers
2. Switch between servers
3. Episode list should update
4. Video should play from new server

## 🛠️ Debug Commands

### Check API Response in Terminal
```bash
curl "https://phimapi.com/phim/bo-gia" | jq '.movie.episodes[0]'
```

### Common API Structures

**Format 1: Standard**
```json
{
  "status": true,
  "movie": {
    "name": "Movie Name",
    "episodes": [
      {
        "server_name": "Server #1",
        "server_data": [
          {
            "name": "Tập 1",
            "slug": "tap-1",
            "link_m3u8": "https://...",
            "link_embed": "https://..."
          }
        ]
      }
    ]
  }
}
```

**Format 2: Nested Data**
```json
{
  "status": true,
  "data": {
    "movie": {
      "episodes": [...]
    }
  }
}
```

## 📊 Logs Analysis

### Good Logs ✅
```
📺 Episodes count: 30
📝 Server episodes: 30
🔗 Video URL (m3u8): https://example.com/video.m3u8
✅ Final video URL: https://example.com/video.m3u8
```

### Bad Logs ❌
```
📺 Episodes count: 0
📝 Server episodes: 0
🔗 Video URL (m3u8): undefined
✅ Final video URL: 
```

## 🎬 Next Steps

Based on your logs:

1. **If API returns episodes:**
   - Check watch-movie-screen.tsx parsing
   - Verify VideoPlayer setup
   - Test with known working URL

2. **If API returns 0 episodes:**
   - Try different slug
   - Check if movie actually has episodes
   - Verify API endpoint is correct

3. **If video URL exists but doesn't play:**
   - Check URL format
   - Test URL in browser
   - Check expo-video support for format
   - Consider WebView fallback

## 📞 Report Format

When reporting issue, include:

```
**Movie Slug:** [slug]
**Episodes Count:** [number]
**Server Count:** [number]
**Video URL:** [url or undefined]
**Error Message:** [any error shown]
**Terminal Logs:** [paste relevant logs]
**Screenshot:** [if applicable]
```

---

**Created:** January 30, 2026
**Purpose:** Debug video playback issues
**Status:** Active debugging
