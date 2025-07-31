import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,
  SafeAreaView, Alert, Linking, Image, ActivityIndicator
} from 'react-native';

import Header from '../app/components/Header'
import Footer from '../app/components/Footer'

const USER_ID = "user123";
const CART_URL = `https://chohan-textile-default-rtdb.firebaseio.com/cart/${USER_ID}.json`;
const ORDERS_URL = `https://chohan-textile-default-rtdb.firebaseio.com/orders/${USER_ID}.json`;

const STRIPE_API = 'http://192.168.236.43:4242/create-checkout-session';

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [house, setHouse] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const res = await fetch(CART_URL);
        const data = await res.json();
        if (data) {
          const array = Object.keys(data).map(key => ({
            id: key,
            ...data[key],
          }));
          setCart(array);
        }
      } catch (e) {
        console.error("Fetch cart error:", e);
        Alert.alert("Error", "Failed to load cart");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  const handleStripeCheckout = async () => {
  if (!email || !city || !area || !house) {
    Alert.alert("Missing Info", "Please fill all fields before checkout.");
    return;
  }

  try {
    setLoading(true);

    // Prepare lightweight cart for Stripe (no image)
    const stripeCart = cart.map(item => ({
      title: item.title,
      description: item.description,
      price: item.price,
      quantity: item.quantity,
    }));

    const res = await fetch(STRIPE_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems: stripeCart, email }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Stripe backend error:", errorText);
      Alert.alert("Stripe Error", "Server error occurred.");
      return;
    }

    const data = await res.json();

    if (data.url) {
      // Save full order with address and full cart (including image)
      await fetch(ORDERS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          address: { city, area, house },
          items: cart,  // full cart with image
          total,
          date: new Date().toISOString()
        })
      });

      Linking.openURL(data.url);
    } else {
      Alert.alert("Stripe Error", "Could not get payment link.");
    }
  } catch (err) {
    console.error("Stripe checkout error:", err);
    Alert.alert("Error", "Stripe connection failed.");
  } finally {
    setLoading(false);
  }
};


  return (
    <SafeAreaView style={styles.safe}>
      <Header/>
    
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.container}>
          <Text style={styles.header}>🧾 Checkout</Text>

          {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginBottom: 15 }} />}

          {cart.map(item => (
            <View key={item.id} style={styles.item}>
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.itemDetails}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.price}>Rs {item.price} x {item.quantity}</Text>
              </View>
            </View>
          ))}

          <View style={styles.section}>
            <Text style={styles.summaryText}>Subtotal: Rs {subtotal}</Text>
            <Text style={styles.total}>Total: Rs {total}</Text>
          </View>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor='gray'
          />
          <TextInput
            placeholder="City"
            value={city}
            onChangeText={setCity}
            style={styles.input}
            placeholderTextColor='gray'
          />
          <TextInput
            placeholder="Area"
            value={area}
            onChangeText={setArea}
            style={styles.input}
            placeholderTextColor='gray'
          />
          <TextInput
            placeholder="House No"
            value={house}
            onChangeText={setHouse}
            style={styles.input}
            placeholderTextColor='gray'
          />

          <TouchableOpacity style={styles.button} onPress={handleStripeCheckout} disabled={loading}>
            <Text style={styles.buttonText}>Pay with Stripe</Text>
          </TouchableOpacity>
        </View>
              <Footer/>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  scrollContent: { paddingBottom: 100,marginTop:120 },
  container: { padding: 16, },
  header: { fontSize: 22, fontWeight: 'bold', alignSelf: 'center', marginBottom: 20 },
  loadingText: { fontSize: 14, color: 'gray', alignSelf: 'center', marginBottom: 10 },
  item: { flexDirection: 'row', marginBottom: 16 },
  image: { width: 80, height: 80, marginRight: 10, borderRadius: 6 },
  itemDetails: { flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold' },
  description: { fontSize: 12, color: '#555' },
  price: { fontSize: 14, fontWeight: '500', marginTop: 4 },
  section: { marginVertical: 20 },
  summaryText: { fontSize: 14 },
  total: { fontSize: 16, fontWeight: 'bold', marginTop: 8 },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6,
    marginTop: 10, color: '#000'
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
