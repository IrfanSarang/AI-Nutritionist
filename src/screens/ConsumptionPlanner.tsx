import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Clipboard from '@react-native-clipboard/clipboard';

const ConsumptionPlanner: React.FC = () => {
  const [age, setAge] = useState('22');
  const [gender, setGender] = useState('M');
  const [height, setHeight] = useState('180');
  const [weight, setWeight] = useState('80');
  const [activity, setActivity] = useState('Low');
  const [condition, setCondition] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Results state
  const [results, setResults] = useState({
    calories: 0,
    bmi: 0,
    bmiStatus: '',
    protein: 0,
    carbs: 0,
    fats: 0,
    water: 0,
    proteinPct: 0,
    carbsPct: 0,
    fatsPct: 0,
    normalWeightRange: 'N/A',
  });

  // refs for scrolling
  const scrollViewRef = useRef<ScrollView>(null);

  // Input validation helper
  const isValidNumber = (val: string) => {
    if (!val) return false;
    return /^\d+(\.\d+)?$/.test(val);
  };

  // Dynamic formulas
  const calculateResults = () => {
    const ageNum = parseInt(age || '0', 10);
    const heightNum = parseFloat(height || '0');
    const weightNum = parseFloat(weight || '0');

    if (
      !isValidNumber(age) ||
      !isValidNumber(height) ||
      !isValidNumber(weight) ||
      ageNum < 10 ||
      ageNum > 120 ||
      heightNum < 100 ||
      heightNum > 250 ||
      weightNum < 30 ||
      weightNum > 300
    ) {
      Alert.alert(
        'Invalid Input',
        'Please enter valid numbers for age (10-120), height (100-250cm), and weight (30-300kg).',
      );
      return null;
    }

    // BMR (Mifflin-St Jeor Equation)
    let bmr =
      gender === 'M'
        ? 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5
        : 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;

    // Activity multiplier
    let activityMult = 1.2;
    if (activity === 'Moderate') activityMult = 1.55;
    if (activity === 'High') activityMult = 1.725;

    // Final calories
    const calories = Math.round(bmr * activityMult);

    // BMI
    const bmi = +(weightNum / (heightNum / 100) ** 2).toFixed(1);
    let bmiStatus = 'Normal';
    if (bmi < 18.5) bmiStatus = 'Underweight';
    else if (bmi < 25) bmiStatus = 'Normal';
    else if (bmi < 30) bmiStatus = 'Overweight';
    else bmiStatus = 'Obese';

    // Normal weight range for this height
    const minNormal = 18.5 * (heightNum / 100) ** 2;
    const maxNormal = 24.9 * (heightNum / 100) ** 2;

    /// Macro calculation based on activity and calories
    let protein = weightNum * 1.0; // sedentary / low activity
    if (activity === 'Moderate') protein = weightNum * 1.2;
    if (activity === 'High') protein = weightNum * 1.6;
    protein = Math.round(protein);

    const fats = Math.round((calories * 0.25) / 9); // 25% of calories from fats
    const carbs = Math.round((calories - (protein * 4 + fats * 9)) / 4); // remaining calories from carbs

    // Percentages for UI
    const proteinPct = Math.round((protein * 4 * 100) / calories);
    const fatsPct = Math.round((fats * 9 * 100) / calories);
    const carbsPct = 100 - proteinPct - fatsPct;
    // Water intake (simple: 35ml per kg)
    const water = +(weightNum * 0.035).toFixed(2);

    return {
      calories,
      bmi,
      bmiStatus,
      proteinPct,
      carbsPct,
      fatsPct,
      protein,
      carbs,
      fats,
      water,
      normalWeightRange: `${minNormal.toFixed(1)} kg - ${maxNormal.toFixed(
        1,
      )} kg`,
    };
  };

  const handleCalculate = () => {
    const res = calculateResults();
    if (!res) return;
    setResults(res);
    setShowResults(true);
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={styles.screen}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>
        How Much{'\n'}Should I Eat{'\n'}Daily?
      </Text>

      {/* FORM */}
      <View style={styles.formBox}>
        <Text style={styles.formTitle}>Enter Your Details</Text>

        {/* Age & Gender */}
        <View style={styles.row}>
          <View style={[styles.inputCol, { marginRight: 8 }]}>
            <Text style={styles.label}>Age:</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              value={age}
              onChangeText={text => /^\d*$/.test(text) && setAge(text)}
              placeholder="e.g., 22"
              placeholderTextColor="#9bbbd6"
              maxLength={3}
            />
          </View>
          <View style={styles.inputCol}>
            <Text style={styles.label}>Gender:</Text>
            <View style={styles.pickerWrap}>
              <Picker
                selectedValue={gender}
                onValueChange={setGender}
                style={styles.picker}
              >
                <Picker.Item label="Male" value="M" />
                <Picker.Item label="Female" value="F" />
              </Picker>
            </View>
          </View>
        </View>

        {/* Height */}
        <View style={styles.inputCol}>
          <Text style={styles.label}>Height (cm):</Text>
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            value={height}
            onChangeText={text => /^\d*\.?\d*$/.test(text) && setHeight(text)}
            placeholder="e.g., 170"
            placeholderTextColor="#9bbbd6"
            maxLength={5}
          />
        </View>

        {/* Weight */}
        <View style={styles.inputCol}>
          <Text style={styles.label}>Weight (kg):</Text>
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            value={weight}
            onChangeText={text => /^\d*\.?\d*$/.test(text) && setWeight(text)}
            placeholder="e.g., 80"
            placeholderTextColor="#9bbbd6"
            maxLength={5}
          />
        </View>

        {/* Activity Level */}
        <View style={styles.inputCol}>
          <Text style={styles.label}>Activity Level:</Text>
          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={activity}
              onValueChange={setActivity}
              style={styles.picker}
            >
              <Picker.Item label="Low (Sedentary)" value="Low" />
              <Picker.Item label="Moderate (Active)" value="Moderate" />
              <Picker.Item label="High (Very Active)" value="High" />
            </Picker>
          </View>
        </View>

        {/* Condition (Changed to TextInput) */}
        <View style={styles.inputCol}>
          <Text style={styles.label}>Medical Conditions:</Text>
          <TextInput
            style={styles.textInput}
            value={condition}
            onChangeText={setCondition}
            placeholder="e.g., Diabetes, Malnutrition"
            placeholderTextColor="#9bbbd6"
          />
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.button} onPress={handleCalculate}>
          <Text style={styles.buttonText}>Calculate</Text>
        </TouchableOpacity>
      </View>

      {/* RESULTS */}
      {showResults && (
        <View style={styles.resultsBox}>
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>🔥 Daily Calories</Text>
            <Text style={styles.resultValue}>{results.calories} kcal</Text>
            <Text style={styles.resultSub}>Based on your selections</Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>📊 BMI Analysis</Text>
            <Text style={styles.resultValue}>
              Your BMI is {results.bmi} ({results.bmiStatus})
            </Text>
            <Text style={styles.resultSub}>
              Calculated from height & weight
            </Text>
            <Text style={styles.resultSub}>
              Normal weight range for your height:{' '}
              {results.normalWeightRange || 'N/A'}
            </Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>💧 Water Intake</Text>
            <Text style={styles.resultValue}>{results.water} L / day</Text>
            <Text style={styles.resultSub}>Based on your weight</Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>🥧 Macro Split</Text>

            <View style={styles.legendRow}>
              <View
                style={[styles.legendDot, { backgroundColor: '#65aef2' }]}
              />
              <Text style={styles.legendText}>
                Protein {results.proteinPct}%
              </Text>
              <View
                style={[styles.legendDot, { backgroundColor: '#f2b365' }]}
              />
              <Text style={styles.legendText}>Carbs {results.carbsPct}%</Text>
              <View
                style={[styles.legendDot, { backgroundColor: '#6cc070' }]}
              />
              <Text style={styles.legendText}>Fats {results.fatsPct}%</Text>
            </View>

            <View style={styles.macroBarOuter}>
              <View
                style={[
                  styles.macroSeg,
                  { flex: results.proteinPct, backgroundColor: '#65aef2' },
                ]}
              />
              <View
                style={[
                  styles.macroSeg,
                  { flex: results.carbsPct, backgroundColor: '#f2b365' },
                ]}
              />
              <View
                style={[
                  styles.macroSeg,
                  { flex: results.fatsPct, backgroundColor: '#6cc070' },
                ]}
              />
            </View>

            <View style={styles.macroNumbers}>
              <Text style={styles.macroNumText}>
                Protein {results.protein} g
              </Text>
              <Text style={styles.macroNumText}>Carbs {results.carbs} g</Text>
              <Text style={styles.macroNumText}>Fats {results.fats} g</Text>
            </View>
          </View>
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>⚡ AI Diet Prompt</Text>
            <Text style={styles.resultSub}>
              Copy & paste this into your AI tool to generate a diet plan
            </Text>
            <ScrollView style={styles.promptBox}>
              <Text selectable style={styles.promptText}>
                {`Create a Indian diet plan based on:
- Daily Calories: ${results.calories} kcal
- Protein: ${results.protein} g
- Carbs: ${results.carbs} g
- Fats: ${results.fats} g
- Water Intake: ${results.water} L/day
Provide meal-wise breakdown (Breakfast, Lunch, Dinner).`}
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={() =>
                Clipboard.setString(
                  `Create a Indian diet plan based on:
- Daily Calories: ${results.calories} kcal
- Protein: ${results.protein} g
- Carbs: ${results.carbs} g
- Fats: ${results.fats} g
- Water Intake: ${results.water} L/day
Provide meal-wise breakdown (Breakfast, Lunch, Dinner).`,
                )
              }
            >
              <Text style={styles.copyButtonText}>Copy Prompt</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#feffffff',
    padding: 18,
    alignItems: 'center',
    minHeight: '100%',
  },
  heading: {
    fontSize: 28,
    fontWeight: '600',
    color: '#65aef2',
    textAlign: 'center',
    marginVertical: 24,
    letterSpacing: 1,
    lineHeight: 36,
  },
  formBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderColor: '#c7c7c7',
    borderWidth: 1,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  formTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 22,
    letterSpacing: 1,
    color: '#222',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  inputCol: {
    flex: 1,
    marginBottom: 14,
  },
  label: {
    fontSize: 16,
    marginBottom: 2,
    fontWeight: '500',
    color: '#161d25',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#65aef2',
    borderRadius: 7,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f4fafd',
    marginTop: 2,
    color: '#222',
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: '#65aef2',
    borderRadius: 7,
    overflow: 'hidden',
    backgroundColor: '#f4fafd',
    marginTop: 2,
  },
  picker: {
    height: 52,
    width: '100%',
    color: '#222',
  },
  button: {
    alignSelf: 'center',
    backgroundColor: '#65aef2',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 42,
    marginTop: 18,
    shadowColor: '#65aef2',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  resultsBox: {
    marginTop: 25,
    width: '100%',
    maxWidth: 400,
  },
  resultCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 18,
    marginVertical: 9,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 6,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#222',
  },
  resultValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#65aef2',
  },
  resultSub: {
    marginTop: 4,
    fontSize: 12,
    color: '#6c7a89',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#333',
    marginRight: 8,
  },
  macroBarOuter: {
    height: 18,
    width: '100%',
    backgroundColor: '#e9eef3',
    borderRadius: 10,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  macroSeg: {
    height: '100%',
  },
  macroNumbers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  macroNumText: {
    fontSize: 13,
    color: '#444',
  },
  promptBox: {
    maxHeight: 120,
    width: '100%',
    marginVertical: 8,
  },
  promptText: {
    fontSize: 13,
    color: '#333',
  },
  copyButton: {
    backgroundColor: '#65aef2',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 6,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ConsumptionPlanner;
