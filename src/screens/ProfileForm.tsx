import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ProfileFormResponse = {
  data?: string;
  message?: string;
};

export type RootStackParamList = {
  ProfileScreen: undefined;
};

type ProfileFormNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProfileScreen'
>;

const ProfileForm = () => {
  const navigation = useNavigation<ProfileFormNavigationProp>();

  // States
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [dietType, setDietType] = useState('');
  const [allergies, setAllergies] = useState('');
  const [healthGoal, setHealthGoal] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [medicalCondition, setMedicalCondition] = useState('');

  // Validation
  const validateFields = () => {
    if (!name || !age || !gender || !height || !weight) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return false;
    }
    if (isNaN(Number(age)) || isNaN(Number(height)) || isNaN(Number(weight))) {
      Alert.alert(
        'Validation Error',
        'Age, Height, and Weight must be numbers',
      );
      return false;
    }
    return true;
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!validateFields()) return;

    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User ID not found. Please log in again.');
        return;
      }

      const BASE_URL = 'https://ai-nutritionist-5jyf.onrender.com';

      // Check existing profiles safely
      let existingProfiles: any[] = [];
      try {
        const checkResponse = await fetch(
          `${BASE_URL}/api/users/${userId}/profiles`,
        );
        const contentType = checkResponse.headers.get('content-type');

        if (contentType?.includes('application/json')) {
          const json: unknown = await checkResponse.json();
          if (Array.isArray(json)) {
            existingProfiles = json;
          } else {
            console.warn('Profiles API did not return an array');
            existingProfiles = [];
          }
        } else {
          Alert.alert('Server Error', 'Cannot fetch existing profiles');
          return;
        }
      } catch (err) {
        console.warn('Failed to fetch profiles:', err);
        Alert.alert('Network Error', 'Failed to fetch existing profiles');
        return;
      }

      if (existingProfiles.length >= 3) {
        Alert.alert('Limit Reached', 'You can only create up to 3 profiles.');
        navigation.navigate('ProfileScreen');
        return;
      }

      // Prepare profile data
      const profileData = {
        name,
        age: Number(age),
        gender,
        height: Number(height),
        weight: Number(weight),
        dietType,
        allergies,
        healthGoal,
        activityLevel,
        medicalCondition,
      };

      // Create new profile safely
      let data: ProfileFormResponse = {};
      try {
        const response = await fetch(`${BASE_URL}/api/users/addProfile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, profile: profileData }),
        });

        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          const json: unknown = await response.json();
          if (typeof json === 'object' && json !== null) {
            data = json as ProfileFormResponse;
          } else {
            console.warn('AddProfile API returned unexpected data');
            data = {};
          }
        } else {
          Alert.alert('Server Error', 'Unexpected server response');
          return;
        }

        if (response.ok) {
          Alert.alert('Success', 'Profile created successfully!');
          navigation.navigate('ProfileScreen');
        } else {
          Alert.alert('Error', data.message || 'Something went wrong');
        }
      } catch (err) {
        console.error('Error creating profile:', err);
        Alert.alert('Network Error', 'Failed to create profile');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Profile Registration</Text>

      <View style={styles.formContainer}>
        {/* Name */}
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />

        {/* Age */}
        <Text style={styles.label}>Age:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        {/* Gender */}
        <Text style={styles.label}>Gender:</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={gender} onValueChange={setGender}>
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>

        {/* Height */}
        <Text style={styles.label}>Height (cm):</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your height"
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
        />

        {/* Weight */}
        <Text style={styles.label}>Weight (kg):</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your weight"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />

        {/* Diet Type */}
        <Text style={styles.label}>Diet Type:</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={dietType} onValueChange={setDietType}>
            <Picker.Item label="Select Diet Type" value="" />
            <Picker.Item label="Vegetarian" value="veg" />
            <Picker.Item label="Non-Vegetarian" value="nonveg" />
          </Picker>
        </View>

        {/* Allergies */}
        <Text style={styles.label}>Allergies:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter any allergies"
          value={allergies}
          onChangeText={setAllergies}
        />

        {/* Health Goal */}
        <Text style={styles.label}>Health Goal:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your health goal"
          value={healthGoal}
          onChangeText={setHealthGoal}
        />

        {/* Activity Level */}
        <Text style={styles.label}>Activity Level:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={activityLevel}
            onValueChange={setActivityLevel}
          >
            <Picker.Item label="Select Activity Level" value="" />
            <Picker.Item label="Low" value="low" />
            <Picker.Item label="Moderate" value="moderate" />
            <Picker.Item label="Highly Active" value="highly_active" />
            <Picker.Item label="Athlete" value="athlete" />
          </Picker>
        </View>

        {/* Medical Condition */}
        <Text style={styles.label}>Medical Condition:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter any medical condition"
          value={medicalCondition}
          onChangeText={setMedicalCondition}
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Create Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileForm;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingBottom: 20,
  },
  header: {
    fontSize: 26,
    alignSelf: 'center',
    marginBottom: 20,
    color: '#1e90ff',
    fontWeight: '600',
  },
  formContainer: {
    backgroundColor: '#c6ddf5',
    width: '90%',
    alignSelf: 'center',
    padding: 20,
    borderRadius: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
});
