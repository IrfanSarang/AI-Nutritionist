import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useActiveProfile } from '../../backend/context/ActiveProfileContext';
import { useUser } from '../../backend/context/UserIdContext';

type RootStackParamList = {
  Profiles: undefined;
  ProfileDetails: { id: string };
  ProfileForm: undefined;
};

type Profile = {
  id: string; // normalized id used throughout the app
  name: string;
};

// 👇 move this into .env later with react-native-config
const BASE_URL = 'http://192.168.0.104:5000/api/users';

export default function ProfilesScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { activeProfileId, setActiveProfileId } = useActiveProfile();
  const { userId } = useUser(); // <-- Use the new context hook

  // 🔧 Safe normalization
  const normalize = (raw: any[]): Profile[] =>
    (raw ?? []).flatMap(user =>
      (user.profile ?? [])
        .filter((p: any) => p && (p._id || p.id) && typeof p.name === 'string')
        .map((p: any, idx: number) => ({
          id: String(p._id ?? p.id ?? `${user._id}-${idx}`),
          name: String(p.name),
        })),
    );

  const fetchProfiles = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`${BASE_URL}/fetchData`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const json = (await res.json()) as unknown;
      const data = Array.isArray(json) ? normalize(json) : [];
      setProfiles(data);

      if (data.length > 0 && !activeProfileId) {
        setActiveProfileId(data[0].id);
      }
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load profiles');
      setProfiles([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeProfileId, setActiveProfileId]);

  // NEW: Delete profile handler
  const handleDeleteProfile = async (profileId: string) => {
    try {
      setLoading(true);
      setError(null);
      // const userId = await AsyncStorage.getItem('userId'); <-- REMOVE THIS LINE
      if (!userId) {
        setError('User ID not found');
        setLoading(false);
        return;
      }
      const res = await fetch(`${BASE_URL}/${userId}/profiles/${profileId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to delete profile');
      }
      await fetchProfiles();
    } catch (e: any) {
      setError(e?.message ?? 'Failed to delete profile');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  useFocusEffect(
    useCallback(() => {
      fetchProfiles();
    }, [fetchProfiles]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProfiles();
  }, [fetchProfiles]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4287f5" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchProfiles}
          accessibilityRole="button"
          accessibilityLabel="Retry loading profiles"
        >
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (profiles.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No profiles found</Text>
        <TouchableOpacity
          style={[styles.retryButton, { marginTop: 12 }]}
          onPress={() => navigation.navigate('ProfileForm')}
          accessibilityRole="button"
          accessibilityLabel="Add a new user"
        >
          <Text style={styles.retryText}>+ Add New Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Profiles</Text>
      </View>

      {/* Profile List */}
      <FlatList
        data={profiles}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View style={styles.profileCard}>
            <View style={styles.profileInfo}>
              <Image
                source={require('../assets/icons/profileIcon.png')}
                style={styles.profileImage}
              />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.name}>{item.name}</Text>
                <TouchableOpacity
                  style={{
                    backgroundColor:
                      item.id === activeProfileId ? '#007bff' : '#5aa9f9',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 20,
                    right: 8,
                  }}
                  onPress={() => setActiveProfileId(item.id)}
                  disabled={item.id === activeProfileId}
                >
                  <Text
                    style={{ color: 'white', fontWeight: 'bold', fontSize: 13 }}
                  >
                    {item.id === activeProfileId ? 'Active' : 'Switch Profile'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  navigation.navigate('ProfileDetails', { id: item.id })
                }
                accessibilityRole="button"
                accessibilityLabel={`Show details for ${item.name}`}
              >
                <Text style={styles.editText}>Show</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.editButton,
                  { backgroundColor: 'crimson', marginLeft: 8 },
                ]}
                onPress={() =>
                  Alert.alert(
                    'Delete Profile',
                    'Are you sure you want to delete this profile?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => handleDeleteProfile(item.id),
                      },
                    ],
                  )
                }
                accessibilityRole="button"
                accessibilityLabel={`Delete ${item.name}`}
              >
                <Text style={styles.editText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Add New User Button */}
      <TouchableOpacity
        style={styles.addUserButton}
        onPress={() => navigation.navigate('ProfileForm')}
        accessibilityRole="button"
        accessibilityLabel="Add a new user"
      >
        <Text style={styles.addUserText}>+ Add New User</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e5e5e5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    backgroundColor: '#4287f5',
    padding: 14,
    alignItems: 'center',
    borderRadius: 2,
    marginBottom: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    letterSpacing: 2,
  },

  profileCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 14,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  profileInfo: { flexDirection: 'row', alignItems: 'center' },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    tintColor: '#4287f5',
  },
  name: { fontSize: 20, fontWeight: 'bold' },
  activeText: { fontSize: 14, letterSpacing: 1, color: 'gray' },

  editButton: {
    backgroundColor: '#5aa9f9',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  editText: { color: 'white', fontWeight: 'bold', fontSize: 14 },

  addUserButton: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 20,
    alignItems: 'center',
    bottom: 25,
  },
  addUserText: { fontSize: 15, fontWeight: '600' },

  errorText: { color: 'crimson', marginBottom: 12 },
  retryButton: {
    backgroundColor: '#4287f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
  },
  retryText: { color: 'white', fontWeight: '600' },
});
