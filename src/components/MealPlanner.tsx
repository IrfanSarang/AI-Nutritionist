import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useUser } from '../../backend/context/UserIdContext';
import { useActiveProfile } from '../../backend/context/ActiveProfileContext';
import { BASE_URL } from '../../config';

type MealType = 'breakfast' | 'lunch' | 'dinner';

interface IMealPlan {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
}
interface IMealResponse {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  message?: string;
}

const MealPlanner = () => {
  const [meals, setMeals] = useState<IMealPlan>({
    breakfast: [],
    lunch: [],
    dinner: [],
  });
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentMealType, setCurrentMealType] = useState<MealType>('breakfast');
  const [mealInput, setMealInput] = useState('');
  const { userId } = useUser();
  const { activeProfileId } = useActiveProfile();

  // Fetch meals from backend
  // Fetch meals from backend
  const fetchMeals = async () => {
    if (!userId || !activeProfileId) {
      setLoading(false); // stop loading if no profile
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/api/users/${userId}/${activeProfileId}/fetchMeal`,
      );
      const data = (await res.json()) as IMealResponse;

      if (data) {
        setMeals({
          breakfast: data.breakfast || [],
          lunch: data.lunch || [],
          dinner: data.dinner || [],
        });
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to fetch meals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, [userId, activeProfileId]);

  // Add meal
  const addMeal = async () => {
    if (!activeProfileId) {
      Alert.alert(
        'No Profile',
        'Please create a profile first before adding meals.',
      );
      return;
    }
    if (mealInput.trim() === '') return;

    try {
      const res = await fetch(
        `${BASE_URL}/api/users/${userId}/profiles/${activeProfileId}/addMeal`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mealType: currentMealType,
            item: mealInput.trim(),
          }),
        },
      );
      const data = (await res.json()) as IMealResponse;
      if (res.ok) {
        setMeals(prev => ({
          ...prev,
          [currentMealType]: [...prev[currentMealType], mealInput.trim()],
        }));
        setModalVisible(false);
        setMealInput('');
      } else {
        Alert.alert('Error', data.message || 'Failed to add meal');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to add meal');
    }
  };

  // Delete meal
  const deleteMeal = async (type: MealType, item: string) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/users/${userId}/profiles/${activeProfileId}/deleteMeal`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mealType: type, item }),
        },
      );
      const data = (await res.json()) as IMealResponse;
      if (res.ok) {
        setMeals(prev => ({
          ...prev,
          [type]: prev[type].filter(mealItem => mealItem !== item),
        }));
      } else {
        Alert.alert('Error', data.message || 'Failed to delete meal');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to delete meal');
    }
  };

  const renderMealSection = (title: string, type: MealType) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setCurrentMealType(type);
            setModalVisible(true);
          }}
        >
          <Text style={styles.addText}>+ Add</Text>
        </TouchableOpacity>
      </View>
      {meals[type].length === 0 ? (
        <Text style={{ color: '#888', marginBottom: 8 }}>No items added</Text>
      ) : (
        <FlatList
          data={meals[type]}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.mealItem}>
              <Text style={styles.mealText}>
                Option {index + 1}: {item}
              </Text>
              <TouchableOpacity
                onPress={() => deleteMeal(type, item)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          scrollEnabled={false}
        />
      )}
    </View>
  );

  if (loading)
    return (
      <ActivityIndicator size="large" color="#007AFF" style={{ flex: 1 }} />
    );

  return (
    <ScrollView style={styles.container}>
      {renderMealSection('Breakfast', 'breakfast')}
      {renderMealSection('Lunch', 'lunch')}
      {renderMealSection('Dinner', 'dinner')}

      {/* Modal for adding meal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add {currentMealType}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter meal name"
              value={mealInput}
              onChangeText={setMealInput}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={addMeal}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent', padding: 16 },
  section: {
    marginBottom: 20,
    backgroundColor: '#fefefeff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#004E92' },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addText: { color: 'white', fontWeight: '600' },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E3EFFF',
  },
  mealText: { fontSize: 16, color: '#333', width: '90%' },
  deleteButton: {
    width: '10%',
    backgroundColor: '#FFECEC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  deleteText: { color: '#E63946', fontWeight: 'bold' },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#B0CFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#F9FBFF',
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around' },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 10,
    width: '40%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#A0AAB5',
    padding: 12,
    borderRadius: 10,
    width: '40%',
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: '600' },
});

export default MealPlanner;
