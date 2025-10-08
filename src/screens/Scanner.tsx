import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Camera,
  useCameraDevices,
  useCameraPermission,
  useCodeScanner,
  Code,
} from 'react-native-vision-camera';

const Scanner: React.FC = () => {
  const navigation = useNavigation<any>();

  const devices = useCameraDevices();
  const device = devices.filter(device => device.position === 'back')[0]; // back camera
  const [barcode, setBarcode] = useState<string | null>(null);
  const [scanningEnabled, setScanningEnabled] = useState<boolean>(true);

  const [torchOn, setTorchOn] = useState<boolean>(false);

  // ✅ Correct usage based on your hook implementation
  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    (async () => {
      if (!hasPermission) {
        await requestPermission();
      }
    })();
  }, [hasPermission, requestPermission]);

  // Callback invoked when codes are detected
  const onCodesDetected = useCallback(
    (codes: Code[]) => {
      if (!scanningEnabled) return;

      if (codes.length > 0) {
        const first = codes[0];
        if (first.value) {
          setBarcode(first.value);
          setTorchOn(false);
          setScanningEnabled(false); // disable further scanning until reset
          Alert.alert('Scanned Code', first.value, [
            {
              text: 'OK',
              onPress: () => setScanningEnabled(true),
            },
          ]);
        }
      }
    },
    [scanningEnabled],
  );

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'ean-8', 'code-128'], // supported formats
    onCodeScanned: onCodesDetected,
  });

  if (!device) {
    return (
      <View style={styles.center}>
        <Text>Loading camera...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text>No camera permission</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={scanningEnabled}
        codeScanner={codeScanner}
        torch={torchOn ? 'on' : 'off'}
      />
      <View style={styles.resultBox}>
        <Text style={styles.resultText}>
          {barcode ? `Scanned Code: ${barcode}` : 'Scan a barcode'}
        </Text>
        {barcode && (
          <TouchableOpacity
            style={{
              marginTop: 12,
              backgroundColor: '#5aa9f9',
              paddingVertical: 13,
              paddingHorizontal: 20,
              borderRadius: 8,
            }}
            onPress={() => {
              const scannedCode = barcode; // store code for navigation
              setBarcode(null); // ✅ clear previous scanned code
              setScanningEnabled(true);
              navigation.navigate('ProductDetails', { code: scannedCode });
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '500', fontSize: 16 }}>
              Know More About the Product
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => setTorchOn(prev => !prev)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: torchOn
              ? 'rgba(255,255,255,0.7)'
              : 'rgba(0,0,0,0.3)',
            paddingVertical: 8,
            paddingHorizontal: 10,
            borderRadius: 8,
            marginTop: 10,
          }}
        >
          <Image
            source={require('../assets/icons/torch.png')}
            style={{
              tintColor: torchOn ? 'black' : '#fff',
              height: 35,
              width: 35,
            }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  resultBox: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 8,
  },
});

export default Scanner;
