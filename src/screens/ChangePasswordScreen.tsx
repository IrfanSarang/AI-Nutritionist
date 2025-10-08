import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../backend/context/UserIdContext';
import { BASE_URL } from '../../config';
import LinearGradient from 'react-native-linear-gradient';

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const { userId } = useUser();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [touched, setTouched] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Real-time validation
  useEffect(() => {
    const tempErrors = { current: '', new: '', confirm: '' };
    let disableButton = false;

    // Current password
    if (touched.current) {
      if (!currentPassword) {
        tempErrors.current = 'Current password is required';
        disableButton = true;
      }
    } else if (!currentPassword) {
      disableButton = true;
    }

    // New password
    if (touched.new) {
      if (!newPassword) {
        tempErrors.new = 'New password is required';
        disableButton = true;
      } else if (newPassword.length < 8) {
        tempErrors.new = 'New password must be at least 8 characters';
        disableButton = true;
      }
    } else if (!newPassword) {
      disableButton = true;
    }

    // Confirm password
    if (touched.confirm) {
      if (!confirmPassword) {
        tempErrors.confirm = 'Please confirm new password';
        disableButton = true;
      } else if (newPassword !== confirmPassword) {
        tempErrors.confirm = 'Passwords do not match';
        disableButton = true;
      }
    } else if (!confirmPassword) {
      disableButton = true;
    }

    setErrors(tempErrors);
    setIsButtonDisabled(disableButton);
  }, [currentPassword, newPassword, confirmPassword, touched]);

  const handleChangePassword = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID not found');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${BASE_URL}/api/users/${userId}/change-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        },
      );

      if (!res.ok) {
        const json: any = await res.json();
        throw new Error(json.message || 'Failed to change password');
      }

      Alert.alert('Success', 'Password changed successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient
        colors={['#00aaff', '#ffffff']}
        style={{ flex: 1, padding: 20 }}
      >
        <ScrollView contentContainerStyle={styles.body}>
          <Text style={styles.header}>Change Password</Text>

          <TextInput
            style={styles.input}
            placeholder="Current Password"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholderTextColor="#888"
            onFocus={() => setTouched(prev => ({ ...prev, current: true }))}
          />

          {errors.current ? (
            <Text style={styles.error}>{errors.current}</Text>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            placeholderTextColor="#888"
            onFocus={() => setTouched(prev => ({ ...prev, new: true }))}
          />
          {errors.new ? <Text style={styles.error}>{errors.new}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholderTextColor="#888"
            onFocus={() => setTouched(prev => ({ ...prev, confirm: true }))}
          />
          {errors.confirm ? (
            <Text style={styles.error}>{errors.confirm}</Text>
          ) : null}

          <TouchableOpacity
            style={[styles.button, isButtonDisabled && { opacity: 0.6 }]}
            onPress={handleChangePassword}
            disabled={loading || isButtonDisabled}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Change Password</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  body: {
    marginTop: 20,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#4287f5',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 5,
    fontSize: 16,
    color: '#333',
    borderColor: '#c1c2c0ff',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#4287f5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  error: { color: 'crimson', fontSize: 13, marginBottom: 10 },
});
