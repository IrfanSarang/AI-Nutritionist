import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { indian_foods } from '../assets/dataSet/indianFood';
import { GOOGLE_API_KEY_1 } from '@env';

export default function AIScreen() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([
    {
      sender: 'bot',
      text: "Hi! I'm Nova, your personal AI Nutritionist. How can I help you?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessageToAI = async () => {
    if (!message.trim()) return;

    // Add user message immediately
    setChat(prev => [...prev, { sender: 'user', text: message }]);
    setIsLoading(true);

    try {
      const conversationHistoryJSON = chat.map(c => ({
        sender: c.sender,
        text: c.text,
      }));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_API_KEY_1}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: JSON.stringify({
                      assistantProfile: {
                        name: 'Nova',
                        role: 'AI Nutritionist',
                        description:
                          'Hi! I am Nova, your AI Nutritionist. I provide friendly, practical, and supportive guidance. I first try to understand your problem before suggesting anything. I explain why your issue might be happening in simple, easy-to-understand language, then ask clarifying questions to know more about your habits or diet. Only after you indicate that you want a meal plan do I provide one. When suggesting meals, I include protein (dal, paneer, eggs, chicken, tofu, legumes), carbs (rice, chapati, oats, quinoa), vegetables and fruits for vitamins and fiber, and healthy fats (nuts, seeds, small amounts of oil), using healthy cooking methods like boiling, steaming, grilling, or roasting. I respect dietary restrictions such as allergies, vegetarian or vegan preferences, keep portions realistic and varied, encourage hydration, and provide simple, practical options. Meal plans are formatted with headings and emojis like Breakfast 🍳, Lunch 🥗, and Dinner 🍲, with 3 options per meal, leaving a line between meals. All answers are short, clear, under 100 words, and include line breaks after every 2 lines. I always prioritize understanding the problem, explaining it, asking for clarification, and then giving actionable guidance, only giving full meal plans when requested.',
                        dataset: indian_foods,
                      },

                      userMessage: message,
                      conversationHistory: conversationHistoryJSON,
                    }),
                  },
                ],
              },
            ],
          }),
        },
      );

      const data: any = await response.json();
      let botReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Sorry, I couldn’t understand.';
      botReply = botReply.trim();

      setChat(prev => [...prev, { sender: 'bot', text: botReply }]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setChat(prev => [
        ...prev,
        { sender: 'bot', text: 'Oops! Something went wrong.' },
      ]);
    }

    setIsLoading(false);
    setMessage('');
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chat]);

  const clearChat = () => {
    setChat([
      {
        sender: 'bot',
        text: "Hi! I'm Nova, your personal AI Nutritionist. How can I help you?",
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../assets/icons/botLogoback.png')}
          style={styles.headerIcon}
        />
        <Text style={styles.headerText}>NovaBot</Text>

        <View style={{ padding: 10, alignItems: 'center' }}>
          <TouchableOpacity style={styles.clearButton} onPress={clearChat}>
            <Text style={styles.clearButtonText}>Clear Chat</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat area */}
      <ScrollView ref={scrollViewRef} style={styles.chatArea}>
        {chat.map((c, index) => (
          <View
            key={index}
            style={c.sender === 'bot' ? styles.botRow : styles.userRow}
          >
            {c.sender === 'bot' && (
              <Image
                source={require('../assets/icons/askAiLogo.png')}
                style={styles.chatIcon}
              />
            )}
            <View
              style={c.sender === 'bot' ? styles.botBubble : styles.userBubble}
            >
              <Text style={styles.chatText}>{c.text}</Text>
            </View>
            {c.sender === 'user' && (
              <Image
                source={require('../assets/icons/profileIcon.png')}
                style={styles.chatIconUser}
              />
            )}
          </View>
        ))}

        {isLoading && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 5,
            }}
          >
            <ActivityIndicator size="small" color="#4A90E2" />
            <Text style={{ marginLeft: 5, color: '#4A90E2' }}>
              Nova is typing...
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Input row */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.textInput}
          placeholder="Type Your Message Here..."
          placeholderTextColor="#666"
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity onPress={sendMessageToAI}>
          <Image
            source={require('../assets/icons/sendIcon.png')}
            style={styles.sendIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Clear Chat Button */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  headerIcon: { width: 45, height: 45, marginRight: 10, borderRadius: 22.5 },
  headerText: {
    color: '#fff',
    fontSize: 23,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  chatArea: { flex: 1, paddingHorizontal: 8, marginBottom: 10 },
  botRow: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 5 },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    marginVertical: 5,
  },
  chatIcon: { width: 40, height: 40, marginHorizontal: 3 },
  chatIconUser: {
    width: 30,
    height: 30,
    marginHorizontal: 6,
    marginVertical: 3,
    tintColor: '#4A90E2',
  },
  botBubble: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#e0eaff',
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  chatText: { fontSize: 16, color: '#000', letterSpacing: 1 },
  inputRow: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 17,
    paddingVertical: 6,
    height: 55,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    height: 35,
  },
  sendIcon: { width: 35, height: 35, marginLeft: 5, tintColor: '#fff' },
  clearButton: {
    backgroundColor: '#f53b2eff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    left: 40,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
