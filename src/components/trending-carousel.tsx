import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Movie } from '../types';
import { getImageUrl } from '../utils';
import { Colors } from '../constants';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.7;
const ITEM_HEIGHT = ITEM_WIDTH * 1.4;
const SPACING = 16;

interface TrendingCarouselProps {
  movies: Movie[];
  onMoviePress: (slug: string) => void;
}

export function TrendingCarousel({ movies, onMoviePress }: TrendingCarouselProps) {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto scroll every 3 seconds
  useEffect(() => {
    if (movies.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % movies.length;
        flatListRef.current?.scrollToOffset({
          offset: nextIndex * (ITEM_WIDTH + SPACING),
          animated: true,
        });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [movies.length]);

  const renderItem = ({ item, index }: { item: Movie; index: number }) => {
    const isActive = index === currentIndex;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onMoviePress(item.slug)}
        style={[styles.itemContainer, isActive && styles.activeItem]}
      >
        <View style={styles.card}>
          <Image
            source={{ uri: getImageUrl(item.poster_url) }}
            style={styles.poster}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.95)']}
            style={styles.gradient}
          >
            <View style={styles.rankBadge}>
              <Text style={styles.rankNumber}>{index + 1}</Text>
            </View>
            
            <View style={styles.info}>
              <Text style={styles.movieTitle} numberOfLines={2}>
                {item.name}
              </Text>
              
              <View style={styles.metadata}>
                {item.year && (
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar-outline" size={14} color={Colors.textSecondary} />
                    <Text style={styles.metaText}>{item.year}</Text>
                  </View>
                )}
                {item.quality && (
                  <View style={[styles.metaItem, styles.qualityBadge]}>
                    <Text style={styles.qualityText}>{item.quality}</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={styles.playButton}
                onPress={() => onMoviePress(item.slug)}
              >
                <Ionicons name="play" size={20} color="#000" />
                <Text style={styles.playText}>Xem ngay</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={movies.slice(0, 10)}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH + SPACING}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / (ITEM_WIDTH + SPACING));
          setCurrentIndex(index);
        }}
      />
      
      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {movies.slice(0, 10).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT + 60,
    marginTop: 20,
    marginBottom: 10,
  },
  listContent: {
    paddingHorizontal: (width - ITEM_WIDTH) / 2,
    paddingVertical: 10,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    marginHorizontal: SPACING / 2,
    transform: [{ scale: 0.9 }],
    opacity: 0.6,
  },
  activeItem: {
    transform: [{ scale: 1 }],
    opacity: 1,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.secondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 16,
  },
  rankBadge: {
    position: 'absolute',
    top: -120,
    left: 12,
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  rankNumber: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  info: {
    gap: 10,
  },
  movieTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  qualityBadge: {
    backgroundColor: 'rgba(229, 9, 20, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  qualityText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeDot: {
    width: 24,
    backgroundColor: Colors.primary,
  },
});
