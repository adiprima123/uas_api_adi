import { Ionicons } from '@expo/vector-icons';
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
import { LinearGradient } from 'expo-linear-gradient';

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
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeBanner, setActiveBanner] = useState(0);
  const router = useRouter();

  const bannerRef = useRef<ScrollView>(null);

  // Auto slide banner setiap 5 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBanner(prev => {
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
      const response = await fetch(`https://www.omdbapi.com/?apikey=b45dad4f&s=${search}`);
      const data = await response.json();

      if (data.Response === 'True') {
        setMovies(data.Search);
      } else {
        setError('Judul tidak ditemukan');
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
      {/* Banner & Search */}
      <View style={styles.stickyHeader}>
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

          {/* Gradient Overlay */}
          <LinearGradient
            colors={['transparent', '#121212']}
            style={styles.gradientOverlay}
          />
        </View>

        {/* Indicator */}
        <View style={styles.progressBarContainer}>
  {banners.map((_, index) => (
    <View
      key={index}
      style={[
        styles.progressBarSegment,
        {
          backgroundColor: index === activeBanner ? '#FFD700' : '#333',
          flex: 1,
        },
      ]}
    />
  ))}
</View>


        {/* Search Bar */}
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
      </View>

      {/* Movie Content */}
      <ScrollView style={styles.scrollArea}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFD700" />
          </View>
        ) : error ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name={error === 'Judul tidak ditemukan' ? "sad-outline" : "search-outline"}
              size={60}
              color="#888"
            />
            <Text style={styles.infoText}>
              {error === 'Anda harus cari film terlebih dahulu.'
                ? '🔎 Cari film favorit Anda'
                : error === 'Judul tidak ditemukan'
                  ? 'Film tidak ditemukan. Coba kata kunci lain.'
                  : error}
            </Text>
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
    height: 400,
    position: 'relative',
  },
  banner: {
    width: width,
    height: 400,
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -20,
    marginBottom: 16,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
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
    height: 80,
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
  
  card: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 20,
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

  progressBarContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  height: 6,
  marginTop: -20,
  marginBottom: 16,
  marginHorizontal: 230,
  borderRadius: 3,
  overflow: 'hidden',
  backgroundColor: '#222', // background dasar bar
},

progressBarSegment: {
  height: 6,
  marginHorizontal: 1,
  borderRadius: 3,
},

});
