import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { generalTips, Tip } from '../assets/dataSet/generalTips';
import { personalizedTips } from '../assets/dataSet/personalizedtips';

const HealthTipsScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'General' | 'Personalized'>(
    'General',
  );
  const [subTab, setSubTab] = useState<'Underweight' | 'Normal' | 'Overweight'>(
    'Normal',
  );

  const [generalIndex, setGeneralIndex] = useState(0);
  const [personalizedIndex, setPersonalizedIndex] = useState(0);

  // Choose active tips list
  const getActiveTips = () => {
    if (selectedTab === 'General') {
      return generalTips;
    } else {
      return personalizedTips[
        subTab.toLowerCase() as 'underweight' | 'normal' | 'overweight'
      ];
    }
  };

  const tips = getActiveTips();
  const activeTip =
    selectedTab === 'General' ? tips[generalIndex] : tips[personalizedIndex];

  // Next button handler
  const handleChangeTip = () => {
    if (selectedTab === 'General') {
      setGeneralIndex(prev => (prev + 1) % generalTips.length);
    } else {
      const list =
        personalizedTips[
          subTab.toLowerCase() as 'underweight' | 'normal' | 'overweight'
        ];
      setPersonalizedIndex(prev => (prev + 1) % list.length);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Heading */}
      <Text style={styles.heading}>Daily Health Tips</Text>
      <Text style={styles.subText}>
        Stay consistent!{'\n'}Small changes lead to big results
      </Text>

      {/* Top Toggle Buttons */}
      <View style={styles.toggleContainer}>
        {['General', 'Personalized'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.toggleButton,
              selectedTab === tab && styles.activeToggle,
            ]}
            onPress={() => {
              setSelectedTab(tab as 'General' | 'Personalized');
              setGeneralIndex(0);
              setPersonalizedIndex(0);
            }}
          >
            <Text
              style={[
                styles.toggleText,
                selectedTab === tab && styles.activeToggleText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sub Buttons only if Personalized */}
      {selectedTab === 'Personalized' && (
        <View style={styles.toggleContainer}>
          {['Underweight', 'Normal', 'Overweight'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.toggleButton,
                subTab === tab && styles.activeToggle,
              ]}
              onPress={() => {
                setSubTab(tab as 'Underweight' | 'Normal' | 'Overweight');
                setPersonalizedIndex(0);
              }}
            >
              <Text
                style={[
                  styles.toggleText,
                  subTab === tab && styles.activeToggleText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Tip Card */}
      {activeTip && (
        <View style={[styles.tipCard, { borderColor: activeTip.color }]}>
          <View
            style={[styles.tipHeader, { backgroundColor: activeTip.color }]}
          >
            <Text style={styles.emoji}>{activeTip.emoji}</Text>
            <View>
              <Text style={styles.tipTitle}>{activeTip.title}</Text>
              <Text style={styles.tipSubtitle}>{activeTip.subtitle}</Text>
            </View>
          </View>

          <View style={styles.tipBody}>
            <Text style={styles.bold}>Benefit:</Text>
            <Text style={styles.normal}>{activeTip.benefit}</Text>

            <Text style={[styles.bold, { marginTop: 6 }]}>Bonus:</Text>
            <Text style={styles.normal}>{activeTip.bonus}</Text>

            <View style={styles.aiBox}>
              <Text style={[styles.aiText, { color: activeTip.color }]}>
                AI Insight: {activeTip.ai}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Change Tip Button */}
      <TouchableOpacity style={styles.changeButton} onPress={handleChangeTip}>
        <Text style={styles.changeButtonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: '#ffffffff',
    alignItems: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a73e8',
    textAlign: 'center',
    marginBottom: 6,
  },
  subText: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 25,
    padding: 4,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    margin: 4,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#555',
  },
  activeToggle: {
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activeToggleText: {
    color: '#000',
    fontWeight: '600',
  },
  tipCard: {
    width: '95%',
    maxWidth: 370,
    borderWidth: 1.5,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  emoji: {
    fontSize: 32,
    marginRight: 12,
  },
  tipTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#fff',
  },
  tipSubtitle: {
    fontSize: 14,
    color: '#f0f8ff',
  },
  tipBody: {
    padding: 16,
  },
  bold: {
    fontWeight: '700',
    fontSize: 16,
  },
  normal: {
    fontSize: 15,
    marginTop: 2,
    color: '#333',
  },
  aiBox: {
    backgroundColor: '#f7f5f5ff',
    padding: 10,
    borderRadius: 12,
    marginTop: 12,
  },
  aiText: {
    fontSize: 14,
    fontWeight: '400',
  },
  changeButton: {
    backgroundColor: '#1a73e8',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 10,
  },
  changeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default HealthTipsScreen;
