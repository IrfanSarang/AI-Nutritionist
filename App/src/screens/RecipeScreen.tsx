import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const RecipeScreen = () => {
  const navigation = useNavigation();
  const [ingredients, setIngredients] = useState('');
  const [dietType, setDietType] = useState('');
  const [allergies, setAllergies] = useState('');
  const [recipes, setRecipes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateRecipes = async () => {
    if (!ingredients.trim()) {
      setError('Please enter at least one ingredient.');
      return;
    }
    setError('');
    setLoading(true);
    setRecipes('');

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(
        `${process.env.API_BASE_URL || 'http://10.0.2.2:5000'}/api/users/recipe`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ingredients: ingredients.trim(),
            dietType: dietType.trim(),
            allergies: allergies.trim(),
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        setError(data.reply || 'Something went wrong. Please try again.');
      } else {
        setRecipes(data.reply);
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#ffffff', '#88E9FF', '#ffffff']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>AI Recipe Generator</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Ingredients Input */}
          <View style={styles.card}>
            <Text style={styles.label}>🥦 What ingredients do you have?</Text>
            <TextInput
              style={styles.textArea}
              placeholder="e.g. chicken, onion, tomato, garlic..."
              placeholderTextColor="#aaa"
              value={ingredients}
              onChangeText={setIngredients}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Diet Type */}
          <View style={styles.card}>
            <Text style={styles.label}>🥗 Diet Type (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. vegetarian, vegan, keto..."
              placeholderTextColor="#aaa"
              value={dietType}
              onChangeText={setDietType}
            />
          </View>

          {/* Allergies */}
          <View style={styles.card}>
            <Text style={styles.label}>⚠️ Allergies to avoid (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. nuts, dairy, gluten..."
              placeholderTextColor="#aaa"
              value={allergies}
              onChangeText={setAllergies}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Generate Button */}
          <TouchableOpacity
            style={[styles.generateButton, loading && styles.generateButtonDisabled]}
            onPress={generateRecipes}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.generateButtonText}>✨ Generate Recipes</Text>
            )}
          </TouchableOpacity>

          {/* Results */}
          {recipes ? (
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>🍽️ Your Recipes</Text>
              <Text style={styles.resultText}>{recipes}</Text>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  backArrow: {
    fontSize: 24,
    color: '#1e90ff',
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  textArea: {
    fontSize: 15,
    color: '#333',
    minHeight: 72,
    textAlignVertical: 'top',
  },
  input: {
    fontSize: 15,
    color: '#333',
    height: 40,
  },
  errorText: {
    color: '#e53935',
    fontSize: 13,
    marginBottom: 10,
    textAlign: 'center',
  },
  generateButton: {
    backgroundColor: '#1e90ff',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 6,
  },
  generateButtonDisabled: {
    backgroundColor: '#7ab8f5',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  resultCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 18,
    elevation: 5,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e90ff',
    marginBottom: 12,
  },
  resultText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
});

export default RecipeScreen;