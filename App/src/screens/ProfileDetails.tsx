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
import { useActiveProfile } from '../context/ActiveProfileContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GOOGLE_API_KEY_2 } from '@env';
import BASE_URL from '../config/url';
import { authFetch } from '../utils/api';

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
  Progress: undefined; // ✅ added
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

  useEffect(() => {
    const fetchProfile = async () => {
      if (!activeProfileId) {
        setLoading(false);
        setProfile(null);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const res = await authFetch(
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
      const res = await authFetch(
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

  const fetchDiagnosis = async () => {
    if (!profile) return;

    setDiagLoading(true);
    setDiagnosis(null);

    try {
      const response = await authFetch(`${BASE_URL}/api/users/diagnosis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile,
        }),
      });

      const data = await response.json();
      setDiagnosis(data.reply);
    } catch (error) {
      setDiagnosis('Failed to fetch diagnosis.');
    } finally {
      setDiagLoading(false);
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

        <View style={styles.row}>
          {renderField('Age', 'age', 'numeric')}
          {renderField('Gender', 'gender')}
        </View>

        <View style={styles.row}>
          {renderField('Height (cm)', 'height', 'numeric')}
          {renderField('Weight (kg)', 'weight', 'numeric')}
        </View>

        <View style={styles.row}>
          {renderField('Diet Type', 'dietType')}
          {renderField('Allergies', 'allergies')}
        </View>

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

      {/* ✅ NEW BUTTON */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Progress')}
        style={{
          backgroundColor: '#0b385b',
          padding: 12,
          borderRadius: 12,
          marginHorizontal: 40,
          marginBottom: 20,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>
          View Progress
        </Text>
      </TouchableOpacity>
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
    borderRadius: 15,
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
    padding: 6,
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
  },

  diagnoseText: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
});

export default ProfileDetails;