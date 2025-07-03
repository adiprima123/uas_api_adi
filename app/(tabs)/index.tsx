import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

type Movie = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
};

const banners = [
  require('../../assets/images/insideout2.png'),
  require('../../assets/images/Marvel.jpg'),
  require('../../assets/images/itaewon.jpg'),
  require('../../assets/images/venom.jpg'),
  require('../../assets/images/next door exo.jpg'),
];

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'movie' | 'series' | 'episode'>('movie');
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeBanner, setActiveBanner] = useState(0);
  const router = useRouter();
  const bannerRef = useRef<ScrollView>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBanner((prev) => {
        const next = (prev + 1) % banners.length;
        bannerRef.current?.scrollTo({ x: next * width, animated: true });
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleBannerScroll = (event: any) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveBanner(slide);
  };

  const fetchMovies = async () => {
    if (!search.trim()) {
      setMovies(null);
      setError('Anda harus cari film terlebih dahulu.');
      return;
    }

    setLoading(true);
    setError('');
    setMovies(null);

    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=b45dad4f&s=${search}&type=${typeFilter}`);
      const data = await response.json();

      if (data.Response === 'True') {
        setMovies(data.Search);
      } else {
        setError(`Maaf film ini tidak ada ${typeFilter}.`);
      }
    } catch (e) {
      setError('Terjadi kesalahan saat mengambil data.');
    } finally {
      setLoading(false);
    }
  };

  const renderMovie = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`../detail/${item.imdbID}`)}
    >
      <Image
        source={{ uri: item.Poster !== 'N/A' ? item.Poster : 'https://via.placeholder.com/100x150?text=No+Poster' }}
        style={styles.poster}
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{item.Title}</Text>
        <View style={styles.metaContainer}>
          <Text style={styles.meta}>{item.Year}</Text>
          <Text style={styles.meta}>•</Text>
          <Text style={styles.meta}>{item.Type}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#888" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.stickyHeader}>
        {/* Banner */}
        <View style={styles.bannerWrapper}>
          <ScrollView
            ref={bannerRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleBannerScroll}
            scrollEventThrottle={16}
          >
            {banners.map((img, index) => (
              <Image key={index} source={img} style={styles.banner} />
            ))}
          </ScrollView>
          <LinearGradient colors={['transparent', '#121212']} style={styles.gradientOverlay} />
        </View>
        {/* Indicator - Bar Gepeng Horizontal */}
<View style={styles.bannerIndicator}>
  {banners.map((_, index) => (
    <View
      key={index}
      style={[
        styles.barItem,
        index === activeBanner && styles.barItemActive,
      ]}
    />
  ))}
</View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              placeholder="Cari film favorit Anda..."
              placeholderTextColor="#888"
              value={search}
              onChangeText={setSearch}
              style={styles.input}
              onSubmitEditing={fetchMovies}
            />
          </View>
        </View>

        {/* Type Filter */}
        <View style={styles.filterContainer}>
          {['movie', 'series', 'episode'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterButton,
                typeFilter === type && styles.filterButtonActive,
              ]}
              onPress={() => {
                setTypeFilter(type as 'movie' | 'series' | 'episode');
                fetchMovies(); // otomatis fetch ketika ganti type
              }}
            >
              <Text
                style={[
                  styles.filterText,
                  typeFilter === type && styles.filterTextActive,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Movie Results */}
      <ScrollView style={styles.scrollArea}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFD700" />
          </View>
        ) : error ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="sad-outline"
              size={60}
              color="#888"
            />
            <Text style={styles.infoText}>{error}</Text>
          </View>
        ) : movies ? (
          <>
            <Text style={styles.resultsTitle}>Hasil Pencarian</Text>
            <FlatList
              data={movies}
              keyExtractor={(item) => item.imdbID}
              renderItem={renderMovie}
              scrollEnabled={false}
              contentContainerStyle={styles.listContent}
            />
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="film-outline" size={60} color="#888" />
            <Text style={styles.infoText}>Cari film favorit Anda</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  bannerWrapper: {
    height: 300, // <== updated
    position: 'relative',
  },
  banner: {
    width: width,
    height: 300, // <== updated
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 300, // <== updated
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 25,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 50,
    paddingHorizontal: 20,
    height: 70,
  },
  searchIcon: {
    marginRight: 10,
    color: '#AAA',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#FFF',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
    gap: 15,
  },
  filterButton: {
    borderWidth: 1.5,
    borderColor: '#555',
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginHorizontal: 4,
    backgroundColor: '#1E1E1E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
  },
  filterButtonActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  filterText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  filterTextActive: {
    color: '#121212',
    fontWeight: 'bold',
  },
  bannerIndicator: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 6,
  marginTop: -18,
  marginBottom: 20,
},

barItem: {
  width: 20,         
  height: 4,        
  borderRadius: 2,
  backgroundColor: '#444',
  opacity: 0.4,
},

barItemActive: {
  backgroundColor: '#FFD700',
  opacity: 1,
},


  card: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 30,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  poster: {
    width: 70,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meta: {
    fontSize: 13,
    color: '#AAAAAA',
    marginRight: 8,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    marginHorizontal: 20,
  },
  listContent: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  infoText: {
    fontSize: 16,
    color: '#AAAAAA',
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  stickyHeader: {
    backgroundColor: '#121212',
    zIndex: 10,
    elevation: 10,
  },
  scrollArea: {
    flex: 1,
  },
});
