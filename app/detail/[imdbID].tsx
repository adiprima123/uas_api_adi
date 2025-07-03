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
  [key: string]: any;
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

      {/* Informasi Utama */}
      <Section title="Informasi Umum">
        <Info label="Sutradara" value={detail.Director} />
        <Info label="Penulis" value={detail.Writer} />
        <Info label="Pemeran" value={detail.Actors} />
        <Info label="Bahasa" value={detail.Language} />
        <Info label="Negara" value={detail.Country} />
        <Info label="Tanggal Rilis" value={detail.Released} />
        <Info label="Durasi" value={detail.Runtime} />
        <Info label="Rating Usia" value={detail.Rated} />
      </Section>

      {/* Sinopsis */}
      <Section title="Sinopsis">
        <Text style={styles.plot}>{detail.Plot}</Text>
      </Section>

      {/* Statistik Produksi */}
      <Section title="Produksi & Statistik">
        <Info label="Produksi" value={detail.Production} />
        <Info label="Box Office" value={detail.BoxOffice} />
        <Info label="Tersedia DVD" value={detail.DVD} />
        <Info label="Website" value={detail.Website !== 'N/A' ? detail.Website : 'Tidak tersedia'} />
        <Info label="Tipe" value={detail.Type} />
        <Info label="Penghargaan" value={detail.Awards} />
        <Info label="Jumlah Voter" value={detail.imdbVotes} />
      </Section>

      {/* Ratings */}
      <Section title="Ratings & Review">
        <Info label="Metascore" value={detail.Metascore} />
        {detail.Ratings?.map((rating: any, index: number) => (
          <Info key={index} label={rating.Source} value={rating.Value} />
        ))}
      </Section>

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.line} />
      {children}
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
    height: 500,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingTop: 30,
    paddingBottom: 34,
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
    padding: 20,
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
    lineHeight: 21,
  },
  plot: {
    fontSize: 15,
    color: '#D3D3D3',
    lineHeight: 23,
    textAlign: 'justify',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  line: {
    height: 1.2,
    backgroundColor: '#303030',
    marginBottom: 16,
  },
  bottomSpace: {
    height: 50,
  },
});
