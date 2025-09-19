import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUser } from '../../backend/context/UserIdContext';
import { useActiveProfile } from '../../backend/context/ActiveProfileContext';

type RootStackParamList = {
  Signup: undefined;
  MainApp: undefined;
};

type LoginResponse = {
  message: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    profile: {
      _id: string;
    }[];
  };
};

export default function LoginScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { setUserId } = useUser();
  const { setActiveProfileId } = useActiveProfile();

  const handleLogin = async () => {
    try {
      const response = await fetch(
        'http://192.168.0.104:5000/api/users/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
        },
      );

      const data = (await response.json()) as LoginResponse;

      if (response.ok) {
        setUserId(data.user._id);
        if (data.user.profile && data.user.profile.length > 0) {
          setActiveProfileId(data.user.profile[0]._id);
        }

        Alert.alert('Login Successful', data.message || 'Welcome back!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MainApp'),
          },
        ]);
      } else {
        // ❌ Failure → show backend message
        Alert.alert(
          'Login Failed',
          data.message || 'Invalid email or password',
        );
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <LinearGradient colors={['#00aaff', '#ffffff']} style={styles.container}>
      {/* Login Box */}
      <View style={styles.box}>
        <View>
          <Text style={styles.appHeading}>AI NUTRITIONIST</Text>
        </View>
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          // onPress={() => navigation.navigate('MainApp')}
          onPress={handleLogin}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <Text style={styles.signupText}>
          Don&apos;t have an account?{' '}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appHeading: {
    fontFamily: 'monospace',
    fontSize: 22,
    fontWeight: '600',
    color: '#052d7dff', // modern blue accent
    textAlign: 'center',
    letterSpacing: 0, // spaced-out for premium look
    textTransform: 'uppercase',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.15)', // subtle shadow
    textShadowOffset: { width: 3, height: 2 },
    textShadowRadius: 10,
  },
  box: {
    marginTop: 50,
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
  button: {
    backgroundColor: '#1e90ff',
    padding: 12,
    marginTop: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupText: {
    marginTop: 15,
    fontSize: 14,
  },
  image: {
    width: 300,
    height: 350,
    alignSelf: 'center',
    opacity: 0.75,
  },
});
