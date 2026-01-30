import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { MovieService } from "../services";
import {
  LoadingSpinner,
  ErrorMessage,
  MovieCard,
  MovieCarousel,
  TrendingCarousel,
} from "../components";
import { Colors } from "../constants";
import { getImageUrl } from "../utils";
import { Movie } from "../types";

const { width } = Dimensions.get("window");
const BANNER_HEIGHT = 550;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [refreshing, setRefreshing] = useState(false);

  // State để lưu all movies (accumulated)
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  console.log("🚀 ~ file: home-screen.tsx:42 ~ HomeScreen ~ allMovies:", allMovies)
  const [allSeries, setAllSeries] = useState<Movie[]>([]);
  const [allHoatHinh, setAllHoatHinh] = useState<Movie[]>([]);

  // Fetch home data (featured) - Tăng limit để có đủ phim cho Continue Watching
  const {
    data: homeData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["home"],
    queryFn: () => MovieService.getNewMovies(1, 20),
  });
  console.log(
    "🚀 ~ file: home-screen.tsx:44 ~ HomeScreen ~ homeData:",
    homeData
  );

  // Fetch movies by categories with pagination
  const [moviesPage, setMoviesPage] = useState(1);
  const { data: moviesData, isLoading: moviesLoading } = useQuery({
    queryKey: ["movies-home", moviesPage],
    queryFn: () =>
      MovieService.getSingleMovies({
        page: moviesPage,
        limit: 15,
        sort_field: "modified.time",
        sort_type: "desc",
      }),
  });

  // Update accumulated movies when new data arrives
  React.useEffect(() => {
    if (moviesData?.items) {
      if (moviesPage === 1) {
        setAllMovies(moviesData.items);
      } else {
        setAllMovies((prev) => [...prev, ...moviesData.items]);
      }
    }
  }, [moviesData, moviesPage]);

  const [seriesPage, setSeriesPage] = useState(1);
  const { data: seriesData, isLoading: seriesLoading } = useQuery({
    queryKey: ["series-home", seriesPage],
    queryFn: () =>
      MovieService.getSeriesMovies({
        page: seriesPage,
        limit: 15,
        sort_field: "modified.time",
        sort_type: "desc",
      }),
  });
  console.log(
    "🚀 ~ file: home-screen.tsx:95 ~ HomeScreen ~ seriesData:",
    seriesData
  );

  React.useEffect(() => {
    if (seriesData?.items) {
      if (seriesPage === 1) {
        setAllSeries(seriesData.items);
      } else {
        setAllSeries((prev) => [...prev, ...seriesData.items]);
      }
    }
  }, [seriesData, seriesPage]);

  const [hoatHinhPage, setHoatHinhPage] = useState(1);
  const { data: hoatHinhData, isLoading: hoatHinhLoading } = useQuery({
    queryKey: ["hoat-hinh-home", hoatHinhPage],
    queryFn: () =>
      MovieService.getAnimationMovies({
        page: hoatHinhPage,
        limit: 15,
        sort_field: "modified.time",
        sort_type: "desc",
      }),
  });

  React.useEffect(() => {
    if (hoatHinhData?.items) {
      if (hoatHinhPage === 1) {
        setAllHoatHinh(hoatHinhData.items);
      } else {
        setAllHoatHinh((prev) => [...prev, ...hoatHinhData.items]);
      }
    }
  }, [hoatHinhData, hoatHinhPage]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Reset pages and data
    setMoviesPage(1);
    setSeriesPage(1);
    setHoatHinhPage(1);
    setAllMovies([]);
    setAllSeries([]);
    setAllHoatHinh([]);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorMessage message="Không thể tải dữ liệu. Vui lòng thử lại sau." />
    );
  }

  const featuredMovie = homeData?.items[0];

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Gradient Background - Netflix Black */}
      <LinearGradient
        colors={[Colors.bgGradient1, Colors.bgGradient2, Colors.bgGradient1]}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Modern Header - Netflix style */}
      <LinearGradient
        colors={["rgba(0, 0, 0, 0.95)", "rgba(0, 0, 0, 0.7)", "transparent"]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <LinearGradient
              colors={["#e50914", "#b20710"]}
              style={styles.logoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.logo}>W2W</Text>
            </LinearGradient>
            <View style={styles.betaBadge}>
              <Text style={styles.betaText}>MOVIES</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={() => {
                /* Notifications */
              }}
            >
              <LinearGradient
                colors={["rgba(229, 9, 20, 0.2)", "rgba(229, 9, 20, 0.05)"]}
                style={styles.iconGradient}
              >
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color={Colors.text}
                />
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Search")}
              style={styles.headerIconButton}
            >
              <LinearGradient
                colors={["rgba(229, 9, 20, 0.2)", "rgba(229, 9, 20, 0.05)"]}
                style={styles.iconGradient}
              >
                <Ionicons name="search" size={22} color={Colors.text} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Movie Sections */}
        <View style={styles.sectionsContainer}>
          {/* Trending Carousel - Featured */}
          {homeData?.items && homeData.items.length > 0 && (
            <View style={styles.trendingSection}>
              <View style={styles.sectionHeaderWithIcon}>
                <Ionicons name="flame" size={28} color={Colors.primary} />
                <Text style={styles.sectionTitleLarge}>Trending Now</Text>
              </View>
              <TrendingCarousel
                movies={homeData.items.slice(0, 10)}
                onMoviePress={(slug) =>
                  navigation.navigate("MovieDetail", { slug })
                }
              />
            </View>
          )}

          {/* Categories Row */}
          {/* <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesRow}
            contentContainerStyle={styles.categoriesContent}
          >
            <TouchableOpacity style={styles.categoryChip}>
              <Text style={styles.categoryText}>🏠 Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryChip}>
              <Text style={styles.categoryText}>📺 TV Shows</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryChip}>
              <Text style={styles.categoryText}>🎬 Movies</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryChip}>
              <Text style={styles.categoryText}>🔥 Trending</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryChip}>
              <Text style={styles.categoryText}>Categories</Text>
              <Ionicons name="chevron-down" size={16} color={Colors.text} />
            </TouchableOpacity>
          </ScrollView> */}

          {/* Top 10 Today - Netflix Style */}
          {homeData?.items && homeData.items.length >= 10 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.top10Badge}>
                  <Text style={styles.top10Text}>TOP</Text>
                  <Text style={styles.top10Number}>10</Text>
                </View>
                <Text style={styles.sectionTitleLarge}>Today</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carouselContent}
              >
                {homeData.items.slice(0, 10).map((movie, index) => (
                  <MovieCard
                    key={movie._id}
                    movie={movie}
                    rank={index + 1}
                    showPlayButton={true}
                    onPress={() =>
                      navigation.navigate("MovieDetail", { slug: movie.slug })
                    }
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Continue Watching - Netflix Feature */}
          {homeData?.items && homeData.items.length > 10 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitleMedium}>Continue Watching</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carouselContent}
              >
                {homeData.items.slice(10, 20).map((movie) => (
                  <MovieCard
                    key={movie._id}
                    movie={movie}
                    showPlayButton={true}
                    onPress={() =>
                      navigation.navigate("MovieDetail", { slug: movie.slug })
                    }
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Phim lẻ mới nhất - With Infinite Scroll */}
          {allMovies.length > 0 && (
            <MovieCarousel
              title="🎬 New Movies"
              movies={allMovies}
              onMoviePress={(slug) =>
                navigation.navigate("MovieDetail", { slug })
              }
              onSeeAll={() =>
                navigation.navigate("MainTabs", { screen: "Movies" })
              }
              onEndReached={() => {
                if (
                  moviesData?.pagination &&
                  moviesPage < moviesData.pagination.totalPages &&
                  !moviesLoading
                ) {
                  console.log("📥 Loading more movies, page:", moviesPage + 1);
                  setMoviesPage(moviesPage + 1);
                }
              }}
              isLoading={moviesLoading}
            />
          )}

          {/* Phim bộ hot - With Infinite Scroll */}
          {allSeries.length > 0 && (
            <MovieCarousel
              title="📺 Popular TV Shows"
              movies={allSeries}
              onMoviePress={(slug) =>
                navigation.navigate("MovieDetail", { slug })
              }
              onSeeAll={() =>
                navigation.navigate("MainTabs", { screen: "TVShows" })
              }
              onEndReached={() => {
                if (
                  seriesData?.pagination &&
                  seriesPage < seriesData.pagination.totalPages &&
                  !seriesLoading
                ) {
                  console.log("📥 Loading more series, page:", seriesPage + 1);
                  setSeriesPage(seriesPage + 1);
                }
              }}
              isLoading={seriesLoading}
            />
          )}

          {/* Hoạt hình - With Infinite Scroll */}
          {allHoatHinh.length > 0 && (
            <MovieCarousel
              title="🎨 Animation"
              movies={allHoatHinh}
              onMoviePress={(slug) =>
                navigation.navigate("MovieDetail", { slug })
              }
              onEndReached={() => {
                if (
                  hoatHinhData?.pagination &&
                  hoatHinhPage < hoatHinhData.pagination.totalPages &&
                  !hoatHinhLoading
                ) {
                  console.log(
                    "📥 Loading more animation, page:",
                    hoatHinhPage + 1
                  );
                  setHoatHinhPage(hoatHinhPage + 1);
                }
              }}
              isLoading={hoatHinhLoading}
              showSeeAll={false}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  gradientBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  // Modern Header
  header: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text,
    letterSpacing: 3,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  betaBadge: {
    backgroundColor: "#000",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  betaText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  headerRight: {
    flexDirection: "row",
    gap: 10,
  },
  headerIconButton: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  iconGradient: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(229, 9, 20, 0.5)",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  // Sections
  sectionsContainer: {
    paddingTop: 10,
  },
  trendingSection: {
    marginBottom: 20,
  },
  sectionHeaderWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: -10,
    gap: 8,
  },
  sectionTitleLarge: {
    fontSize: 28,
    fontWeight: "900",
    color: Colors.text,
    textShadowColor: "rgba(229, 9, 20, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 0.5,
  },
  sectionTitleMedium: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
    paddingHorizontal: 16,
    letterSpacing: 0.3,
  },
  top10Badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  top10Text: {
    fontSize: 10,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 1,
  },
  top10Number: {
    fontSize: 18,
    fontWeight: "900",
    color: "#fff",
    lineHeight: 20,
  },
  carouselContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoriesRow: {
    marginBottom: 20,
    paddingVertical: 12,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "rgba(229, 9, 20, 0.6)",
    gap: 6,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  categoryText: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  movieList: {
    paddingLeft: 16,
    gap: 8,
  },
});
