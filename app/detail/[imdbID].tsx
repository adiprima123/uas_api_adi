import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from 'react-native';

type MovieDetail = {
  Title: string;
  Year: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Actors: string;
  Plot: string;
  Poster: string;
  imdbRating: string;
};

export default function DetailScreen() {
  const { imdbID } = useLocalSearchParams();
  const [detail, setDetail] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!imdbID) return;

    const fetchDetail = async () => {
      try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=b45dad4f&i=${imdbID}`);
        const data = await response.json();

        if (data.Response === 'True') {
          setDetail(data);
        } else {
          setError('Film tidak ditemukan.');
        }
      } catch (e) {
        setError('Gagal mengambil data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [imdbID]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  if (error || !detail) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || 'Terjadi kesalahan.'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: detail.Poster }} style={styles.poster} />
      <View style={styles.content}>
        <Text style={styles.title}>{detail.Title}</Text>
        <Text style={styles.subtitle}>{detail.Year} • {detail.Genre} • {detail.Runtime}</Text>
        <Text style={styles.label}>🎬 Sutradara:</Text>
        <Text style={styles.text}>{detail.Director}</Text>

        <Text style={styles.label}>🎭 Aktor:</Text>
        <Text style={styles.text}>{detail.Actors}</Text>

        <Text style={styles.label}>📝 Sinopsis:</Text>
        <Text style={styles.text}>{detail.Plot}</Text>

        <Text style={styles.rating}>⭐ Rating IMDb: {detail.imdbRating}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  poster: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  text: {
    fontSize: 15,
    color: '#444',
    marginTop: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#FFD700',
  },
});
