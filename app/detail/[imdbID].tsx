import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';

const { width } = Dimensions.get('window');

type MovieDetail = {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: { Source: string; Value: string }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
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
        const res = await fetch(`https://www.omdbapi.com/?apikey=b45dad4f&i=${imdbID}`);
        const data = await res.json();
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
      <ImageBackground
        source={{ uri: detail.Poster }}
        style={styles.background}
        blurRadius={30}
      >
        <View style={styles.overlay}>
          <Image source={{ uri: detail.Poster }} style={styles.posterCard} />
          <Text style={styles.title}>{detail.Title}</Text>
          <Text style={styles.subtitle}>
            {detail.Year} • {detail.Runtime} • {detail.Genre}
          </Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>⭐ {detail.imdbRating} / 10</Text>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.sectionCard}>
        <Info label="🎬 Sutradara" value={detail.Director} />
        <Info label="📝 Penulis" value={detail.Writer} />
        <Info label="🎭 Aktor" value={detail.Actors} />
      </View>

      <View style={styles.sectionCard}>
        <Info label="🌐 Bahasa" value={detail.Language} />
        <Info label="🏳️ Negara" value={detail.Country} />
        <Info label="🏆 Penghargaan" value={detail.Awards} />
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.dividerLabel}>
          <Text style={styles.sectionTitle}>📖 Sinopsis</Text>
          <View style={styles.line} />
        </View>
        <Text style={styles.plot}>{detail.Plot}</Text>
      </View>

      <View style={styles.sectionCard}>
        <Info label="📅 Rilis" value={detail.Released} />
        <Info label="🔞 Rating" value={detail.Rated} />
        <Info label="💽 DVD" value={detail.DVD} />
        <Info label="💵 Box Office" value={detail.BoxOffice} />
        <Info label="🏢 Produksi" value={detail.Production} />
        <Info label="🔗 Website" value={detail.Website !== 'N/A' ? detail.Website : 'Tidak tersedia'} />
      </View>

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.text}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
  },
  background: {
    width: '100%',
    height: 480,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(18,18,18,0.75)',
    padding: 20,
    alignItems: 'center',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    width: '100%',
  },
  posterCard: {
    width: 140,
    height: 210,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
    textAlign: 'center',
  },
  ratingBadge: {
    marginTop: 10,
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  ratingText: {
    color: '#121212',
    fontWeight: 'bold',
  },
  sectionCard: {
    backgroundColor: '#1E1E1E',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
  },
  text: {
    fontSize: 15,
    color: '#ddd',
    marginTop: 2,
  },
  plot: {
    color: '#ccc',
    fontSize: 15,
    marginTop: 10,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  dividerLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#444',
    marginLeft: 10,
  },
  bottomSpace: {
    height: 40,
  },
});
