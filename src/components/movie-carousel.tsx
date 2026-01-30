import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MovieCard } from './movie-card';
import { Colors } from '../constants';
import { Movie } from '../types';

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  onMoviePress: (slug: string) => void;
  onSeeAll?: () => void;
  onEndReached?: () => void;
  isLoading?: boolean;
  showSeeAll?: boolean;
}

export const MovieCarousel: React.FC<MovieCarouselProps> = ({
  title,
  movies,
  onMoviePress,
  onSeeAll,
  onEndReached,
  isLoading = false,
  showSeeAll = true,
}) => {
  const flatListRef = useRef<FlatList>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const contentWidth = event.nativeEvent.contentSize.width;
    const layoutWidth = event.nativeEvent.layoutMeasurement.width;

    setShowLeftArrow(offsetX > 10);
    setShowRightArrow(offsetX < contentWidth - layoutWidth - 10);
  };

  const scrollLeft = () => {
    flatListRef.current?.scrollToOffset({
      offset: Math.max(0, (flatListRef.current as any)?._listRef?._scrollMetrics?.offset - 300),
      animated: true,
    });
  };

  const scrollRight = () => {
    flatListRef.current?.scrollToOffset({
      offset: (flatListRef.current as any)?._listRef?._scrollMetrics?.offset + 300,
      animated: true,
    });
  };

  const renderMovie = ({ item }: { item: Movie }) => (
    <MovieCard
      movie={item}
      variant="horizontal"
      onPress={() => onMoviePress(item.slug)}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {showSeeAll && onSeeAll && (
          <TouchableOpacity onPress={onSeeAll} style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>Xem tất cả</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.carouselContainer}>
        {showLeftArrow && (
          <TouchableOpacity style={[styles.arrow, styles.leftArrow]} onPress={scrollLeft}>
            <Ionicons name="chevron-back" size={28} color={Colors.text} />
          </TouchableOpacity>
        )}

        <FlatList
          ref={flatListRef}
          data={movies}
          renderItem={renderMovie}
          keyExtractor={(item, index) => `${item._id}-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.8}
          ListFooterComponent={
            isLoading ? (
              <View style={styles.loadingFooter}>
                <View style={styles.loadingDot} />
                <View style={[styles.loadingDot, styles.loadingDotDelay1]} />
                <View style={[styles.loadingDot, styles.loadingDotDelay2]} />
              </View>
            ) : null
          }
        />

        {showRightArrow && (
          <TouchableOpacity style={[styles.arrow, styles.rightArrow]} onPress={scrollRight}>
            <Ionicons name="chevron-forward" size={28} color={Colors.text} />
          </TouchableOpacity>
        )}
      </View>

      {isLoading && (
        <View style={styles.loadingIndicator}>
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 28,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  carouselContainer: {
    position: 'relative',
  },
  listContent: {
    paddingLeft: 16,
    paddingRight: 16,
    gap: 8,
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -24 }],
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  leftArrow: {
    left: 8,
  },
  rightArrow: {
    right: 8,
  },
  loadingIndicator: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  loadingFooter: {
    width: 80,
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    opacity: 0.3,
  },
  loadingDotDelay1: {
    opacity: 0.6,
  },
  loadingDotDelay2: {
    opacity: 1,
  },
});
