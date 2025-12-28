import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  Scanner: undefined;
};
type ScanScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Scanner'
>;

export default function ScanScren() {
  const navigation = useNavigation<ScanScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Scan Products</Text>
      </View>

      <View style={styles.imageContaier}>
        <Image
          source={require('../assets/images/guide.png')}
          style={styles.image}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={() => navigation.navigate('Scanner')}
        >
          <Text style={styles.cameraButtonText}>Open Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#f6f6f6ff', zIndex: -2, flex: 1 },
  header: {
    backgroundColor: '#4A90E2',
    paddingVertical: 18,
  },
  headerText: {
    fontSize: 25,
    color: '#fff',
    letterSpacing: 1.5,
    alignSelf: 'center',
    fontWeight: '700',
  },
  imageContaier: {
    height: 520,
  },
  image: {
    width: 350,
    height: 540,
    alignSelf: 'center',
    zIndex: -1,
    bottom: 45,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    backgroundColor: '#5aa9f9',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    elevation: 5,
    bottom: 10,
  },
  cameraButtonText: {
    color: '#fff',
    fontWeight: '500',
    letterSpacing: 1.5,
    fontSize: 17,
  },
});
