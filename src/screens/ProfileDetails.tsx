import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { useActiveProfile } from '../../backend/context/ActiveProfileContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GOOGLE_API_KEY_2 } from '@env';
import { BASE_URL } from '../../config';

// Profile type matches backend fields
type Profile = {
  _id: string;
  name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  dietType: string;
  allergies: string;
  healthGoal: string;
  activityLevel: string;
};

type RootStackParamList = {
  GetStarted: undefined;
  ProfileDetails: undefined;
  // add any other screens here
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProfileDetails'
>;

const ProfileDetails: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { activeProfileId } = useActiveProfile();

  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [diagLoading, setDiagLoading] = useState(false);

  const navigation = useNavigation<NavigationProp>();

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!activeProfileId) {
        setLoading(false);
        setProfile(null);
        return; // 👈 Skip fetch if no profile
      }
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `${BASE_URL}/api/users/profile/${activeProfileId}`,
        );
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = (await res.json()) as Profile;
        setProfile(data);
        setFormData(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching profile');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [activeProfileId]);

  const handleSave = async () => {
    try {
      if (!formData) return;
      setLoading(true);
      setError(null);
      const res = await fetch(
        `${BASE_URL}/api/users/profile/${activeProfileId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        },
      );
      const data = (await res.json()) as Profile;
      if (res.ok) {
        setProfile(data);
        setEditMode(false);
        Alert.alert('Success', 'Profile updated');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error: any) {
      setError(error.message || 'Something went wrong');
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'crimson' }}>Error: {error}</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text>No profile found.</Text>
      </View>
    );
  }

  // Helper to render fields
  const renderField = (
    label: string,
    key: keyof Profile,
    keyboard?: 'default' | 'numeric',
  ) => (
    <View style={styles.detailItem}>
      <Text style={styles.label}>{label}</Text>
      {editMode ? (
        <TextInput
          style={styles.value}
          value={formData?.[key] || ''}
          onChangeText={text =>
            setFormData(prev => (prev ? { ...prev, [key]: text } : prev))
          }
          keyboardType={keyboard || 'default'}
        />
      ) : (
        <Text style={styles.value}>{profile[key]}</Text>
      )}
    </View>
  );

  const fetchDiagnosis = async () => {
    if (!profile) return;

    setDiagLoading(true);
    setDiagnosis(null);

    try {
      const prompt = `You are a friendly health assistant 🤗. Based on the following profile details, provide short, clear, and actionable health advice in bullet points.  

### Rules:  
1️⃣ Calculate BMI and tell if the user is overweight, underweight, or normal. tell the weight range based on height.  
2️⃣ Give 1 line tip based on their **vegetarian or non-vegetarian** diet type.
suggest foods that can help.  
3️⃣ If the user has allergies, explain about the allergies if any, user has,and explain trigger points and foods to avoid and recommend to eat.  
4️⃣ Based on activity level, suggest whether they need to **increase or maintain it**.suggest foods that can help. 
5️⃣ based on their health goal advice them how to achieve it in simple words.
6️⃣ Use **emojis** in every point to make it friendly.  
7️⃣ Format each point on a **new line** for clarity.  
8️⃣ Do not use * for bullet points, only use numbers and emojis as per rules.  
9️⃣ The output must be **clean, simple, and strictly bullet-style** (no long paragraphs).  

### Profile Data:  
- Name: ${profile.name}  
- Age: ${profile.age}  
- Gender: ${profile.gender}  
- Height: ${profile.height} cm  
- Weight: ${profile.weight} kg  
- Diet Type: ${profile.dietType}  
- Allergies: ${profile.allergies}  
- Health Goal: ${profile.healthGoal}  
- Activity Level: ${profile.activityLevel}  

### At the End, Add This Section (keep exact formatting):  

✨ How this AI-powered Nutritionist App Can Help You ✨  
- Use the food scanner to instantly check if products fit your health profile.  
- Get personalized meal and diet plans by asking our AI nutritionist.  
- Add healthy choices directly to the food planner for daily tracking.  
- Stay motivated with reminders, allergy alerts, and goal-focused guidance.  

`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_API_KEY_2}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        },
      );

      const data: any = await response.json();
      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'No diagnosis available.';

      setDiagnosis(aiText);
    } catch (error) {
      console.error(error);
      setDiagnosis('Failed to fetch diagnosis.');
    } finally {
      setDiagLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/icons/profileIcon.png')}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{profile.name}</Text>
        <TouchableOpacity
          style={styles.editIcon}
          onPress={() => setEditMode(!editMode)}
        >
          <Image
            source={require('../assets/icons/editIcon.png')}
            style={styles.editButton}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Profile Details</Text>
        </View>

        {/* Row 1 */}
        <View style={styles.row}>
          {renderField('Age', 'age', 'numeric')}
          {renderField('Gender', 'gender')}
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          {renderField('Height (cm)', 'height', 'numeric')}
          {renderField('Weight (kg)', 'weight', 'numeric')}
        </View>

        {/* Row 3 */}
        <View style={styles.row}>
          {renderField('Diet Type', 'dietType')}
          {renderField('Allergies', 'allergies')}
        </View>

        {/* Row 4 */}
        <View style={styles.row}>
          {renderField('Health Goal', 'healthGoal')}
          {renderField('Activity Level', 'activityLevel')}
        </View>
      </View>

      {editMode && (
        <TouchableOpacity
          style={[
            styles.section,
            {
              backgroundColor: '#4ea4e5',
              marginHorizontal: 40,
              marginVertical: 15,
              borderRadius: 12,
              borderWidth: 0,
              paddingVertical: 12,
            },
          ]}
          onPress={handleSave}
        >
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 16,
            }}
          >
            Save Changes
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.diagnose}>
        <ScrollView>
          <Text style={styles.diagnoseText}>
            Diagnosis based on Profile Details
          </Text>

          {diagLoading ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text style={{ margin: 10, alignSelf: 'center', fontSize: 17 }}>
              {diagnosis || 'Press button below to fetch diagnosis'}
            </Text>
          )}
        </ScrollView>
        <TouchableOpacity
          onPress={fetchDiagnosis}
          style={{
            backgroundColor: '#4ea4e5',
            padding: 12,
            borderRadius: 12,
            marginTop: 15,
            alignSelf: 'center',
            width: '70%',
          }}
        >
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 15,
            }}
          >
            Get AI Diagnosis
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f0ff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 6,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 35,
    tintColor: '#0b385b',
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#4ea4e5',
  },
  name: {
    fontSize: 26,
    fontWeight: '600',
    flex: 1,
    color: '#0a0634',
  },
  editIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  editButton: {
    width: 30,
    height: 30,
    tintColor: '#0a0634',
  },
  logoutIcon: {
    position: 'absolute',
    top: 18,
    right: 70,
    backgroundColor: '#df3e3eff',
    paddingHorizontal: 17,
    paddingVertical: 8,
    borderRadius: 15,
  },
  logoutText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },

  section: {
    backgroundColor: '#f7f9fc',
    borderRadius: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#d0def3',
  },
  sectionHeader: {
    backgroundColor: '#cde1f7',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingVertical: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 20,
    color: '#426dae',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailItem: { width: '48%' },
  label: {
    fontSize: 15,
    color: '#6c7a89',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  diagnose: {
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center',
    minHeight: 225,
    borderRadius: 15,
    borderColor: '#d0def3',
    borderWidth: 2,
    padding: 15,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  diagnoseText: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
});

export default ProfileDetails;
