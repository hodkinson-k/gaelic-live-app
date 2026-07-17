import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '../config';

export default function MatchListScreen({ navigation }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMatches = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/matches`);
      const data = await res.json();

      setMatches(data);
      setError(null);
    } catch (err) {
      setError('Could not connect to API');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMatches();
    }, [])
  );

  const statusLabel = {
    scheduled: 'Scheduled',
    active: '● Active',
    half_time: '● Half Time',
    full_time: '● Full Time',
  };

  const statusColour = {
    scheduled: '#5a5a8a',
    active: '#4ade80',
    half_time: '#facc15',
    full_time: '#f87171',
  };

  const sortedMatches = [...matches].sort((a, b) => {
    const order = {
      active: 0,
      half_time: 1,
      scheduled: 2,
      full_time: 3,
    };
  
    return order[a.status] - order[b.status];
  });

  if (loading) {
    return (
      <View style={styles.centre}>
        <ActivityIndicator size="large" color="#4ade80" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centre}>
        <Text style={{ color: '#fff' }}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
  
      <Text style={styles.title}>GAELIC LIVE</Text>
      <Text style={styles.subtitle}>Live Match Centre</Text>
  
      <Image
        source={require('../assets/gaa-painting.png')}
        style={styles.headerImage}
        resizeMode="cover"
      />
  
      <FlatList
        data={sortedMatches}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => (
  
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('Scoring', { match: item })
            }
            style={[
              styles.card,
              {
                borderLeftColor: statusColour[item.status],
              },
            ]}
          >
  
            <View style={styles.teamRow}>
              <Text style={styles.teamName}>{item.home_team}</Text>
              <Text style={styles.teamName}>{item.away_team}</Text>
            </View>
  
            <View style={styles.scoreRow}>
  
              <View style={styles.scoreBlock}>
                <Text style={styles.homeScore}>
                  {item.home_goals}-{item.home_points}
                </Text>
              </View>
  
              <View style={styles.statusBlock}>
                <Text
                  style={[
                    styles.status,
                    {
                      color: statusColour[item.status],
                    },
                  ]}
                >
                  {statusLabel[item.status]}
                </Text>
              </View>
  
              <View style={styles.scoreBlock}>
                <Text style={styles.awayScore}>
                  {item.away_goals}-{item.away_points}
                </Text>
              </View>
  
            </View>
  
            <Text style={styles.chevron}>›</Text>
  
          </TouchableOpacity>
  
        )}
      />
  
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#13131f',
    paddingHorizontal: 16,
  },

  centre: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#13131f',
  },

  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 14,
  },

  subtitle: {
    color: '#8888aa',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 18,
    letterSpacing: 1,
  },

  headerImage: {
    width: '100%',
    height: 130,
    borderRadius: 18,
    marginBottom: 24,
  },

  card: {
    backgroundColor: '#1b1b2b',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a4a',
    borderLeftWidth: 6,
  },

  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  teamName: {
    color: '#8888aa',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '700',
  },

  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  scoreBlock: {
    flex: 1,
    alignItems: 'center',
  },

  statusBlock: {
    width: 95,
    alignItems: 'center',
  },

  homeScore: {
    fontSize: 34,
    fontWeight: '800',
    color: '#4ade80',
    letterSpacing: -1,
  },

  awayScore: {
    fontSize: 34,
    fontWeight: '800',
    color: '#60a5fa',
    letterSpacing: -1,
  },

  status: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  chevron: {
    color: '#555577',
    fontSize: 28,
    alignSelf: 'flex-end',
    marginTop: 12,
    marginRight: 2,
    fontWeight: '300',
  },

});