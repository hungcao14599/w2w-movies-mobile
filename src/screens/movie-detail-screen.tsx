import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { MovieService } from '../services';
import { LoadingSpinner, ErrorMessage } from '../components';
import { Colors } from '../constants';
import { getImageUrl } from '../utils';

const { width } = Dimensions.get('window');

type MovieDetailScreenRouteProp = RouteProp<RootStackParamList, 'MovieDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function MovieDetailScreen() {
  const route = useRoute<MovieDetailScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { slug } = route.params;

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['movie-detail', slug],
    queryFn: () => MovieService.getMovieDetail(slug),
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !response?.movie) {
    return <ErrorMessage message="Không thể tải thông tin phim. Vui lòng thử lại sau." />;
  }

  const movie = response.movie;

  const handleWatch = () => {
    navigation.navigate('WatchMovie', { slug: movie.slug });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Movie Poster */}
      <View style={styles.posterContainer}>
        <Image
          source={{ uri: getImageUrl(movie.poster_url) }}
          style={styles.poster}
        />
        <View style={styles.posterGradient}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={handleWatch}
          >
            <Ionicons name="play" size={32} color={Colors.background} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Movie Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{movie.name}</Text>
        <Text style={styles.originTitle}>{movie.origin_name}</Text>

        <View style={styles.metaContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{movie.year}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{movie.quality}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{movie.lang}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {movie.episode_current} / {movie.episode_total}
            </Text>
          </View>
        </View>

        {/* Rating */}
        {movie.tmdb && (
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.ratingText}>
              {movie.tmdb.vote_average.toFixed(1)} ({movie.tmdb.vote_count} đánh giá)
            </Text>
          </View>
        )}

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nội dung phim</Text>
          <Text style={styles.description}>{movie.content}</Text>
        </View>

        {/* Categories */}
        {movie.category && movie.category.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thể loại</Text>
            <View style={styles.tagContainer}>
              {movie.category.map((cat) => (
                <View key={cat._id} style={styles.tag}>
                  <Text style={styles.tagText}>{cat.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Actors */}
        {movie.actor && movie.actor.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Diễn viên</Text>
            <Text style={styles.text}>{movie.actor.join(', ')}</Text>
          </View>
        )}

        {/* Directors */}
        {movie.director && movie.director.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Đạo diễn</Text>
            <Text style={styles.text}>{movie.director.join(', ')}</Text>
          </View>
        )}

        {/* Countries */}
        {movie.country && movie.country.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quốc gia</Text>
            <Text style={styles.text}>
              {movie.country.map((c) => c.name).join(', ')}
            </Text>
          </View>
        )}

        {/* Watch Button */}
        <TouchableOpacity style={styles.watchButton} onPress={handleWatch}>
          <Ionicons name="play-circle" size={24} color={Colors.background} />
          <Text style={styles.watchButtonText}>Xem phim</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  posterContainer: {
    width: width,
    height: width * 1.5,
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  posterGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  originTitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  badge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  badgeText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  ratingText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  text: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 8,
  },
  watchButtonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
