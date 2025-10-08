import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BASE_URL } from '../../config';

type RootStackParamList = {
  Login: undefined;
};

export default function ForgotPasswordScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpError, setOtpError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // ---------- Validation ----------
  const validateEmail = (text: string) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    if (!text.trim()) return 'Email is required.';
    if (!pattern.test(text.trim())) return 'Please enter a valid email.';
    return '';
  };

  const validateOtp = (text: string) => {
    if (!text) return 'OTP is required.';
    if (text.length !== 6) return 'OTP must be 6 digits.';
    return '';
  };

  const validatePassword = (text: string) => {
    if (!text) return 'Password is required.';
    if (text.length < 8) return 'Password must be at least 8 characters.';
    return '';
  };

  // ---------- Step 1: Send OTP ----------
  const sendOtp = async () => {
    const err = validateEmail(email);
    setEmailError(err);
    if (err) return;

    try {
      const response = await fetch(`${BASE_URL}/api/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data: any = await response.json();

      if (response.ok) {
        Alert.alert('Success', data.message);
        setStep('otp'); // move to OTP step
      } else {
        setEmailError(data.message);
      }
    } catch (error) {
      console.error(error);
      setEmailError('Something went wrong. Try again.');
    }
  };

  // ---------- Step 2: Reset Password ----------
  const resetPassword = async () => {
    const otpErr = validateOtp(otp);
    const passErr = validatePassword(newPassword);
    const confirmErr =
      newPassword !== confirmPassword ? 'Passwords do not match.' : '';
    setOtpError(otpErr);
    setPasswordError(passErr || confirmErr);

    if (otpErr || passErr || confirmErr) return;

    try {
      const response = await fetch(`${BASE_URL}/api/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp,
          newPassword,
        }),
      });
      const data: any = await response.json();
      if (response.ok) {
        Alert.alert('Success', data.message, [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Try again.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient colors={['#00aaff', '#ffffff']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.box}>
            <Text style={styles.heading}>Forgot Password</Text>

            {step === 'email' && (
              <>
                <TextInput
                  placeholder="Enter your email"
                  style={[styles.input, emailError ? styles.inputError : null]}
                  value={email}
                  onChangeText={text => {
                    setEmail(text);
                    setEmailError(validateEmail(text));
                  }}
                />
                {emailError ? (
                  <Text style={styles.errorText}>{emailError}</Text>
                ) : null}

                <TouchableOpacity
                  onPress={sendOtp}
                  style={[styles.button, !email && { opacity: 0.6 }]}
                  disabled={!email}
                >
                  <Text style={styles.buttonText}>Send OTP</Text>
                </TouchableOpacity>
              </>
            )}

            {step === 'otp' && (
              <>
                <TextInput
                  placeholder="Enter OTP"
                  style={[styles.input, otpError ? styles.inputError : null]}
                  value={otp}
                  keyboardType="numeric"
                  onChangeText={text => {
                    setOtp(text);
                    setOtpError(validateOtp(text));
                  }}
                />
                {otpError ? (
                  <Text style={styles.errorText}>{otpError}</Text>
                ) : null}

                <TextInput
                  placeholder="New Password"
                  style={[
                    styles.input,
                    passwordError ? styles.inputError : null,
                  ]}
                  secureTextEntry
                  value={newPassword}
                  onChangeText={text => {
                    setNewPassword(text);
                    setPasswordError(validatePassword(text));
                  }}
                />
                <TextInput
                  placeholder="Confirm Password"
                  style={[
                    styles.input,
                    passwordError ? styles.inputError : null,
                  ]}
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={text => {
                    setConfirmPassword(text);
                    setPasswordError(
                      newPassword !== text ? 'Passwords do not match.' : '',
                    );
                  }}
                />
                {passwordError ? (
                  <Text style={styles.errorText}>{passwordError}</Text>
                ) : null}

                <TouchableOpacity
                  onPress={resetPassword}
                  style={[
                    styles.button,
                    (!otp || !newPassword || !confirmPassword) && {
                      opacity: 0.6,
                    },
                  ]}
                  disabled={!otp || !newPassword || !confirmPassword}
                >
                  <Text style={styles.buttonText}>Reset Password</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  box: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  heading: { fontSize: 22, fontWeight: '600', marginBottom: 20 },
  input: {
    width: '100%',
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  inputError: { borderColor: 'red' },
  errorText: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginTop: -5,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 12,
    marginTop: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
