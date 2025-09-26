import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUser } from '../../backend/context/UserIdContext';
import { useActiveProfile } from '../../backend/context/ActiveProfileContext';
import { BASE_URL } from '../../config';

type RootStackParamList = {
  Signup: undefined;
  MainApp: undefined;
  ForgotPassword: undefined;
};

type LoginResponse = {
  message: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    profile: { _id: string }[];
  };
};

export default function LoginScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');

  const { setUserId } = useUser();
  const { setActiveProfileId } = useActiveProfile();

  // ---------- Real-time validation ----------
  const validateEmail = (text: string) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    if (!text.trim()) return 'Email is required.';
    if (!pattern.test(text.trim())) return 'Please enter a valid email.';
    return '';
  };

  const validatePassword = (text: string) => {
    if (!text) return 'Password is required.';
    if (text.length < 8) return 'Password must be at least 8 characters.';
    return '';
  };

  // ---------- Handler ----------
  const handleLogin = async () => {
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    setEmailError(emailErr);
    setPasswordError(passErr);

    if (emailErr || passErr) return;

    try {
      const response = await fetch(`${BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      const data = (await response.json()) as LoginResponse;

      if (response.ok) {
        setUserId(data.user._id);
        if (data.user.profile && data.user.profile.length > 0) {
          setActiveProfileId(data.user.profile[0]._id);
        }
        navigation.navigate('MainApp');
      } else {
        const msg = data.message.toLowerCase();
        if (msg.includes('email')) {
          setEmailError(data.message);
          setPasswordError('');
        } else if (msg.includes('password')) {
          setPasswordError(data.message);
          setEmailError('');
        } else {
          setPasswordError(data.message);
          setEmailError('');
        }
      }
    } catch (error) {
      setPasswordError('Something went wrong. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient colors={['#00aaff', '#ffffff']} style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.appHeading}>AI NUTRITIONIST</Text>

          {/* Email */}
          <TextInput
            placeholder="Email"
            style={[styles.input, emailError ? styles.inputError : null]}
            value={email}
            onChangeText={text => {
              setEmail(text);
              setEmailError(validateEmail(text)); // real-time
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
                setPassword(text);
                setPasswordError(validatePassword(text)); // real-time
              }}
            />
            <TouchableOpacity
              onPressIn={() => setShowPassword(true)}
              onPressOut={() => setShowPassword(false)}
              style={{ position: 'absolute', right: 15, top: 20 }}
            >
              <Text style={{ color: '#1e90ff', fontWeight: '500' }}>Show</Text>
            </TouchableOpacity>
          </View>
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}

          <Text style={{ marginTop: 10, alignSelf: 'flex-end' }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={{ color: '#1e90ff', fontWeight: '500' }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </Text>

          <TouchableOpacity
            onPress={handleLogin}
            style={[styles.button, (!email || !password) && { opacity: 0.6 }]}
            disabled={!email || !password}
          >
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>

          <Text style={styles.signupText}>
            Don't have an account?{' '}
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={{ fontWeight: '500', color: '#1e90ff', top: 5 }}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </Text>
        </View>

        <Image
          source={require('../assets/images/BotWithVeggies.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  appHeading: {
    fontFamily: 'monospace',
    fontSize: 22,
    fontWeight: '600',
    color: '#052d7dff',
    textAlign: 'center',
    marginBottom: 10,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 3, height: 2 },
    textShadowRadius: 10,
  },
  box: {
    marginTop: 50,
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    alignItems: 'center',
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
  signupText: { marginTop: 15, fontSize: 14 },
  image: { width: 300, height: 350, alignSelf: 'center', opacity: 0.75 },
});
