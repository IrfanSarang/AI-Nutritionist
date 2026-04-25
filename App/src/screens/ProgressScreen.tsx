import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

import { useActiveProfile } from '../context/ActiveProfileContext';
import { useUser } from '../context/UserIdContext';
import { BASE_URL } from '../../config';
import { authFetch } from '../utils/api';

const ProgressScreen = () => {
  const { activeProfileId } = useActiveProfile();
  const { userId } = useUser();

  const [weightInput, setWeightInput] = useState('');
  const [weightLog, setWeightLog] = useState<
    { date: string; weight: number }[]
  >([]);

  const [loading, setLoading] = useState(true);

  // -------------------------------
  // FETCH EXISTING WEIGHT LOG
  // -------------------------------
  useEffect(() => {
    const fetchWeightLog = async () => {
      if (!userId || !activeProfileId) return;

      try {
        setLoading(true);

        const res = await authFetch(
          `${BASE_URL}/api/users/${userId}/${activeProfileId}/weightLog`,
          {
            method: 'GET',
          },
        );

        if (!res.ok) {
          throw new Error('Failed to fetch weight log');
        }

        const data = await res.json();
        setWeightLog(data.weightLog || []);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Failed to load weight history');
      } finally {
        setLoading(false);
      }
    };

    fetchWeightLog();
  }, [userId, activeProfileId]);

  // -------------------------------
  // LOG NEW WEIGHT
  // -------------------------------
  const logWeight = async () => {
    if (!weightInput || !userId || !activeProfileId) return;

    try {
      const res = await authFetch(
        `${BASE_URL}/api/users/${userId}/${activeProfileId}/weightLog`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            weight: parseFloat(weightInput),
          }),
        },
      );

      if (!res.ok) {
        throw new Error('Request failed');
      }

      const data = await res.json();
      setWeightLog(data.weightLog || []);
      setWeightInput('');
    } catch (err) {
      Alert.alert('Error', 'Failed to log weight');
    }
  };

  const labels = weightLog.map(e =>
    new Date(e.date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
    }),
  );

  const data = weightLog.map(e => e.weight);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Weight Progress</Text>

      {/* INPUT */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter weight (kg)"
          keyboardType="numeric"
          value={weightInput}
          onChangeText={setWeightInput}
        />

        <TouchableOpacity style={styles.button} onPress={logWeight}>
          <Text style={styles.buttonText}>Log</Text>
        </TouchableOpacity>
      </View>

      {/* LOADING STATE */}
      {loading ? (
        <View style={{ marginTop: 40 }}>
          <ActivityIndicator size="large" color="#4ea4e5" />
          <Text style={{ textAlign: 'center', marginTop: 10, color: '#666' }}>
            Loading your progress...
          </Text>
        </View>
      ) : data.length > 1 ? (
        <LineChart
          data={{
            labels,
            datasets: [{ data }],
          }}
          width={Dimensions.get('window').width - 32}
          height={260}
          chartConfig={{
            backgroundColor: '#4ea4e5',
            backgroundGradientFrom: '#4ea4e5',
            backgroundGradientTo: '#0b385b',
            color: () => '#fff',
            labelColor: () => '#fff',
          }}
          bezier
          style={{ borderRadius: 12, margin: 16 }}
        />
      ) : (
        <Text style={styles.empty}>
          No weight history yet. Start logging to see your progress.
        </Text>
      )}
    </ScrollView>
  );
};

export default ProgressScreen;

// -------------------------------
// STYLES
// -------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0b385b',
    marginBottom: 16,
  },

  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d0def3',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#4ea4e5',
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 15,
  },
});
