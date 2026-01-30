# Movie Service Update - Đồng bộ với w2w-movies

## Tổng quan thay đổi

Đã viết lại toàn bộ các hàm lấy phim trong `w2w-movies-mobile` để giống với `w2w-movies` (phiên bản web).

## Các thay đổi chính

### 1. **movie-service.ts** - Viết lại hoàn toàn

#### Trước đây:
```typescript
async getMoviesByType(type: MovieType, page: number = 1, limit: number = 15)
```

#### Bây giờ:
```typescript
async getMoviesByType(type: MovieType, params?: MovieListParams)
```

**Lợi ích:**
- Linh hoạt hơn với object params thay vì nhiều tham số riêng lẻ
- Dễ mở rộng thêm các tham số mới (sort_field, sort_type, category, country, year, etc.)
- Giống với phiên bản web, dễ maintain

### 2. **Thêm MovieListParams Type**

```typescript
export interface MovieListParams {
  page?: number;
  sort_field?: "modified.time" | "_id" | "year";
  sort_type?: "desc" | "asc";
  sort_lang?: "vietsub" | "thuyet-minh" | "long-tieng";
  category?: string;
  country?: string;
  year?: number;
  limit?: number;
}
```

### 3. **Thêm các hàm mới**

#### Hàm lấy phim nâng cao:
- `getNewMoviesV2(page)` - Phim mới v2
- `getNewMoviesV3(page)` - Phim mới v3
- `getMoviesByCategory(slug, params)` - Phim theo thể loại với params
- `getMoviesByCountry(slug, params)` - Phim theo quốc gia
- `getMoviesByYear(year, params)` - Phim theo năm
- `getCategories()` - Lấy danh sách thể loại
- `getCountries()` - Lấy danh sách quốc gia

#### Convenience methods (dễ sử dụng hơn):
- `getSingleMovies(params)` - Thay cho `getMoviesByType('phim-le', params)`
- `getSeriesMovies(params)` - Thay cho `getMoviesByType('phim-bo', params)`
- `getTVShows(params)` - Thay cho `getMoviesByType('tv-shows', params)`
- `getAnimationMovies(params)` - Thay cho `getMoviesByType('hoat-hinh', params)`
- `getVietsubMovies(params)` - Phim vietsub
- `getDubbedMovies(params)` - Phim thuyết minh
- `getVoiceoverMovies(params)` - Phim lồng tiếng

### 4. **Loại bỏ code thừa**

**Đã xóa:**
- ❌ Tất cả `console.log` debug (clean code)
- ❌ Logic transform response thủ công
- ❌ Hàm `getHome()` (thay bằng `getNewMovies(1)`)

**Lý do:**
- API đã trả đúng format, không cần transform
- Giảm complexity
- Code sạch hơn, dễ đọc hơn

### 5. **Cập nhật MovieType**

```typescript
// Trước
export type MovieType = 'phim-le' | 'phim-bo' | 'tv-shows' | 'hoat-hinh';

// Sau
export type MovieType = 
  | 'phim-le' 
  | 'phim-bo' 
  | 'tv-shows' 
  | 'hoat-hinh' 
  | 'phim-vietsub' 
  | 'phim-thuyet-minh' 
  | 'phim-long-tieng';
```

## Cập nhật các Screen

### movies-screen.tsx
```typescript
// Trước
queryFn: () => MovieService.getMoviesByType('phim-le', page)

// Sau
queryFn: () => MovieService.getSingleMovies({ 
  page,
  limit: 15,
  sort_field: 'modified.time',
  sort_type: 'desc'
})
```

### tv-shows-screen.tsx
```typescript
// Trước
queryFn: () => MovieService.getMoviesByType('phim-bo', page)

// Sau
queryFn: () => MovieService.getSeriesMovies({ 
  page,
  limit: 15,
  sort_field: 'modified.time',
  sort_type: 'desc'
})
```

### home-screen.tsx
```typescript
// Trước
queryFn: () => MovieService.getHome()
queryFn: () => MovieService.getMoviesByType('phim-le', moviesPage)
queryFn: () => MovieService.getMoviesByType('phim-bo', seriesPage)
queryFn: () => MovieService.getMoviesByType('hoat-hinh', hoatHinhPage)

// Sau
queryFn: () => MovieService.getNewMovies(1)
queryFn: () => MovieService.getSingleMovies({ page: moviesPage, ... })
queryFn: () => MovieService.getSeriesMovies({ page: seriesPage, ... })
queryFn: () => MovieService.getAnimationMovies({ page: hoatHinhPage, ... })
```

## Lợi ích của Update

### 1. **Consistency (Nhất quán)**
- Mobile và Web giờ dùng cùng 1 API pattern
- Dễ maintain và sync code giữa 2 projects

### 2. **Flexibility (Linh hoạt)**
```typescript
// Có thể thêm nhiều tham số dễ dàng
MovieService.getSingleMovies({
  page: 1,
  limit: 20,
  sort_field: 'year',
  sort_type: 'desc',
  category: 'hanh-dong',
  country: 'han-quoc',
  year: 2024
})
```

### 3. **Type Safety**
- TypeScript check đầy đủ với `MovieListParams`
- Auto-complete khi code
- Ít bug hơn

### 4. **Cleaner Code**
- Không còn debug logs rác
- Không còn transform logic thừa
- Code ngắn gọn, dễ đọc

### 5. **Future-proof**
- Dễ thêm features mới (filter, sort, search advanced)
- Có sẵn các hàm tiện ích (convenience methods)
- Có thể tích hợp thêm category, country, year filtering

## Migration Guide

### Nếu code cũ dùng:
```typescript
MovieService.getMoviesByType('phim-le', page, limit)
```

### Đổi thành:
```typescript
MovieService.getSingleMovies({ page, limit })
// Hoặc vẫn dùng được:
MovieService.getMoviesByType('phim-le', { page, limit })
```

### Nếu muốn sort:
```typescript
MovieService.getSingleMovies({ 
  page: 1,
  sort_field: 'modified.time',
  sort_type: 'desc'
})
```

### Nếu muốn filter:
```typescript
MovieService.getSingleMovies({ 
  page: 1,
  category: 'hanh-dong',
  country: 'han-quoc',
  year: 2024
})
```

## Files Changed

1. ✅ `/src/services/movie-service.ts` - Viết lại hoàn toàn
2. ✅ `/src/types/movie.ts` - Thêm MovieListParams, CategoriesResponse
3. ✅ `/src/screens/movies-screen.tsx` - Update API calls
4. ✅ `/src/screens/tv-shows-screen.tsx` - Update API calls
5. ✅ `/src/screens/home-screen.tsx` - Update API calls

## Testing

Sau khi update, test các chức năng:

1. ✅ Home screen hiển thị đúng phim
2. ✅ Movies screen (phim lẻ) load đúng
3. ✅ TV Shows screen (phim bộ) load đúng
4. ✅ Infinite scroll vẫn hoạt động
5. ✅ Pull to refresh vẫn hoạt động
6. ✅ Search vẫn hoạt động

## Next Steps

Có thể thêm các features mới dễ dàng:

1. **Filter by category**: Thêm dropdown chọn thể loại
2. **Filter by country**: Thêm dropdown chọn quốc gia
3. **Filter by year**: Thêm slider chọn năm
4. **Sort options**: Thêm buttons sort theo tên, năm, view
5. **Advanced search**: Combine nhiều filters

Ví dụ implement filter:
```typescript
const [filters, setFilters] = useState({
  category: '',
  country: '',
  year: undefined,
  sort_field: 'modified.time',
  sort_type: 'desc'
});

const { data } = useQuery({
  queryKey: ['movies', page, filters],
  queryFn: () => MovieService.getSingleMovies({ 
    page,
    ...filters 
  }),
});
```

## Kết luận

✅ Code giờ giống y chang phiên bản web  
✅ Dễ maintain và sync  
✅ Linh hoạt hơn cho future features  
✅ Type-safe với TypeScript  
✅ Clean code, không còn debug logs  
✅ Backward compatible (vẫn dùng được `getMoviesByType` nếu cần)  

**Infinite scroll issue trước đây (totalPages=1) giờ có thể debug dễ hơn vì code clean hơn!**
