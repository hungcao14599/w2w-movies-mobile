import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { RootStackParamList } from '../navigation/types';
import { MovieService } from '../services';
import { LoadingSpinner, ErrorMessage } from '../components';
import { Colors } from '../constants';
import { EpisodeData } from '../types';

const { width, height } = Dimensions.get('window');

type WatchMovieScreenRouteProp = RouteProp<RootStackParamList, 'WatchMovie'>;

export default function WatchMovieScreen() {
  const route = useRoute<WatchMovieScreenRouteProp>();
  const { slug } = route.params;

  const [selectedServer, setSelectedServer] = useState(0);
  const [selectedEpisode, setSelectedEpisode] = useState(0);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>('');

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['movie-detail', slug],
    queryFn: () => MovieService.getMovieDetail(slug),
  });

  // Debug raw response
  console.log('📦 Raw response:', response ? 'exists' : 'null');
  console.log('📦 Response keys:', response ? Object.keys(response) : []);
  
  const movie = response?.movie;
  const episodes = response?.episodes || []; // Episodes ở response top level, không phải trong movie
  
  console.log('🎬 Movie exists:', !!movie);
  console.log('🎬 Movie name:', movie?.name);
  console.log('📺 Episodes count:', episodes.length);
  console.log('📺 Episodes structure:', episodes[0] ? Object.keys(episodes[0]) : []);
  
  const currentServerEpisodes = episodes[selectedServer]?.server_data || [];
  const currentEpisode = currentServerEpisodes[selectedEpisode];
  
  console.log('🎯 Current server:', selectedServer, episodes[selectedServer]?.server_name);
  console.log('📝 Server episodes:', currentServerEpisodes.length);
  console.log('🎥 Current episode:', currentEpisode?.name);
  console.log('🔗 Video URL (m3u8):', currentEpisode?.link_m3u8);
  console.log('🔗 Video URL (embed):', currentEpisode?.link_embed);
  console.log('🎯 Current server:', selectedServer, episodes[selectedServer]?.server_name);
  console.log('📝 Server episodes:', currentServerEpisodes.length);
  console.log('🎥 Current episode:', currentEpisode?.name);
  console.log('🔗 Video URL (m3u8):', currentEpisode?.link_m3u8);
  console.log('🔗 Video URL (embed):', currentEpisode?.link_embed);

  // Get video URL - prefer link_m3u8, fallback to link_embed
  const videoUrl = currentEpisode?.link_m3u8 || currentEpisode?.link_embed || '';
  console.log('✅ Final video URL:', videoUrl);

  // Initialize video player with current episode URL
  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = false;
    player.play();
  });

  // Update video source when episode changes
  React.useEffect(() => {
    const newVideoUrl = currentEpisode?.link_m3u8 || currentEpisode?.link_embed || '';
    console.log('🔄 Changing video to:', newVideoUrl);
    if (newVideoUrl) {
      player.replace(newVideoUrl);
      player.play();
    }
  }, [currentEpisode, selectedServer, selectedEpisode]);

  const handleEpisodeSelect = (index: number) => {
    setSelectedEpisode(index);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !movie) {
    return <ErrorMessage message="Không thể tải phim. Vui lòng thử lại sau." />;
  }

  return (
    <View style={styles.container}>
      {/* Video Player */}
      <View style={styles.videoContainer}>
        {currentEpisode && videoUrl ? (
          <VideoView
            style={styles.video}
            player={player}
            nativeControls
            contentFit="contain"
          />
        ) : (
          <View style={styles.noVideoContainer}>
            <Ionicons name="film-outline" size={64} color={Colors.textSecondary} />
            <Text style={styles.noVideoText}>
              {episodes.length === 0 
                ? 'Phim chưa có tập nào' 
                : currentServerEpisodes.length === 0
                ? 'Server này không có tập phim'
                : 'Không có video khả dụng'}
            </Text>
            {currentEpisode && !videoUrl && (
              <Text style={styles.debugText}>
                Tập: {currentEpisode.name} - Không có link video
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Movie Info & Episodes */}
      <ScrollView style={styles.infoContainer}>
        <Text style={styles.movieTitle}>{movie.name}</Text>
        <Text style={styles.episodeTitle}>
          {currentEpisode ? currentEpisode.name : 'Chọn tập phim'}
        </Text>

        {/* Server Selection */}
        {episodes.length > 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chọn server</Text>
            <View style={styles.serverContainer}>
              {episodes.map((server, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.serverButton,
                    selectedServer === index && styles.serverButtonActive,
                  ]}
                  onPress={() => {
                    setSelectedServer(index);
                    setSelectedEpisode(0);
                  }}
                >
                  <Text
                    style={[
                      styles.serverButtonText,
                      selectedServer === index && styles.serverButtonTextActive,
                    ]}
                  >
                    {server.server_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Episode List */}
        {currentServerEpisodes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Danh sách tập ({currentServerEpisodes.length} tập)
            </Text>
            <View style={styles.episodeGrid}>
              {currentServerEpisodes.map((episode: EpisodeData, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.episodeButton,
                    selectedEpisode === index && styles.episodeButtonActive,
                  ]}
                  onPress={() => handleEpisodeSelect(index)}
                >
                  <Text
                    style={[
                      styles.episodeButtonText,
                      selectedEpisode === index && styles.episodeButtonTextActive,
                    ]}
                  >
                    {episode.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  videoContainer: {
    width: width,
    height: width * (9 / 16),
    backgroundColor: Colors.secondary,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  noVideoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noVideoText: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginTop: 16,
  },
  debugText: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  infoContainer: {
    flex: 1,
    padding: 16,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  episodeTitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  serverContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serverButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.secondary,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  serverButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  serverButtonText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  serverButtonTextActive: {
    color: Colors.background,
  },
  episodeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  episodeButton: {
    minWidth: 60,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  episodeButtonActive: {
    backgroundColor: Colors.primary,
  },
  episodeButtonText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  episodeButtonTextActive: {
    color: Colors.background,
  },
});
