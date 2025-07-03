import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
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
        <Info
          label="🔗 Website"
          value={detail.Website !== 'N/A' ? detail.Website : 'Tidak tersedia'}
        />
      </View>

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.text}>{value}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E0E',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0E0E0E',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '500',
  },
  background: {
    width: '100%',
    height: 520,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingTop: 28,
    paddingBottom: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -40,
  },
  posterCard: {
    width: 160,
    height: 240,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#1F1F1F',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FAFAFA',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#BDBDBD',
    marginTop: 6,
    textAlign: 'center',
  },
  ratingBadge: {
    marginTop: 12,
    backgroundColor: '#FFD700',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#FFD700',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingText: {
    color: '#1A1A1A',
    fontWeight: '700',
    fontSize: 13.5,
  },
  sectionCard: {
    backgroundColor: '#181818',
    marginHorizontal: 20,
    marginTop: 24,
    padding: 18,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
    marginBottom: 2,
  },
  text: {
    fontSize: 15,
    color: '#E0E0E0',
    marginBottom: 10,
    lineHeight: 22,
  },
  plot: {
    color: '#D3D3D3',
    fontSize: 15.5,
    marginTop: 12,
    lineHeight: 24,
    textAlign: 'justify',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dividerLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  line: {
    flex: 1,
    height: 1.2,
    backgroundColor: '#303030',
    marginLeft: 12,
  },
  bottomSpace: {
    height: 50,
  },
});