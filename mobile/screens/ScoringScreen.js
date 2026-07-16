import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '../config';

export default function ScoringScreen({ route }) {
  const { match: initialMatch } = route.params;
  const [match, setMatch] = useState(initialMatch);
  const [undoVisible, setUndoVisible] = useState(false);
  const [lastAction, setLastAction] = useState(null);
  const undoTimer = useRef(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => { if (undoTimer.current) clearTimeout(undoTimer.current); };
  }, []);

  const postScore = async (team, type) => {
    const res = await fetch(
      `${API_URL}/api/matches/${match.id}/score/${team}/${type}`,
      { method: 'POST' }
    );
    const updated = await res.json();
    setMatch(updated);

    // Show undo button for 30 seconds
    setLastAction({ team, type });
    setUndoVisible(true);
    if (undoTimer.current) clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(() => {
      setUndoVisible(false);
      setLastAction(null);
    }, 30000);
  };

  const handleUndo = async () => {
    if (!lastAction) return;
    const res = await fetch(
      `${API_URL}/api/matches/${match.id}/score/${lastAction.team}/${lastAction.type}/undo`,
      { method: 'POST' }
    );
    const updated = await res.json();
    setMatch(updated);
    setUndoVisible(false);
    setLastAction(null);
    if (undoTimer.current) clearTimeout(undoTimer.current);
  };

  const updateStatus = (newStatus) => {
    const labels = {
      active: 'Start Match',
      half_time: 'End First Half',
      full_time: 'End Match',
    };
    Alert.alert(
      labels[newStatus] || 'Change Status',
      'This cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', style: 'destructive', onPress: async () => {
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
    full_time: null,
  };

  const statusPillLabel = {
    scheduled: 'Scheduled',
    active: '● Active',
    half_time: '● Half Time',
    full_time: '● Full Time',
  };

  const statusPillColor = {
    scheduled: '#5a5a8a',
    active: '#4ade80',
    half_time: '#facc15',
    full_time: '#f87171',
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Score Header */}
      <View style={styles.header}>
        <View style={styles.teamBlock}>
          <Text style={styles.teamName} numberOfLines={1}>
            {match.home_team}
          </Text>
          <Text style={[styles.teamScore, styles.homeScore]}>
            {match.home_goals}-{match.home_points}
          </Text>
        </View>

        <View style={styles.scoreDivider}>
          <Text style={styles.dividerText}>|</Text>
          <Text style={[
            styles.statusPill,
            { color: statusPillColor[match.status] }
          ]}>
            {statusPillLabel[match.status]}
          </Text>
        </View>

        <View style={styles.teamBlock}>
          <Text style={styles.teamName} numberOfLines={1}>
            {match.away_team}
          </Text>
          <Text style={[styles.teamScore, styles.awayScore]}>
            {match.away_goals}-{match.away_points}
          </Text>
        </View>
      </View>

      {/* Column Labels */}
      <View style={styles.colLabels}>
        <Text style={[styles.colLabel, { color: '#4ade80' }]}>HOME</Text>
        <Text style={[styles.colLabel, { color: '#60a5fa' }]}>AWAY</Text>
      </View>

      {/* Goal Buttons */}
      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.scoreBtn, styles.homeGoal]}
          onPress={() => postScore('home', 'goal')}
          activeOpacity={0.75}
        >
          <Text style={styles.btnEmoji}>⚽</Text>
          <Text style={styles.btnText}>GOAL</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.scoreBtn, styles.awayGoal]}
          onPress={() => postScore('away', 'goal')}
          activeOpacity={0.75}
        >
          <Text style={styles.btnEmoji}>⚽</Text>
          <Text style={styles.btnText}>GOAL</Text>
        </TouchableOpacity>
      </View>

      {/* Point Buttons */}
      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.scoreBtn, styles.homePoint]}
          onPress={() => postScore('home', 'point')}
          activeOpacity={0.75}
        >
          <Text style={styles.btnEmoji}>🏳</Text>
          <Text style={styles.btnText}>POINT</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.scoreBtn, styles.awayPoint]}
          onPress={() => postScore('away', 'point')}
          activeOpacity={0.75}
        >
          <Text style={styles.btnEmoji}>🏳</Text>
          <Text style={styles.btnText}>POINT</Text>
        </TouchableOpacity>
      </View>

      {/* Undo Button - only visible for 30s after a score */}
      <TouchableOpacity
        style={[styles.undoBtn, !undoVisible && styles.undoBtnHidden]}
        onPress={handleUndo}
        disabled={!undoVisible}
        activeOpacity={0.75}
      >
        <Text style={styles.undoBtnText}>↩ Undo Last Score</Text>
        <Text style={styles.undoSubText}>Disappears in 30s</Text>
      </TouchableOpacity>

      {/* Status Button */}
      {nextStatus[match.status] && (
        <TouchableOpacity
          style={styles.statusBtn}
          onPress={() => updateStatus(nextStatus[match.status])}
          activeOpacity={0.75}
        >
          <Text style={styles.statusBtnText}>
            {statusLabel[match.status]}
          </Text>
        </TouchableOpacity>
      )}

      {match.status === 'full_time' && (
        <View style={styles.fullTimeBox}>
          <Text style={styles.fullTimeText}>Match Complete</Text>
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#13131f',
    paddingHorizontal: 14,
    paddingTop: -8,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a4a',
    marginBottom: 16,
  },
  teamBlock: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    color: '#8888aa',
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  teamScore: {
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -1,
  },
  homeScore: { color: '#4ade80' },
  awayScore: { color: '#60a5fa' },
  scoreDivider: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  dividerText: {
    color: '#2a2a4a',
    fontSize: 32,
    fontWeight: '200',
  },
  statusPill: {
    fontSize: 9,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 4,
    fontWeight: '700',
  },

  // Column labels
  colLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  colLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 3,
  },

  // Score buttons
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  scoreBtn: {
    flex: 1,
    paddingVertical: 28,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  btnEmoji: { fontSize: 22 },
  btnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 2,
  },
  homeGoal: { backgroundColor: '#16a34a' },
  homePoint: { backgroundColor: '#15803d' },
  awayGoal: { backgroundColor: '#1d4ed8' },
  awayPoint: { backgroundColor: '#1e40af' },

  // Undo
  undoBtn: {
    backgroundColor: '#dc2626',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10,
  },
  undoBtnHidden: {
    backgroundColor: '#2a1a1a',
    opacity: 0.4,
  },
  undoBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  undoSubText: {
    color: '#fca5a5',
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 0.5,
  },

  // Status
  statusBtn: {
    backgroundColor: '#312e81',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  statusBtnText: {
    color: '#a5b4fc',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  // Full time
  fullTimeBox: {
    marginTop: 12,
    padding: 16,
    backgroundColor: '#14532d22',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4ade8033',
    alignItems: 'center',
  },
  fullTimeText: {
    color: '#4ade80',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});