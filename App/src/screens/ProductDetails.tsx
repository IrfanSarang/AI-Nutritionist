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

import BASE_URL from '../config/url';
import { authFetch } from '../utils/api';

type RootStackParamList = {
  ProductDetails: { code: string };
};

type ProductDetailsRouteProp = RouteProp<
  RootStackParamList,
  'ProductDetails'
>;

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
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [code]);

  // ✅ SECURE AI CALL (NO FRONTEND API KEY)
  const fetchAIInsights = async () => {
    if (!product?.ingredients_text) {
      setAiInsight('No ingredients available for AI insights.');
      return;
    }

    setAiLoading(true);

    try {
      const aiRes = await authFetch(`${BASE_URL}/api/users/product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: product.ingredients_text,
        }),
      });

      const aiData = await aiRes.json();
      setAiInsight(aiData.reply || 'No insights available.');
    } catch (error) {
      console.error(error);
      setAiInsight('Could not load AI insights.');
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
            <Text style={styles.detail}>
              Categories: {product.categories}
            </Text>
          )}
        </View>

        {product.ingredients_text && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <Text style={styles.sectionText}>
              {product.ingredients_text}
            </Text>
          </View>
        )}

        {product.nutriments && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Nutritional Information
            </Text>

            {[
              {
                label: 'Calories',
                value: product.nutriments.energy_kcal,
                unit: 'kcal',
              },
              { label: 'Fat', value: product.nutriments.fat, unit: 'g' },
              {
                label: 'Sugars',
                value: product.nutriments.sugars,
                unit: 'g',
              },
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

        {/* AI SECTION */}
        <View style={[styles.card, styles.aiCard]}>
          <Text style={styles.sectionTitle}>A.I. Insight</Text>

          {aiLoading ? (
            <ActivityIndicator size="small" color="#1e90ff" />
          ) : (
            <Text style={styles.sectionText}>{aiInsight}</Text>
          )}

          <TouchableOpacity
            style={styles.aiButton}
            onPress={fetchAIInsights}
          >
            <Text style={styles.aiButtonText}>
              Generate AI Insights
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, styles.tipsCard]}>
          <Text style={styles.sectionTitle}>Nutritionist Tips</Text>
          <Text style={styles.sectionText}>
            • Check sugar and salt intake if you have diabetes or
            hypertension.{'\n\n'}• High fat products should be consumed in
            moderation.{'\n\n'}• Prefer products with more protein and
            natural ingredients.{'\n\n'}• Read ingredients carefully for
            allergens.
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
    elevation: 5,
  },
  backButton: { marginRight: 13, marginLeft: 6 },
  backImage: {
    width: 30,
    height: 30,
    tintColor: '#fff',
  },
  headerText: {
    color: '#fff',
    fontSize: 27,
    fontWeight: 'bold',
  },
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, color: 'red' },
  image: {
    width: 220,
    height: 220,
    alignSelf: 'center',
    marginBottom: 16,
    borderRadius: 12,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoRow: { marginBottom: 12 },
  detail: { fontSize: 16, textAlign: 'center', color: '#555' },
  card: {
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3,
  },
  aiCard: { backgroundColor: '#e0f7fa' },
  tipsCard: { backgroundColor: '#fff3e0' },
  sectionTitle: { fontWeight: 'bold', fontSize: 18 },
  sectionText: { fontSize: 16, lineHeight: 22 },
  nutriRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutriLabel: { fontSize: 15 },
  nutriValue: { fontSize: 15, fontWeight: 'bold' },
  aiButton: {
    marginTop: 12,
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  aiButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default ProductDetails;