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
import { BASE_URL } from '../../config';

type RootStackParamList = {
  Profiles: undefined;
  ProfileDetails: { id: string };
  ProfileForm: undefined;
  Login: undefined;
  ChangePasswordScreen: undefined;
};

type Profile = {
  id: string;
  name: string;
};

export default function ProfilesScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { activeProfileId, setActiveProfileId } = useActiveProfile();
  const { userId } = useUser();

  const [dropdownVisible, setDropdownVisible] = useState(false);

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
      const res = await fetch(`${BASE_URL}/api/users/fetchData`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
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

  const handleDeleteProfile = async (profileId: string) => {
    try {
      setLoading(true);
      setError(null);
      if (!userId) {
        setError('User ID not found');
        setLoading(false);
        return;
      }
      const res = await fetch(
        `${BASE_URL}/api/users/${userId}/profiles/${profileId}`,
        {
          method: 'DELETE',
        },
      );
      if (!res.ok) throw new Error('Failed to delete profile');
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

  const handleLogout = () => {
    setActiveProfileId(null); // Clear active profile
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }], // Replace with your login screen
    });
  };

  const renderProfileItem = ({ item }: { item: Profile }) => (
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
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 13 }}>
              {item.id === activeProfileId ? 'Active' : 'Switch Profile'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('ProfileDetails', { id: item.id })}
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
        >
          <Text style={styles.editText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header always visible */}
      <View
        style={[
          styles.header,
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
        ]}
      >
        <Text style={styles.headerText}>Profiles</Text>

        <View style={{ position: 'relative' }}>
          <TouchableOpacity
            onPress={() => setDropdownVisible(prev => !prev)}
            style={{ padding: 6 }}
          >
            <Image
              source={require('../assets/icons/settingsLogo.png')}
              style={{ width: 26, height: 26, tintColor: 'white' }}
            />
          </TouchableOpacity>

          {dropdownVisible && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setDropdownVisible(false);
                  navigation.navigate('ChangePasswordScreen');
                }}
              >
                <Text>Change Password</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setDropdownVisible(false);
                  handleLogout();
                }}
              >
                <Text style={{ color: 'crimson' }}>Logout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Conditional Content */}
      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4287f5" />
        </View>
      )}

      {!loading && error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchProfiles}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && profiles.length === 0 && (
        <View style={styles.center}>
          <Text>No profiles found</Text>
          <Text>Please add a new user profile</Text>
        </View>
      )}

      {!loading && !error && profiles.length > 0 && (
        <FlatList
          data={profiles}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={renderProfileItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* Add New User Button always visible */}
      <TouchableOpacity
        style={styles.addUserButton}
        onPress={() => navigation.navigate('ProfileForm')}
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
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 20,
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
  dropdownMenu: {
    position: 'absolute',
    top: 40,
    right: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 8,
    zIndex: 999,
    minWidth: 160,
  },
  dropdownItem: {
    paddingVertical: 15,
    paddingHorizontal: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    fontSize: 20,
  },
});
