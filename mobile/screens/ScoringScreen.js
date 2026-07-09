import { View, Text, StyleSheet } from 'react-native';

export default function ScoringScreen({ route }) {
  const { match } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{match.home_team} vs {match.away_team}</Text>
      <Text>Scoring screen coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
});