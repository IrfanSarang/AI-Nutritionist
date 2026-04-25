import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../config';
import { authFetch } from '../utils/api';
import { useUser } from '../context/UserIdContext';
import { useActiveProfile } from '../context/ActiveProfileContext';

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface FoodResult {
  foodName: string;
  portionSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  healthRating: number;
}

type MealType = 'breakfast' | 'lunch' | 'dinner';

/* ─────────────────────────────────────────────
   SCREEN
───────────────────────────────────────────── */
const FoodCameraScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraOpen, setCameraOpen] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [result, setResult] = useState<FoodResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [mealModalVisible, setMealModalVisible] = useState(false);
  const [loggingMeal, setLoggingMeal] = useState(false);

  const cameraRef = useRef<CameraView>(null);
  const navigation = useNavigation();
  const { userId } = useUser();
  const { activeProfileId } = useActiveProfile();

  /* ── Camera permission check ── */
  if (!permission) return <ActivityIndicator style={{ flex: 1 }} />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permText}>
          Camera access is needed to scan food.
        </Text>
        <TouchableOpacity style={styles.permButton} onPress={requestPermission}>
          <Text style={styles.permButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* ── Take photo ── */
  const takePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.7,
      });
      if (!photo?.base64) return;
      setPhotoUri(photo.uri);
      setCameraOpen(false);
      analyzeFood(photo.base64);
    } catch {
      Alert.alert('Error', 'Failed to take photo. Try again.');
    }
  };

  /* ── Call backend → Gemini ── */
  const analyzeFood = async (base64: string) => {
    setAnalyzing(true);
    setResult(null);
    try {
      const res = await authFetch(`${BASE_URL}/api/users/identify-food`, {
        method: 'POST',
        body: JSON.stringify({ imageBase64: base64 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Analysis failed');
      setResult(data);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not analyze food.');
    } finally {
      setAnalyzing(false);
    }
  };

  /* ── Log to meal plan ── */
  const logMeal = async (mealType: MealType) => {
    if (!result) return;
    setLoggingMeal(true);
    try {
      const mealEntry = `${result.foodName} (~${result.calories} kcal, P:${result.protein}g C:${result.carbs}g F:${result.fat}g)`;
      const res = await authFetch(
        `${BASE_URL}/api/users/${userId}/profiles/${activeProfileId}/addMeal`,
        {
          method: 'POST',
          body: JSON.stringify({ mealType, item: mealEntry }),
        },
      );
      if (res.ok) {
        setMealModalVisible(false);
        Alert.alert('✅ Logged!', `${result.foodName} added to ${mealType}.`, [
          { text: 'Go to Meal Plan', onPress: () => navigation.goBack() },
          { text: 'Scan Another', onPress: resetScreen },
        ]);
      } else {
        Alert.alert('Error', 'Failed to log meal. Try again.');
      }
    } catch {
      Alert.alert('Error', 'Network error. Try again.');
    } finally {
      setLoggingMeal(false);
    }
  };

  const resetScreen = () => {
    setPhotoUri(null);
    setResult(null);
  };

  /* ── Health rating color ── */
  const ratingColor = (r: number) =>
    r >= 7 ? '#22c55e' : r >= 4 ? '#f59e0b' : '#ef4444';

  /* ─────────── CAMERA VIEW ─────────── */
  if (cameraOpen) {
    return (
      <View style={{ flex: 1 }}>
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back">
          <View style={styles.cameraOverlay}>
            <TouchableOpacity
              style={styles.closeCam}
              onPress={() => setCameraOpen(false)}
            >
              <Text style={styles.closeCamText}>✕</Text>
            </TouchableOpacity>
            <View style={styles.cameraFrame} />
            <Text style={styles.cameraHint}>Center the food in the frame</Text>
            <TouchableOpacity style={styles.captureBtn} onPress={takePhoto}>
              <View style={styles.captureInner} />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  /* ─────────── MAIN VIEW ─────────── */
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Food Identifier</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* No photo yet */}
      {!photoUri && !analyzing && (
        <View style={styles.heroBox}>
          <Text style={styles.heroEmoji}>🍽️</Text>
          <Text style={styles.heroTitle}>Identify Any Food</Text>
          <Text style={styles.heroSub}>
            Take a photo and get instant calorie &amp; macro info powered by AI.
          </Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => setCameraOpen(true)}
          >
            <Text style={styles.primaryBtnText}>📷 Open Camera</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Analyzing */}
      {analyzing && (
        <View style={styles.analyzingBox}>
          {photoUri && (
            <Image source={{ uri: photoUri }} style={styles.previewImg} />
          )}
          <ActivityIndicator
            size="large"
            color="#004E92"
            style={{ marginTop: 20 }}
          />
          <Text style={styles.analyzingText}>Analyzing your food…</Text>
        </View>
      )}

      {/* Result */}
      {result && !analyzing && (
        <View>
          {photoUri && (
            <Image source={{ uri: photoUri }} style={styles.resultImg} />
          )}

          <View style={styles.resultCard}>
            {/* Food name + rating */}
            <View style={styles.resultHeader}>
              <Text style={styles.foodName}>{result.foodName}</Text>
              <View
                style={[
                  styles.ratingBadge,
                  { backgroundColor: ratingColor(result.healthRating) },
                ]}
              >
                <Text style={styles.ratingText}>{result.healthRating}/10</Text>
              </View>
            </View>
            <Text style={styles.portionText}>📏 {result.portionSize}</Text>

            {/* Calories */}
            <View style={styles.calBox}>
              <Text style={styles.calNumber}>{result.calories}</Text>
              <Text style={styles.calLabel}>kcal</Text>
            </View>

            {/* Macros */}
            <View style={styles.macroRow}>
              <MacroChip
                label="Protein"
                value={result.protein}
                color="#3b82f6"
              />
              <MacroChip label="Carbs" value={result.carbs} color="#f59e0b" />
              <MacroChip label="Fat" value={result.fat} color="#ef4444" />
            </View>

            {/* Actions */}
            <TouchableOpacity
              style={styles.logBtn}
              onPress={() => setMealModalVisible(true)}
            >
              <Text style={styles.logBtnText}>+ Log to Meal Plan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rescanBtn}
              onPress={() => setCameraOpen(true)}
            >
              <Text style={styles.rescanText}>📷 Scan Another</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Meal type modal */}
      <Modal visible={mealModalVisible} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add to which meal?</Text>
            {(['breakfast', 'lunch', 'dinner'] as MealType[]).map(type => (
              <TouchableOpacity
                key={type}
                style={styles.mealTypeBtn}
                onPress={() => logMeal(type)}
                disabled={loggingMeal}
              >
                <Text style={styles.mealTypeBtnText}>
                  {type === 'breakfast' ? '🌅' : type === 'lunch' ? '☀️' : '🌙'}{' '}
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setMealModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

/* ── Small macro chip component ── */
const MacroChip = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <View style={[styles.chip, { borderColor: color }]}>
    <Text style={[styles.chipValue, { color }]}>{value}g</Text>
    <Text style={styles.chipLabel}>{label}</Text>
  </View>
);

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F6FF' },
  content: { paddingBottom: 40 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  /* Permission */
  permText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
  },
  permButton: {
    backgroundColor: '#004E92',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  permButtonText: { color: 'white', fontWeight: '700' },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  backArrow: { fontSize: 24, color: '#004E92', fontWeight: '700' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#004E92' },

  /* Hero */
  heroBox: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#004E92',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  heroEmoji: { fontSize: 64, marginBottom: 12 },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#004E92',
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  primaryBtn: {
    backgroundColor: '#004E92',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
  },
  primaryBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },

  /* Analyzing */
  analyzingBox: { alignItems: 'center', padding: 20 },
  previewImg: { width: '100%', height: 220, borderRadius: 16 },
  analyzingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#004E92',
    fontWeight: '600',
  },

  /* Result */
  resultImg: {
    width: '100%',
    height: 220,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  resultCard: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#004E92',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  foodName: { fontSize: 22, fontWeight: '800', color: '#1a1a1a', flex: 1 },
  ratingBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  ratingText: { color: 'white', fontWeight: '700', fontSize: 13 },
  portionText: { color: '#888', fontSize: 13, marginBottom: 16 },
  calBox: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 16 },
  calNumber: { fontSize: 48, fontWeight: '900', color: '#004E92' },
  calLabel: { fontSize: 18, color: '#004E92', marginBottom: 8, marginLeft: 4 },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  chip: {
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  chipValue: { fontSize: 18, fontWeight: '800' },
  chipLabel: { fontSize: 11, color: '#888', marginTop: 2 },
  logBtn: {
    backgroundColor: '#004E92',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  logBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },
  rescanBtn: {
    borderWidth: 1.5,
    borderColor: '#004E92',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  rescanText: { color: '#004E92', fontWeight: '600', fontSize: 14 },

  /* Camera */
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 56,
  },
  closeCam: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  closeCamText: { color: 'white', fontSize: 18, fontWeight: '700' },
  cameraFrame: {
    width: 260,
    height: 260,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
  },
  cameraHint: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontWeight: '500',
  },
  captureBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  captureInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'white',
  },

  /* Modal */
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#004E92',
    textAlign: 'center',
    marginBottom: 16,
  },
  mealTypeBtn: {
    backgroundColor: '#F0F6FF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  mealTypeBtnText: { color: '#004E92', fontWeight: '600', fontSize: 15 },
  cancelBtn: { alignItems: 'center', marginTop: 4 },
  cancelText: { color: '#A0AAB5', fontWeight: '600' },
});

export default FoodCameraScreen;
