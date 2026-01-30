import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { MovieService } from "../services";
import { LoadingSpinner, ErrorMessage, MovieCard } from "../components";
import { Colors } from "../constants";
import { Movie } from "../types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function TVShowsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [allShows, setAllShows] = useState<Movie[]>([]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["movies", "series", page],
    queryFn: () =>
      MovieService.getSeriesMovies({
        page,
        limit: 15,
        sort_field: "modified.time",
        sort_type: "desc",
      }),
  });

  // Accumulate shows when new page loads
  React.useEffect(() => {
    console.log(
      "📦 TV Shows data updated - page:",
      page,
      "items:",
      data?.items?.length || 0
    );
    if (data?.items) {
      if (page === 1) {
        // First page: Replace
        setAllShows(data.items);
        console.log("✅ TV Shows initialized with", data.items.length, "shows");
      } else {
        // Next pages: Append
        setAllShows((prev) => {
          const newTotal = [...prev, ...data.items];
          console.log("➕ TV Shows appended - Total:", newTotal.length);
          return newTotal;
        });
      }
    }
  }, [data, page]);

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setAllShows([]);
    await refetch();
    setRefreshing(false);
  };

  const loadMore = () => {
    console.log("🔍 onEndReached called - TV Shows");
    console.log("📊 Current page:", page);
    console.log("📦 Has data:", !!data);
    console.log("📄 Has pagination:", !!data?.pagination);
    console.log("🔢 Total pages:", data?.pagination?.totalPages);
    console.log("⏳ Is loading:", isLoading);

    if (data?.pagination && page < data.pagination.totalPages && !isLoading) {
      console.log("✅ Loading more TV shows (Phim bộ), page:", page + 1);
      setPage(page + 1);
    } else {
      console.log("❌ Cannot load more - Conditions not met");
    }
  };

  if (isLoading && page === 1) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorMessage message="Không thể tải danh sách phim. Vui lòng thử lại sau." />
    );
  }

  const renderMovie = ({ item }: { item: Movie }) => (
    <MovieCard
      movie={item}
      variant="grid"
      onPress={() => navigation.navigate("MovieDetail", { slug: item.slug })}
    />
  );

  // Log for debugging
  console.log("🎬 Rendering TV Shows screen with", allShows.length, "shows");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Phim bộ</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity onPress={() => navigation.navigate("Search")}>
            <Text style={styles.searchText}>Tìm kiếm</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={allShows}
        renderItem={renderMovie}
        keyExtractor={(item, index) => `${item._id}-${index}`}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.01}
        onScrollBeginDrag={() =>
          console.log("👆 User started scrolling - TV Shows")
        }
        onMomentumScrollEnd={() => console.log("🛑 Scroll ended - TV Shows")}
        showsVerticalScrollIndicator={true}
        // Performance optimizations (removed removeClippedSubviews to fix onEndReached)
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
        ListFooterComponent={
          isLoading && page > 1 ? (
            <View style={styles.loadingFooter}>
              <View style={styles.loadingDot} />
              <View style={[styles.loadingDot, styles.loadingDotMid]} />
              <View style={[styles.loadingDot, styles.loadingDotLast]} />
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
  },
  searchText: {
    fontSize: 16,
    color: Colors.primary,
  },
  listContainer: {
    padding: 16,
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 0,
  },
  movieItem: {
    flex: 1 / 3,
    padding: 4,
  },
  loadingFooter: {
    width: "100%",
    paddingVertical: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    opacity: 0.3,
  },
  loadingDotMid: {
    opacity: 0.6,
  },
  loadingDotLast: {
    opacity: 1,
  },
});
