import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';
import { Link } from 'expo-router';
import { getProducts, Product } from '../data/products';
import { supabase } from '../../lib/supabase';
import { addToCart } from '../data/cart';

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
    useEffect(() => {
  getProducts()
    .then(setProducts)
    .catch((err) => {
      console.error(err);
      setError('Could not load products.');
    })
    .finally(() => setLoading(false));

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event) => {
    console.log('AUTH STATE:', event);
  });

  return () => {
    subscription.unsubscribe();
  };
}, []);

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.id);
      Alert.alert('Added to cart', `${product.name} was added to your cart.`);
    } catch (err) {
      console.error(err);
      Alert.alert(
        'Could not add to cart',
        'Please make sure you are signed in and try again.',
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.message}>Loading LIBWAY SHOP…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LIBWAY SHOP</Text>
      <Text style={styles.subtitle}>Imported goods for everyday life</Text>

      <Link href="./login" style={styles.signIn}>
        Sign in to your account
      </Link>
      <Link href="./cart" style={styles.signIn}>
        View Cart
      </Link>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{
                uri: `https://import-shop.vercel.app/${item.image}`,
              }}
              style={styles.image}
              resizeMode="contain"
            />

            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.name}>{item.name}</Text>

            <Text style={styles.price}>
              ₦{item.price.toLocaleString('en-NG')}
            </Text>

          <Button
  title="Add to Cart"
  onPress={() => handleAddToCart(item)}
/>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: 10,
  },
  error: {
    color: 'red',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 8,
    color: '#666',
  },
  signIn: {
    marginBottom: 12,
  },
  list: {
    paddingBottom: 30,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    width: '48%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: 130,
    borderRadius: 8,
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    color: '#666',
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 3,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    marginVertical: 8,
  },
});
