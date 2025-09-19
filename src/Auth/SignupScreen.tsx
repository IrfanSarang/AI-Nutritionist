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

// Define your stack params
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

  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSignup = async () => {
    // Implement signup logic here

    try {
      const response = await fetch(
        'https://ai-nutritionist-5jyf.onrender.com/api/users/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: fullName,
            email: email.trim().toLowerCase(),
            password: password,
          }),
        },
      );

      const data = (await response.json()) as SignupResponse;

      if (response.ok) {
        Alert.alert('Success', data.message || 'User registered successfully', [
          {
            text: 'Now Log In with your new account',
            onPress: () => navigation.navigate('Login'),
          },
        ]);
      } else {
        Alert.alert('Signup Failed', data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', String(error));
    }
  };

  return (
    <LinearGradient colors={['#00aaff', '#ffffff']} style={styles.container}>
      {/* Signup Box */}
      <View style={styles.box}>
        <View>
          <Text style={styles.appHeading}>AI NUTRITIONIST</Text>
        </View>
        <TextInput
          placeholder="Full Name"
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
        />
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

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* ✅ "Already have an account? Log In" in one line */}
        <View style={styles.loginRow}>
          <Text style={styles.signupText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Background Image */}
      <Image
        source={require('../assets/images/SignUpBot.png')}
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
    color: '#052d7dff', // modern blue accent
    textAlign: 'center',
    letterSpacing: 0, // spaced-out for premium look
    textTransform: 'uppercase',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.15)', // subtle shadow
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
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
});
