import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BASE_URL from '../config/url';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<any>();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // STEP 1: Send OTP
  const sendOtp = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${BASE_URL}/api/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep(2);
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const verifyOtp = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${BASE_URL}/api/users/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep(3);
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Reset Password
  const resetPassword = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${BASE_URL}/api/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        navigation.navigate('Login');
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.box}>
        <Text style={styles.title}>Forgot Password</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <TextInput
              placeholder="Enter Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={styles.button}
              onPress={sendOtp}
              disabled={loading || !email}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <TextInput
              placeholder="Enter OTP"
              value={otp}
              onChangeText={setOtp}
              style={styles.input}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={styles.button}
              onPress={verifyOtp}
              disabled={loading || !otp}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <TextInput
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              style={styles.input}
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.button}
              onPress={resetPassword}
              disabled={loading || !newPassword}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Reset Password</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef6ff',
    justifyContent: 'center',
    padding: 20,
  },
  box: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1e90ff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});