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
import { BASE_URL } from '../../config';
import { useUser } from '../../backend/context/UserIdContext';

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
  const { userId } = useUser();

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

  const [nameError, setNameError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [heightError, setHeightError] = useState('');
  const [weightError, setWeightError] = useState('');
  const [dietTypeError, setDietTypeError] = useState('');
  const [activityLevelError, setActivityLevelError] = useState('');
  const [allergiesError, setAllergiesError] = useState('');
  const [healthGoalError, setHealthGoalError] = useState('');
  const [medicalConditionError, setMedicalConditionError] = useState('');

  const validateName = (value: string) => {
    if (!value.trim()) {
      setNameError('Name is required');
      return false;
    } else if (!/^[A-Za-z\s]+$/.test(value)) {
      setNameError('Name can only contain letters and spaces');
      return false;
    } else if (value.trim().length < 2) {
      setNameError('Name must be at least 2 characters long');
      return false;
    } else if (value.trim().length > 50) {
      setNameError('Name should not exceed 50 characters');
      return false;
    } else {
      setNameError('');
      return true;
    }
  };

  const validateAge = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
      setAgeError('Age is required');
      return false;
    }

    if (!/^\d+$/.test(trimmed)) {
      setAgeError('Age must be a number');
      return false;
    }

    const num = Number(trimmed);
    if (num < 5 || num > 100) {
      setAgeError('Age must be between 5 and 100');
      return false;
    }

    setAgeError('');
    return true;
  };

  const validateGender = (value: string) => {
    if (!value) {
      setGenderError('Please select your gender');
      return false;
    }

    setGenderError('');
    return true;
  };
  const validateHeight = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
      setHeightError('Height is required');
      return false;
    }

    if (!/^\d+$/.test(trimmed)) {
      setHeightError('Height must be a number');
      return false;
    }

    const num = Number(trimmed);
    if (num < 50 || num > 250) {
      setHeightError('Height must be between 50 cm and 250 cm');
      return false;
    }

    setHeightError('');
    return true;
  };

  const validateWeight = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
      setWeightError('Weight is required');
      return false;
    }

    if (!/^\d+$/.test(trimmed)) {
      setWeightError('Weight must be a number');
      return false;
    }

    const num = Number(trimmed);
    if (num < 10 || num > 300) {
      setWeightError('Weight must be between 10 kg and 300 kg');
      return false;
    }

    setWeightError('');
    return true;
  };

  const validateDietType = (value: string) => {
    if (!value) {
      setDietTypeError('Please select a diet type');
      return false;
    }

    setDietTypeError('');
    return true;
  };

  const validateActivityLevel = (value: string) => {
    if (!value) {
      setActivityLevelError('Please select your activity level');
      return false;
    }

    setActivityLevelError('');
    return true;
  };

  const validateAllergies = (value: string) => {
    if (value && value.length > 100) {
      setAllergiesError('Allergies cannot exceed 100 characters');
      return false;
    }
    setAllergiesError('');
    return true;
  };

  const validateHealthGoal = (value: string) => {
    if (value && value.length > 100) {
      setHealthGoalError('Health Goal cannot exceed 100 characters');
      return false;
    }
    setHealthGoalError('');
    return true;
  };

  const validateMedicalCondition = (value: string) => {
    if (value && value.length > 100) {
      setMedicalConditionError(
        'Medical Condition cannot exceed 100 characters',
      );
      return false;
    }
    setMedicalConditionError('');
    return true;
  };

  // Validation
  const validateFields = () => {
    const isNameValid = validateName(name);
    const isAgeValid = validateAge(age);
    const isGenderValid = validateGender(gender);
    const isHeightValid = validateHeight(height);
    const isWeightValid = validateWeight(weight);
    const isDietTypeValid = validateDietType(dietType);
    const isActivityLevelValid = validateActivityLevel(activityLevel);

    return (
      isNameValid &&
      isAgeValid &&
      isGenderValid &&
      isHeightValid &&
      isWeightValid &&
      isDietTypeValid &&
      isActivityLevelValid
    );
  };

  // Determine if the form is valid
  const isFormValid =
    name &&
    !nameError &&
    age &&
    !ageError &&
    gender &&
    !genderError &&
    height &&
    !heightError &&
    weight &&
    !weightError &&
    dietType &&
    !dietTypeError &&
    activityLevel &&
    !activityLevelError &&
    !allergiesError &&
    !healthGoalError &&
    !medicalConditionError;

  // Submit handler
  const handleSubmit = async () => {
    if (!validateFields()) return;
    if (!validateAllergies(allergies)) return;
    if (!validateHealthGoal(healthGoal)) return;

    if (!validateMedicalCondition(medicalCondition)) return;

    try {
      if (!userId) {
        Alert.alert('Error', 'User ID not found. Please log in again.');
        return;
      }

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
          style={[styles.input, nameError ? styles.inputError : null]}
          placeholder="Enter your name"
          value={name}
          onChangeText={text => {
            setName(text);
            validateName(text); // Validate live as user types
          }}
          onBlur={() => validateName(name)} // Recheck when leaving the field
        />
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

        {/* Age */}
        <Text style={styles.label}>Age:</Text>
        <TextInput
          style={[styles.input, ageError ? styles.inputError : null]}
          placeholder="Enter your age"
          value={age}
          onChangeText={text => {
            setAge(text);
            validateAge(text); // live validation
          }}
          onBlur={() => validateAge(age)} // validate on leaving the field
          keyboardType="numeric"
        />
        {ageError ? <Text style={styles.errorText}>{ageError}</Text> : null}

        {/* Gender */}
        <Text style={styles.label}>Gender:</Text>
        <View
          style={[styles.pickerWrapper, genderError ? styles.inputError : null]}
        >
          <Picker
            selectedValue={gender}
            onValueChange={itemValue => {
              setGender(itemValue);
              validateGender(itemValue); // Validate on change
            }}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>
        {genderError ? (
          <Text style={styles.errorText}>{genderError}</Text>
        ) : null}

        {/* Height */}
        <Text style={styles.label}>Height (cm):</Text>
        <TextInput
          style={[styles.input, heightError ? styles.inputError : null]}
          placeholder="Enter your height"
          value={height}
          onChangeText={text => {
            setHeight(text);
            validateHeight(text); // Live validation
          }}
          onBlur={() => validateHeight(height)} // Validate on leaving field
          keyboardType="numeric"
        />
        {heightError ? (
          <Text style={styles.errorText}>{heightError}</Text>
        ) : null}

        {/* Weight */}
        <Text style={styles.label}>Weight (kg):</Text>
        <TextInput
          style={[styles.input, weightError ? styles.inputError : null]}
          placeholder="Enter your weight"
          value={weight}
          onChangeText={text => {
            setWeight(text);
            validateWeight(text); // Live validation
          }}
          onBlur={() => validateWeight(weight)} // Validate on leaving field
          keyboardType="numeric"
        />
        {weightError ? (
          <Text style={styles.errorText}>{weightError}</Text>
        ) : null}

        {/* Diet Type */}
        <Text style={styles.label}>Diet Type:</Text>
        <View
          style={[
            styles.pickerWrapper,
            dietTypeError ? styles.inputError : null,
          ]}
        >
          <Picker
            selectedValue={dietType}
            onValueChange={itemValue => {
              setDietType(itemValue);
              validateDietType(itemValue); // Validate live
            }}
          >
            <Picker.Item label="Select Diet Type" value="" />
            <Picker.Item label="Vegetarian" value="veg" />
            <Picker.Item label="Non-Vegetarian" value="nonveg" />
          </Picker>
        </View>
        {dietTypeError ? (
          <Text style={styles.errorText}>{dietTypeError}</Text>
        ) : null}

        {/* Allergies */}
        <Text style={styles.label}>Allergies:</Text>
        <TextInput
          style={[styles.input, allergiesError ? styles.inputError : null]}
          placeholder="Enter any allergies (optional)"
          value={allergies}
          onChangeText={text => {
            setAllergies(text);
            if (text.length > 100) {
              setAllergiesError('Allergies cannot exceed 100 characters');
            } else {
              setAllergiesError('');
            }
          }}
          onBlur={() => validateAllergies(allergies)}
        />
        {allergiesError ? (
          <Text style={styles.errorText}>{allergiesError}</Text>
        ) : null}

        <Text style={styles.label}>Health Goal:</Text>
        <TextInput
          style={[styles.input, healthGoalError ? styles.inputError : null]}
          placeholder="Enter your health goal (optional)"
          value={healthGoal}
          onChangeText={text => {
            setHealthGoal(text);
            if (text.length > 100) {
              setHealthGoalError('Health Goal cannot exceed 100 characters');
            } else {
              setHealthGoalError('');
            }
          }}
          onBlur={() => validateHealthGoal(healthGoal)}
        />
        {healthGoalError ? (
          <Text style={styles.errorText}>{healthGoalError}</Text>
        ) : null}

        {/* Activity Level */}
        <Text style={styles.label}>Activity Level:</Text>
        <View
          style={[
            styles.pickerWrapper,
            activityLevelError ? styles.inputError : null,
          ]}
        >
          <Picker
            selectedValue={activityLevel}
            onValueChange={itemValue => {
              setActivityLevel(itemValue);
              validateActivityLevel(itemValue); // Validate live
            }}
          >
            <Picker.Item label="Select Activity Level" value="" />
            <Picker.Item label="Low" value="Low" />
            <Picker.Item label="Moderate" value="Moderate" />
            <Picker.Item label="Highly Active" value="Highly Active" />
            <Picker.Item label="Athlete" value="Athlete" />
          </Picker>
        </View>
        {activityLevelError ? (
          <Text style={styles.errorText}>{activityLevelError}</Text>
        ) : null}

        {/* Medical Condition */}
        <Text style={styles.label}>Medical Condition:</Text>
        <TextInput
          style={[
            styles.input,
            medicalConditionError ? styles.inputError : null,
          ]}
          placeholder="Enter any medical condition (optional)"
          value={medicalCondition}
          onChangeText={text => {
            setMedicalCondition(text);
            if (text.length > 100) {
              setMedicalConditionError(
                'Medical Condition cannot exceed 100 characters',
              );
            } else {
              setMedicalConditionError('');
            }
          }}
          onBlur={() => validateMedicalCondition(medicalCondition)}
        />
        {medicalConditionError ? (
          <Text style={styles.errorText}>{medicalConditionError}</Text>
        ) : null}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.button, !isFormValid && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!isFormValid} // disables touch
        >
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
  inputError: {
    borderColor: 'red',
  },

  errorText: {
    color: 'red',
    fontSize: 13,
    marginTop: 4,
    marginLeft: 4,
  },
  buttonDisabled: {
    backgroundColor: '#a0c4ff', // lighter blue to indicate disabled
  },
});
