import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from './components/Header';
import Footer from './components/Footer';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const USER_ID = "user123"; 
  const FIREBASE_CART_URL = `https://chohan-textile-default-rtdb.firebaseio.com/cart/${USER_ID}`;

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`${FIREBASE_CART_URL}.json`);
        const data = await res.json();
        if (data) {
          const cartArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setCart(cartArray);
        } else {
          setCart([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();
  }, []);

  const updateQty = async (id, type) => {
    const item = cart.find(c => c.id === id);
    if (!item) return;

    const updatedQty = type === 'inc' ? item.quantity + 1 : item.quantity - 1;

    if (updatedQty === 0) {
      try {
        await fetch(`${FIREBASE_CART_URL}/${id}.json`, {
          method: 'DELETE',
        });
        setCart(prev => prev.filter(c => c.id !== id));
      } catch (error) {
        console.error("Failed to delete item:", error);
      }
      return;
    }

    try {
      await fetch(`${FIREBASE_CART_URL}/${id}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: updatedQty }),
      });

      setCart(prev =>
        prev.map(c => c.id === id ? { ...c, quantity: updatedQty } : c)
      );
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const removeItem = async (id) => {
    try {
      await fetch(`${FIREBASE_CART_URL}/${id}.json`, {
        method: 'DELETE',
      });
      setCart(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return <ActivityIndicator size="large" color="#000" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <View style={{ flex: 1, paddingTop: 140 }}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Shopping cart</Text>

        {cart.map(item => (
          <View key={item.id} style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.itemDetails}>
              <View style={styles.rowBetween}>
                <Text style={styles.title}>{item.title}</Text>
                <TouchableOpacity onPress={() => removeItem(item.id)}>
                  <Text style={{ fontSize: 16, color: 'red' }}>🗑️</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.price}>Rs. {item.price}</Text>

              <View style={styles.qtyRow}>
                <TouchableOpacity onPress={() => updateQty(item.id, 'dec')} style={styles.qtyBtn}>
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQty(item.id, 'inc')} style={styles.qtyBtn}>
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.itemTotal}>Total: Rs. {item.price * item.quantity}</Text>
            </View>
          </View>
        ))}

        <View style={styles.subtotalContainer}>
          <Text style={styles.subtotalText}>Subtotal</Text>
          <Text style={styles.subtotalAmount}>Rs. {subtotal}</Text>
          <Text style={styles.shippingNote}>
            Taxes, discounts and shipping calculated at checkout.
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
          <Text style={styles.buttonText}>Continue shopping</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#000' }]}
          onPress={() => router.push({ pathname: '/Checkout', params: { cart: JSON.stringify(cart) } })} >
          <Text style={[styles.buttonText, { color: '#fff' }]}>Check out</Text>
        </TouchableOpacity>

        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Order Notes</Text>
          <TextInput
            placeholder="Please leave special instructions above"
            placeholderTextColor='black'
            value={note}
            onChangeText={setNote}
            style={styles.notesInput}
            multiline
          />
        </View>

        <Footer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    alignSelf: 'center',
    marginTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 12,
  },
  productImage: {
    width: 90,
    height: 110,
    resizeMode: 'cover',
    borderRadius: 6,
  },
  itemDetails: {
    marginLeft: 12,
    flex: 1,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    color: '#444',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  qtyBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#888',
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  qtyText: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  itemTotal: {
    marginTop: 6,
    fontWeight: 'bold',
  },
  subtotalContainer: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  subtotalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtotalAmount: {
    fontSize: 18,
    marginBottom: 4,
  },
  shippingNote: {
    fontSize: 12,
    color: '#777',
  },
  button: {
    padding: 14,
    backgroundColor: '#ddd',
    borderRadius: 6,
    marginTop: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
  },
  notesContainer: {
    marginTop: 24,
    marginBottom: 25,
  },
  notesLabel: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    minHeight: 80,
  },
});
