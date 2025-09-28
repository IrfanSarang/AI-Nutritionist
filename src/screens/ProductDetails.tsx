import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GOOGLE_API_KEY_2 } from '@env';

type RootStackParamList = {
  ProductDetails: { code: string };
};

type ProductDetailsRouteProp = RouteProp<RootStackParamList, 'ProductDetails'>;

interface ProductData {
  product_name?: string;
  brands?: string;
  categories?: string;
  ingredients_text?: string;
  image_url?: string;
  nutriments?: {
    energy_kcal?: number;
    fat?: number;
    sugars?: number;
    salt?: number;
    proteins?: number;
  };
}

const ProductDetails: React.FC = () => {
  const route = useRoute<ProductDetailsRouteProp>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { code } = route.params;

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [aiInsight, setAiInsight] = useState<string>(
    'AI insights not generated yet.',
  );
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `https://world.openfoodfacts.org/api/v0/product/${code}.json`,
        );
        const data: any = await res.json();
        if (data.status === 1) {
          setProduct(data.product);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error('Product fetch error:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [code]);

  const fetchAIInsights = async (ingredients: string) => {
    if (!ingredients) {
      setAiInsight('No ingredients available for AI insights.');
      return;
    }

    setAiLoading(true);

    try {
      const prompt = `You are a friendly nutrition expert 🤗. Analyze the following ingredients of a packaged food product and provide health guidance in simple, clear bullet points.  

### Rules:  
1️⃣ The ingredients are listed in order of percentage from highest to lowest. Focus mainly on the first ingredient, as it makes up the largest portion.  
2️⃣ Clearly state if this product is recommended, not recommended, or can be consumed occasionally.  
3️⃣ Explain in simple words if the product contains artificial additives, preservatives, or chemical ingredients, and how they may affect health.  
4️⃣ Mention which groups of people should strictly avoid this product, based only on the main ingredients. Do not assume groups (like pregnant women) unless directly relevant.  
5️⃣ Give short, actionable tips for safe consumption if applicable.  
6️⃣ Use simple language anyone can understand.  
7️⃣ Format each point on a new line with an emoji at the beginning.  
8️⃣ Do NOT use *, -, or any markdown symbols. Only plain text lines with emojis.  
9️⃣ Keep it concise: 5–8 bullet points maximum.  
🔟 At the end, give a clear overall verdict as one of these three only, with a compulsory emoji that matches the meaning:  
   ✅ Good For Health  
   ⚠️ Better Avoid This Product  
   ❌ Harmful For Health  

### Ingredients:  
${ingredients}  
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_API_KEY_2}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        },
      );

      const data: any = await response.json();
      console.log('AI API Response:', JSON.stringify(data, null, 2));

      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'No AI insights available.';

      setAiInsight(aiText);
    } catch (error) {
      console.error('AI fetch error:', error);
      setAiInsight('Failed to fetch AI insights.');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e90ff" />
      </View>
    );

  if (!product)
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Product not found!</Text>
      </View>
    );

  return (
    <View style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require('../assets/icons/back.png')}
            style={styles.backImage}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Product Details</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        {product.image_url && (
          <Image source={{ uri: product.image_url }} style={styles.image} />
        )}

        <Text style={styles.productName}>
          {product.product_name || 'Unknown Product'}
        </Text>

        <View style={styles.infoRow}>
          {product.brands && (
            <Text style={styles.detail}>Brand: {product.brands}</Text>
          )}
          {product.categories && (
            <Text style={styles.detail}>Categories: {product.categories}</Text>
          )}
        </View>

        {product.ingredients_text && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <Text style={styles.sectionText}>{product.ingredients_text}</Text>
          </View>
        )}

        {product.nutriments && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Nutritional Information</Text>
            {[
              {
                label: 'Calories',
                value: product.nutriments.energy_kcal,
                unit: 'kcal',
              },
              { label: 'Fat', value: product.nutriments.fat, unit: 'g' },
              { label: 'Sugars', value: product.nutriments.sugars, unit: 'g' },
              {
                label: 'Proteins',
                value: product.nutriments.proteins,
                unit: 'g',
              },
              { label: 'Salt', value: product.nutriments.salt, unit: 'g' },
            ].map((item, idx) => (
              <View style={styles.nutriRow} key={idx}>
                <Text style={styles.nutriLabel}>{item.label}:</Text>
                <Text style={styles.nutriValue}>
                  {item.value ?? '-'} {item.unit}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* AI Insights Card */}
        <View style={[styles.card, styles.aiCard]}>
          <Text style={styles.sectionTitle}>A.I. Insight</Text>
          {aiLoading ? (
            <ActivityIndicator size="small" color="#1e90ff" />
          ) : (
            <Text style={styles.sectionText}>{aiInsight}</Text>
          )}

          <TouchableOpacity
            style={styles.aiButton}
            onPress={() => fetchAIInsights(product?.ingredients_text || '')}
          >
            <Text style={styles.aiButtonText}>Generate AI Insights</Text>
          </TouchableOpacity>
        </View>

        {/* Nutritionist Tips */}
        <View style={[styles.card, styles.tipsCard]}>
          <Text style={styles.sectionTitle}>Nutritionist Tips</Text>
          <Text style={styles.sectionText}>
            • Check sugar and salt intake if you have diabetes or hypertension.
            {'\n'}
            {'\n'}• High fat products should be consumed in moderation.
            {'\n'}
            {'\n'}• Prefer products with more protein and natural ingredients.
            {'\n'}
            {'\n'}• Read ingredients carefully for allergens.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f2f5f7' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: '#4A90E2',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: { marginRight: 13, marginLeft: 6 },
  backImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  headerText: {
    color: '#fff',
    fontSize: 27,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, color: 'red', textAlign: 'center' },
  image: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  infoRow: { marginBottom: 12 },
  detail: { fontSize: 16, textAlign: 'center', color: '#555' },
  card: {
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aiCard: { backgroundColor: '#e0f7fa' },
  tipsCard: { backgroundColor: '#fff3e0' },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    color: '#222',
  },
  sectionText: { fontSize: 17, lineHeight: 22, color: '#444' },
  nutriRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nutriLabel: { fontSize: 15, color: '#555' },
  nutriValue: { fontSize: 15, fontWeight: 'bold', color: '#111' },
  aiButton: {
    marginTop: 12,
    backgroundColor: '#1e90ff',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  aiButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProductDetails;
