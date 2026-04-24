import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BASE_URL from '../config/url';

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
};

type SignupResponse = {
  message: string;
};

export default function SignupScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    const validateName = (name: string) =>
      /^[a-zA-Z ]{2,30}$/.test(name);

    const validateEmail = (email: string) => {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
      return emailPattern.test(email);
    };

    const validatePassword = (password: string) =>
      password.length >= 8;

    try {
      setFullNameError('');
      setEmailError('');
      setPasswordError('');

      let hasError = false;

      if (!fullName.trim()) {
        setFullNameError('Full name is required.');
        hasError = true;
      } else if (!validateName(fullName.trim())) {
        setFullNameError(
          'Name should be 2-30 letters and spaces only.',
        );
        hasError = true;
      }

      if (!email.trim()) {
        setEmailError('Email is required.');
        hasError = true;
      } else if (!validateEmail(email.trim())) {
        setEmailError('Please enter a valid email address.');
        hasError = true;
      }

      if (!password) {
        setPasswordError('Password is required.');
        hasError = true;
      } else if (!validatePassword(password)) {
        setPasswordError(
          'Password must be at least 8 characters long.',
        );
        hasError = true;
      }

      if (hasError) return;

      setLoading(true);

      const response = await fetch(
        `${BASE_URL}/api/users/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName,
            email: email.trim().toLowerCase(),
            password,
          }),
        },
      );

      const data = (await response.json()) as SignupResponse;

      if (response.ok) {
        Alert.alert(
          'Success',
          data.message || 'User registered successfully',
          [
            {
              text: 'Now Log In with your new account',
              onPress: () => navigation.navigate('Login'),
            },
          ],
        );
      } else {
        Alert.alert(
          'Signup Failed',
          data.message || 'Something went wrong',
        );
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient colors={['#00aaff', '#ffffff']} style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.appHeading}>AI NUTRITIONIST</Text>

          {/* Full Name */}
          <TextInput
            placeholder="First Name"
            autoCapitalize="words"
            style={[styles.input, fullNameError ? styles.inputError : null]}
            value={fullName}
            onChangeText={text => {
              setFullName(text.replace(/^\s+|\s+$/g, ''));
              if (fullNameError) setFullNameError('');
            }}
          />
          {fullNameError ? (
            <Text style={styles.errorText}>{fullNameError}</Text>
          ) : null}

          {/* Email */}
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            style={[styles.input, emailError ? styles.inputError : null]}
            value={email}
            onChangeText={text => {
              setEmail(text.trim());
              if (emailError) setEmailError('');
            }}
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}

          {/* Password */}
          <View style={{ width: '100%', position: 'relative' }}>
            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              style={[styles.input, passwordError ? styles.inputError : null]}
              value={password}
              onChangeText={text => {
                setPassword(text.trimStart());
                if (passwordError) setPasswordError('');
              }}
            />

            <TouchableOpacity
              onPressIn={() => setShowPassword(true)}
              onPressOut={() => setShowPassword(false)}
              style={{ position: 'absolute', right: 15, top: 20 }}
            >
              <Text style={{ color: '#1e90ff', fontWeight: '500' }}>
                Show
              </Text>
            </TouchableOpacity>
          </View>

          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}

          {/* SIGN UP BUTTON (UPDATED WITH LOADER) */}
          <TouchableOpacity
            style={[
              styles.button,
              (loading || !fullName || !email || !password) && {
                opacity: 0.6,
              },
            ]}
            onPress={handleSignup}
            disabled={loading || !fullName || !email || !password}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* Login Row */}
          <View style={styles.loginRow}>
            <Text style={styles.signupText}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Image
          source={require('../assets/images/SignUpBot.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  box: {
    marginTop: 45,
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    alignItems: 'center',
  },
  appHeading: {
    fontFamily: 'monospace',
    fontSize: 22,
    fontWeight: '600',
    color: '#052d7dff',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 3, height: 2 },
    textShadowRadius: 10,
  },
  input: {
    width: '100%',
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
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
  loginRow: {
    flexDirection: 'row',
    marginTop: 15,
  },
  signupText: {
    fontSize: 14,
    color: '#333',
  },
  loginText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e90ff',
  },
  image: {
    width: 350,
    height: 300,
    alignSelf: 'center',
    opacity: 0.75,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginTop: -5,
    marginBottom: 5,
  },
  inputError: {
    borderColor: 'red',
  },
});