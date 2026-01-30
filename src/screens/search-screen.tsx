import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { MovieService } from '../services';
import { LoadingSpinner, ErrorMessage, MovieCard } from '../components';
import { Colors } from '../constants';
import { useDebounce } from '../hooks';
import { Movie } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SearchScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebounce(searchText, 500);

  const { data, isLoading, error } = useQuery({
    queryKey: ['search', debouncedSearch],
    queryFn: () =>
      MovieService.searchMovies({ keyword: debouncedSearch, limit: 20 }),
    enabled: debouncedSearch.length > 0,
  });

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const handleClear = () => {
    setSearchText('');
    Keyboard.dismiss();
  };

  const renderMovie = ({ item }: { item: Movie }) => (
    <MovieCard
      movie={item}
      variant="grid"
      onPress={() => {
        navigation.navigate('MovieDetail', { slug: item.slug });
      }}
    />
  );

  const renderEmpty = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (searchText.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={64} color={Colors.textSecondary} />
          <Text style={styles.emptyText}>Tìm kiếm phim</Text>
          <Text style={styles.emptySubtext}>
            Nhập tên phim để tìm kiếm
          </Text>
        </View>
      );
    }

    if (error) {
      return <ErrorMessage message="Có lỗi xảy ra khi tìm kiếm" />;
    }

    if (data && data.data.items.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="film-outline" size={64} color={Colors.textSecondary} />
          <Text style={styles.emptyText}>Không tìm thấy kết quả</Text>
          <Text style={styles.emptySubtext}>
            Thử tìm kiếm với từ khóa khác
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm phim..."
            placeholderTextColor={Colors.textSecondary}
            value={searchText}
            onChangeText={handleSearch}
            autoFocus
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={handleClear}>
              <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={data?.data.items || []}
        renderItem={renderMovie}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  listContainer: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  movieItem: {
    flex: 1 / 3,
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
  },
});
