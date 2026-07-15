import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '../config';

export default function MatchListScreen({ navigation }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/matches`)
      .then(res => res.json())
      .then(data => {
        setMatches(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Could not connect to API');
        setLoading(false);
      });
  }, []);

  if (loading) return <View style={styles.centre}><ActivityIndicator size="large" /></View>;
  if (error) return <View style={styles.centre}><Text>{error}</Text></View>;

  return (
    <SafeAreaView style={styles.container}>
      
      <Text style={styles.title}>Gaelic Live Scores</Text>

      <Image 
        source={require('../assets/gaa-painting.png')} 
        style={styles.headerImage}
        resizeMode="cover"
      />
      
      <FlatList
        data={matches}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}
          onPress={() => navigation.navigate('Scoring', { match: item })}>
            <Text style={styles.teams}>{item.home_team} vs {item.away_team}</Text>
            <Text style={styles.score}>
              {item.home_goals}-{item.home_points} : {item.away_goals}-{item.away_points}
            </Text>
            <Text style={styles.status}>{item.status}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: 40, 
    paddingHorizontal: 16, 
    backgroundColor: '#f5f5f5' 
  },
  centre: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginVertical: 16 
  },
  headerImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 20,
  },
  card: { backgroundColor: 'white', padding: 16, borderRadius: 8, marginBottom: 12 },
  teams: { fontSize: 16, fontWeight: '600' },
  score: { fontSize: 20, fontWeight: 'bold', marginTop: 4 },
  status: { fontSize: 12, color: '#888', marginTop: 4 },
});