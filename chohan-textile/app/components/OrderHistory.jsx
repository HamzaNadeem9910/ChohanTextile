import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, ActivityIndicator, StyleSheet, ScrollView
} from 'react-native';
import Header from './Header';
import Footer from './Footer';

const USER_ID = "user123";
const ORDERS_URL = `https://chohan-textile-default-rtdb.firebaseio.com/orders/${USER_ID}.json`;

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(ORDERS_URL);
        const data = await response.json();

        if (data) {
          const orderArray = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value,
          }));

          setOrders(orderArray.reverse());
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderId}>Order ID: {item.id}</Text>
      <Text style={styles.label}>📧 Email:</Text>
      <Text style={styles.value}>{item.email}</Text>

      <Text style={styles.label}>🏠 Address:</Text>
      <Text style={styles.value}>
        {item.address?.house}, {item.address?.area}, {item.address?.city}
      </Text>

      <Text style={styles.label}>💰 Total:</Text>
      <Text style={[styles.value, styles.total]}>Rs {item.total}</Text>

      <Text style={[styles.label, { marginTop: 10 }]}>🛒 Items:</Text>
      {Array.isArray(item.items) && item.items.length > 0 ? (
        item.items.map((product, index) => (
          <Text key={index} style={styles.item}>
            • {product.title} × {product.quantity}
          </Text>
        ))
      ) : (
        <Text style={styles.value}>No items found</Text>
      )}
    </View>
  );

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#3b82f6" />;
  }

  return (
    <View style={styles.page}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>📚 Your Order History</Text>
        {orders.length === 0 ? (
          <Text style={styles.noOrders}>No orders found.</Text>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={item => item.id}
            renderItem={renderOrder}
          />
        )}
        <Footer />
      </ScrollView>
      
    </View>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f9fafb' },
  container: { padding: 16, paddingBottom: 80,marginTop:160},
  header: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    alignSelf: 'center',
    color: '#1f2937',
  },
  orderCard: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  orderId: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
    color: '#4b5563',
    marginTop: 6,
  },
  value: {
    color: '#1f2937',
    marginLeft: 4,
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
  },
  item: {
    marginLeft: 8,
    color: '#374151',
    marginTop: 2,
  },
  noOrders: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#9ca3af',
  },
});

export default OrderHistory;
