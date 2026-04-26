import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOTAL = 8;
const getKey = () => `water_${new Date().toISOString().slice(0, 10)}`;

const WaterTracker = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem(getKey()).then(val =>
      setCount(val ? parseInt(val) : 0),
    );
  }, []);

  const toggle = async (index: number) => {
    const next = index < count ? index : index + 1;
    setCount(next);
    await AsyncStorage.setItem(getKey(), String(next));
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>💧 Water Intake</Text>
      <Text style={styles.subtitle}>
        {count} / {TOTAL} glasses today
      </Text>

      <View style={styles.drops}>
        {Array.from({ length: TOTAL }).map((_, i) => {
          const active = i < count;

          return (
            <TouchableOpacity
              key={i}
              style={[styles.dropBox, active && styles.activeDrop]}
              onPress={() => toggle(i)}
              activeOpacity={0.7}
            >
              <Text style={styles.dropText}>{active ? '💧' : ''}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const SIZE = 42;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 25,
    marginBottom: 16,
    borderRadius: 20,
    padding: 18,
    elevation: 7,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e90ff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 14,
  },
  drops: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 10,
  },
  dropBox: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 2,
    borderColor: '#d3d3d3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
  },
  activeDrop: {
    backgroundColor: '#1e90ff',
    borderColor: '#1e90ff',
  },
  dropText: {
    fontSize: 20,
  },
});

export default WaterTracker;
