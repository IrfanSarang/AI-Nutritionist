import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MealPlanner from '../components/MealPlanner';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useActiveProfile } from '../../backend/context/ActiveProfileContext';

type RootStackParamList = {
  ConsumptionPlanner: undefined; // corrected spelling
  HealthTips: undefined;
  ProfileScreen: undefined;
  AI: undefined; // added for 2nd card navigation
};

const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { activeProfileName } = useActiveProfile();

  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  };
  const formattedDate = today.toLocaleDateString('en-US', options);

  return (
    <LinearGradient
      colors={['#ffffff', '#88E9FF', '#ffffff']}
      style={styles.container}
    >
      {/* Header Row */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hello, {activeProfileName ? activeProfileName : 'Guest'}
          </Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>

        {/* Profile button */}
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('ProfileScreen')}
        >
          <Image
            source={require('../assets/icons/profileIcon.png')}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => navigation.navigate('AI')} // 👈 navigate to AI screen
      >
        <Image
          source={require('../assets/icons/askAiLogo.png')}
          style={styles.icon}
        />
        <Text style={styles.searchInputPlaceholder}>Ask AI...</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Two Cards */}
        <View style={styles.twoCardContainer}>
          {/* Card One */}
          <TouchableOpacity
            style={styles.cardOne}
            onPress={() => navigation.navigate('ConsumptionPlanner')}
          >
            <Image
              source={require('../assets/images/consumeDaily.png')}
              style={styles.cardOneImage}
            />
          </TouchableOpacity>

          {/* Card Two */}
          <TouchableOpacity
            style={styles.cardTwo}
            onPress={() => navigation.navigate('HealthTips')}
          >
            <Image
              source={require('../assets/images/healthTips.png')}
              style={styles.cardTwoImage}
            />
          </TouchableOpacity>
        </View>

        {/* Meal Planner */}
        <MealPlanner />
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  greeting: {
    fontSize: 25,
    fontWeight: '600',
    color: '#000',
  },
  date: {
    fontSize: 16,
    color: '#777',
    marginTop: 4,
    paddingHorizontal: 2,
  },
  profileButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1e90ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: 40,
    height: 40,
    tintColor: '#fff',
    elevation: 7,
  },
  inputContainer: {
    width: '90%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingLeft: 50,
    marginVertical: 3,
    elevation: 7,
  },
  icon: {
    width: 40,
    height: 40,
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: [{ translateY: -20 }],
  },
  searchInputPlaceholder: {
    fontSize: 17,
    color: 'rgba(0,0,0,0.5)',
    marginHorizontal: 5,
  },

  searchInput: {
    fontSize: 17,
    color: '#000',
    height: '100%',
  },
  twoCardContainer: {
    height: 250,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 2,
    gap: 8,
  },
  cardOne: {
    backgroundColor: '#fff',
    width: '55%',
    height: '75%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    elevation: 7,
  },
  cardTwo: {
    backgroundColor: '#fff',
    width: '38%',
    height: '75%',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 7,
  },
  cardOneImage: {
    width: '115%',
    height: '100%',
    resizeMode: 'contain',
  },
  cardTwoImage: {
    width: '100%',
    height: '87%',
    resizeMode: 'contain',
    position: 'absolute',
    top: 24,
    left: 4,
  },
});

export default HomeScreen;
