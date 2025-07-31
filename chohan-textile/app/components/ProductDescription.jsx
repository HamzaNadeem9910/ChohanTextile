// pages/product/[id].js
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

export default function ProductDescription() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState('S');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `https://chohan-textile-default-rtdb.firebaseio.com/products/${id}.json`
        );
        const data = await res.json();
        setProduct(data);
        if (data?.images?.length) {
          setSelectedImage({ uri: data.images[0] });
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [id]);

  const incrementQty = () => setQuantity((prev) => prev + 1);
  const decrementQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (!product) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  const addToCart = async () => {
  const payload = {
    title: product.name,
    price: product.price,
    quantity,
    image: product.images[0],
    productId: id,
  };

  await fetch(`https://chohan-textile-default-rtdb.firebaseio.com/cart/user123.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  Alert.alert('Added to cart');
};


  return (
    <ScrollView style={styles.container}>
      <Image source={selectedImage} style={styles.mainImage} />

      <View style={styles.thumbnailContainer}>
        {product.images?.map((img, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedImage({ uri: img })}
          >
            <Image source={{ uri: img }} style={styles.thumbnail} />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>Rs. {product.price}</Text>
      <Text style={styles.freeDelivery}>
        Free delivery on orders above Rs. 4999
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Size</Text>
        <View style={styles.sizeContainer}>
          {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
            <TouchableOpacity
              key={size}
              style={[styles.sizeButton, selectedSize === size && styles.selectedSize]}
              onPress={() => setSelectedSize(size)}
            >
              <Text
                style={[styles.sizeText, selectedSize === size && styles.selectedSizeText]}
              >
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quantity</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={decrementQty} style={styles.qtyButton}>
            <Text style={styles.qtyText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyCount}>{quantity}</Text>
          <TouchableOpacity onPress={incrementQty} style={styles.qtyButton}>
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.addToCartBtn}>
        <Text style={styles.addToCartText} onPress={addToCart} >Add to Cart</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.detail}>{product.description}</Text>
        <Text style={styles.detail}><Text style={styles.bold}>Quantity:</Text> {product.quantity}</Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  mainImage: { width: '100%', height: 400, borderRadius: 10, resizeMode: 'cover' },
  thumbnailContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10, gap: 10 },
  thumbnail: { width: 70, height: 100, marginHorizontal: 4, borderRadius: 6, borderWidth: 2, borderColor: '#ddd' },
  title: { fontSize: 18, fontWeight: '600', marginVertical: 10 },
  price: { fontSize: 18, color: '#333', fontWeight: 'bold' },
  freeDelivery: { fontSize: 13, color: 'green', marginTop: 4, marginBottom: 10 },
  section: { marginVertical: 10 },
  sectionTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 6 },
  sizeContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sizeButton: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#aaa', borderRadius: 20 },
  selectedSize: { backgroundColor: '#000' },
  sizeText: { fontSize: 14, color: '#000' },
  selectedSizeText: { color: '#fff' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center' },
  qtyButton: { backgroundColor: '#eee', padding: 8, borderRadius: 4, marginHorizontal: 8 },
  qtyText: { fontSize: 18, fontWeight: 'bold' },
  qtyCount: { fontSize: 16, minWidth: 30, textAlign: 'center' },
  addToCartBtn: { backgroundColor: '#000', paddingVertical: 12, marginTop: 16, borderRadius: 6, alignItems: 'center' },
  addToCartText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  detail: { fontSize: 14, marginBottom: 4, color: '#555' },
  bold: { fontWeight: 'bold' },
});
