import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Movie } from "../types";
import { getImageUrl, formatEpisode } from "../utils";
import { Colors } from "../constants";

const { width } = Dimensions.get("window");
const CARD_WIDTH = 130; // Netflix-style portrait cards
const CARD_WIDTH_GRID = (width - 48) / 2; // Grid: 2 columns with padding

interface MovieCardProps {
  movie: Movie;
  onPress: () => void;
  variant?: "horizontal" | "grid"; // horizontal for home, grid for search
  rank?: number; // For Top 10 display
  showPlayButton?: boolean; // Netflix-style play button
}

const MovieCardComponent: React.FC<MovieCardProps> = ({
  movie,
  onPress,
  variant = "horizontal",
  rank,
  showPlayButton = false,
}) => {
  const isGrid = variant === "grid";
  const cardWidth = isGrid ? CARD_WIDTH_GRID : CARD_WIDTH;
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  // Get age rating based on movie type and categories
  const getAgeRating = (): string | null => {
    return "K";
  };

  const ageRating = getAgeRating();

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={[
          styles.container,
          isGrid && styles.containerGrid,
          { width: cardWidth },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={[styles.imageContainer, { height: cardWidth * 1.5 }]}>
          {/* Age Rating Badge - Netflix style */}
          {ageRating && (
            <View style={styles.ageRatingBadge}>
              <Text style={styles.ageRatingText}>{ageRating}</Text>
            </View>
          )}

          {/* Top 10 Rank Indicator */}
          {rank && rank <= 10 && (
            <View style={styles.rankContainer}>
              <Text style={styles.rankNumber}>{rank}</Text>
            </View>
          )}

          <Image
            source={{ uri: getImageUrl(movie.thumb_url || movie.poster_url) }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />

          {/* Netflix-style Play Button */}
          {showPlayButton && (
            <View style={styles.playButtonContainer}>
              <LinearGradient
                colors={["rgba(229, 9, 20, 0.95)", "rgba(178, 7, 16, 0.95)"]}
                style={styles.playButton}
              >
                <Ionicons name="play" size={18} color="#fff" />
              </LinearGradient>
            </View>
          )}

          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.9)"]}
            style={styles.gradient}
          >
            <View style={styles.info}>
              <View style={styles.badges}>
                {movie.quality && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{movie.quality}</Text>
                  </View>
                )}
                {movie.lang && (
                  <View style={[styles.badge, styles.badgeLang]}>
                    <Text style={styles.badgeText}>{movie.lang}</Text>
                  </View>
                )}
              </View>
              {movie.episode_current && (
                <View style={styles.episodeBadge}>
                  <Text style={styles.episodeText}>
                    {formatEpisode(movie.episode_current, movie.episode_total)}
                  </Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </View>
        <View style={styles.details}>
          <Text style={styles.title} numberOfLines={2}>
            {movie.name}
          </Text>
          {movie.year && <Text style={styles.year}>{movie.year}</Text>}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginRight: 8,
  },
  containerGrid: {
    marginBottom: 16,
    marginRight: 0,
  },
  imageContainer: {
    width: "100%",
    height: CARD_WIDTH * 1.5,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: Colors.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: "relative",
  },
  ageRatingBadge: {
    position: "absolute",
    top: 0,
    left: 8,
    zIndex: 10,
  },
  ageRatingText: {
    color: "#E50914",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -1,
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  rankContainer: {
    position: "absolute",
    bottom: 0,
    left: -5,
    zIndex: 10,
  },
  rankNumber: {
    fontSize: 120,
    fontWeight: "900",
    color: "#fff",
    textShadowColor: "#000",
    textShadowOffset: { width: -2, height: 2 },
    textShadowRadius: 8,
    lineHeight: 120,
    includeFontPadding: false,
    opacity: 0.85,
  },
  playButtonContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 5,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
    justifyContent: "flex-end",
    padding: 6,
  },
  info: {
    gap: 4,
  },
  badges: {
    flexDirection: "row",
    gap: 4,
    flexWrap: "wrap",
  },
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  badgeLang: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  badgeText: {
    color: Colors.text,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  episodeBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    alignSelf: "flex-start",
    borderWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  episodeText: {
    color: Colors.text,
    fontSize: 9,
    fontWeight: "700",
  },
  details: {
    marginTop: 6,
    gap: 2,
  },
  title: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18,
    letterSpacing: 0.3,
  },
  year: {
    color: "#aaa",
    fontSize: 12,
    fontWeight: "500",
  },
});

// Memoized version to prevent unnecessary re-renders
export const MovieCard = React.memo(
  MovieCardComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.movie._id === nextProps.movie._id &&
      prevProps.variant === nextProps.variant &&
      prevProps.rank === nextProps.rank &&
      prevProps.showPlayButton === nextProps.showPlayButton
    );
  }
);
