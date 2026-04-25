import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../config';
import { useUser } from '../context/UserIdContext';
import { authFetch } from '../utils/api';

export default function ProfileForm() {
  const navigation = useNavigation<any>();
  const { userId } = useUser();

  const [submitting, setSubmitting] = useState(false);

  // Basic info
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  // Required backend fields
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [dietType, setDietType] = useState('');
  const [healthGoal, setHealthGoal] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');

  const validate = () => {
    if (
      !name ||
      !age ||
      !gender ||
      !weight ||
      !height ||
      !dietType ||
      !healthGoal ||
      !activityLevel
    ) {
      Alert.alert('Error', 'Please fill all required fields');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert('Error', 'User not found');
      return;
    }

    if (!validate()) return;

    setSubmitting(true);

    try {
      const res = await authFetch(`${BASE_URL}/api/users/addProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          profile: {
            name,
            age: Number(age),
            gender,

            weight: Number(weight),
            height: Number(height),

            dietType,
            healthGoal,
            activityLevel,

            allergies,
            medicalConditions,
          },
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('Success', 'Profile created successfully', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert('Error', data.message || 'Failed to create profile');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Profile</Text>

      {/* BASIC INFO */}
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
        style={styles.input}
      />

      {/* BODY INFO */}
      <TextInput
        placeholder="Weight (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Height (cm)"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
        style={styles.input}
      />

      {/* GOALS */}
      <TextInput
        placeholder="Diet Type (veg/non-veg/vegan)"
        value={dietType}
        onChangeText={setDietType}
        style={styles.input}
      />
      <TextInput
        placeholder="Health Goal (lose/gain/maintain)"
        value={healthGoal}
        onChangeText={setHealthGoal}
        style={styles.input}
      />
      <TextInput
        placeholder="Activity Level (low/medium/high)"
        value={activityLevel}
        onChangeText={setActivityLevel}
        style={styles.input}
      />

      {/* OPTIONAL */}
      <TextInput
        placeholder="Allergies (optional)"
        value={allergies}
        onChangeText={setAllergies}
        style={styles.input}
      />
      <TextInput
        placeholder="Medical Conditions (optional)"
        value={medicalConditions}
        onChangeText={setMedicalConditions}
        style={styles.input}
      />

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={submitting}
        style={[styles.button, submitting && { opacity: 0.6 }]}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Profile</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
