import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Link } from 'expo-router';
import {
  getCart,
  CartItem,
  updateCartQuantity,
} from '../data/cart';import { getProducts, Product } from '../data/products';

type CartRow = CartItem & {
  product?: Product;
};

export default function CartScreen() {
  const [items, setItems] = useState<CartRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadCart() {
    try {
      setLoading(true);

      const [cartItems, products] = await Promise.all([
        getCart(),
        getProducts(),
      ]);

      const rows = cartItems.map((item) => ({
        ...item,
        product: products.find(
          (product) => product.id === item.product_id,
        ),
      }));

      setItems(rows);
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Could not load cart',
        'Please make sure you are signed in and try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);
  async function changeQuantity(productId: string, quantity: number) {
    try {
      await updateCartQuantity(productId, quantity);
      await loadCart();
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Could not update quantity',
        'Please try again.',
      );
    }
  }

  const total = items.reduce(
    (sum, item) =>
      sum + (item.product?.price ?? 0) * item.quantity,
    0,
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.message}>Loading your cart…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>

      {items.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.empty}>Your cart is empty.</Text>

          <Link href="/" asChild>
            <Button title="Continue Shopping" />
          </Link>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.product_id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.name}>
                  {item.product?.name ?? item.product_id}
                </Text>

               <View style={styles.quantityRow}>
 <Text
  style={styles.quantityButton}
  onPress={() =>
    changeQuantity(item.product_id, item.quantity - 1)
  }
>
  −
</Text>
  <Text style={styles.quantity}>
    Quantity: {item.quantity}
  </Text>

  <Button
    title="+"
    onPress={() =>
      changeQuantity(item.product_id, item.quantity + 1)
    }
  />
</View>

                <Text style={styles.price}>
                  ₦
                  {(
                    (item.product?.price ?? 0) * item.quantity
                  ).toLocaleString('en-NG')}
                </Text>
              </View>
            )}
          />

          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Total</Text>

            <Text style={styles.total}>
              ₦{total.toLocaleString('en-NG')}
            </Text>
          </View>

          <Link href="/" asChild>
            <Button title="Continue Shopping" />
          </Link>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
  },
  empty: {
    fontSize: 18,
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 12,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
  },
  quantityRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 8,
},
quantityButton: {
  fontSize: 28,
  fontWeight: '700',
  paddingHorizontal: 14,
  paddingVertical: 4,
},
  quantity: {
    fontSize: 15,
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalBox: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
  },
  total: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
  },
});
