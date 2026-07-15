import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '../config';

export default function ScoringScreen({ route }) {
  const { match: initialMatch } = route.params;
  const [match, setMatch] = useState(initialMatch);

  const postScore = async (team, type) => {
    const endpoint = `${API_URL}/api/matches/${match.id}/score/${team}/${type}`;
    const res = await fetch(endpoint, { method: 'POST' });
    const updated = await res.json();
    setMatch(updated);
  };

  const updateStatus = (newStatus) => {
    Alert.alert(
      'Change Match Status',
      `Set match to "${newStatus}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: async () => {
          const res = await fetch(
            `${API_URL}/api/matches/${match.id}/status?status=${newStatus}`,
            { method: 'PATCH' }
          );
          const updated = await res.json();
          setMatch(updated);
        }},
      ]
    );
  };

  const nextStatus = {
    scheduled: 'active',
    active: 'half_time',
    half_time: 'active',
    full_time: null,
  };

  const statusLabel = {
    scheduled: 'Start Match',
    active: 'End First Half',
    half_time: 'Start Second Half',
    full_time: 'Match Complete',
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Score Header */}
      <View style={styles.header}>
        <View style={styles.teamBlock}>
          <Text style={styles.teamName}>{match.home_team}</Text>
          <Text style={styles.teamScore}>
            {match.home_goals}-{match.home_points}
          </Text>
        </View>
        <View style={styles.teamBlock}>
          <Text style={styles.teamName}>{match.away_team}</Text>
          <Text style={styles.teamScore}>
            {match.away_goals}-{match.away_points}
          </Text>
        </View>
      </View>

      {/* Column Labels */}
      <View style={styles.colLabels}>
        <Text style={[styles.colLabel, styles.homeLabel]}>HOME</Text>
        <Text style={[styles.colLabel, styles.awayLabel]}>AWAY</Text>
      </View>

      {/* Goal Buttons */}
      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.scoreBtn, styles.homeGoal]}
          onPress={() => postScore('home', 'goal')}
        >
          <Text style={styles.btnText}>GOAL</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.scoreBtn, styles.awayGoal]}
          onPress={() => postScore('away', 'goal')}
        >
          <Text style={styles.btnText}>GOAL</Text>
        </TouchableOpacity>
      </View>

      {/* Point Buttons */}
      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.scoreBtn, styles.homePoint]}
          onPress={() => postScore('home', 'point')}
        >
          <Text style={styles.btnText}>POINT</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.scoreBtn, styles.awayPoint]}
          onPress={() => postScore('away', 'point')}
        >
          <Text style={styles.btnText}>POINT</Text>
        </TouchableOpacity>
      </View>

      {/* Status Button */}
      {nextStatus[match.status] && (
        <TouchableOpacity
          style={styles.statusBtn}
          onPress={() => updateStatus(nextStatus[match.status])}
        >
          <Text style={styles.statusBtnText}>
            {statusLabel[match.status]}
          </Text>
        </TouchableOpacity>
      )}

      {match.status === 'full_time' && (
        <Text style={styles.fullTimeText}>Match Complete</Text>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#13131f', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 24 },
  teamBlock: { alignItems: 'center' },
  teamName: { color: '#8888aa', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  teamScore: { color: '#e2e2f0', fontSize: 36, fontWeight: '700', marginTop: 4 },
  colLabels: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
  colLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  homeLabel: { color: '#4ade80' },
  awayLabel: { color: '#60a5fa' },
  btnRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  scoreBtn: { flex: 1, paddingVertical: 36, borderRadius: 16, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 2 },
  homeGoal: { backgroundColor: '#16a34a' },
  homePoint: { backgroundColor: '#15803d' },
  awayGoal: { backgroundColor: '#1d4ed8' },
  awayPoint: { backgroundColor: '#1e40af' },
  statusBtn: { marginTop: 12, backgroundColor: '#312e81', padding: 18, borderRadius: 14, alignItems: 'center' },
  statusBtnText: { color: '#a5b4fc', fontSize: 14, fontWeight: '700', letterSpacing: 1 },
  fullTimeText: { color: '#4ade80', textAlign: 'center', fontSize: 16, marginTop: 16 },
});