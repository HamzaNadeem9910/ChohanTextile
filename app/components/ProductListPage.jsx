import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, Dimensions, Image,
  ScrollView, TouchableOpacity, Modal, Pressable, ActivityIndicator, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const DB_URL = 'https://chohan-textile-default-rtdb.firebaseio.com/products.json';

const ProductCard = ({ item, onAddToCart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    startAutoScroll();
    return () => clearInterval(timerRef.current);
  }, [currentIndex]);

  const startAutoScroll = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const next = (currentIndex + 1) % item.images.length;
      scrollRef.current?.scrollTo({ x: next * CARD_WIDTH, animated: true });
      setCurrentIndex(next);
    }, 3000);
  };

  const handleScroll = (e) => {
    const slide = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
    setCurrentIndex(slide);
  };

  return (
    <Link href={`/product/${item.id}`} asChild>
      <TouchableOpacity style={styles.card} activeOpacity={0.9}>
        <TouchableOpacity style={styles.cartIcon} onPress={() => onAddToCart(item)}>
          <Icon name="cart-outline" size={22} color="#555" />
        </TouchableOpacity>

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {item.images.map((img, i) => (
            <Image key={i} source={{ uri: img }} style={styles.sliderImage} resizeMode="cover" />
          ))}
        </ScrollView>

        <View style={styles.dotsContainer}>
          {item.images.map((_, idx) => (
            <View key={idx} style={[styles.dot, idx === currentIndex && styles.activeDot]} />
          ))}
        </View>

        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.price}>Rs {item.price}</Text>
      </TouchableOpacity>
    </Link>
  );
};

export default function ProductListPage({ selectedPrice, selectedCategory,searchQuery  }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const openModal = (product) => {
    setSelectedProduct(product);
    setSelectedSize(null);
    setQty(1);
    setModalVisible(true);
  };

  const confirmAdd = async () => {
    if (!selectedSize) return;

    const payload = {
      title: selectedProduct.name,
      price: selectedProduct.price,
      quantity: qty,
      size: selectedSize,
      image: selectedProduct.images[0],
      productId: selectedProduct.id,
    };

    try {
      await fetch(`https://chohan-textile-default-rtdb.firebaseio.com/cart/user123.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      Alert.alert('Added to cart');
      setCartCount(cartCount + qty);
      setModalVisible(false);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const filterProducts = (data) => {
  return Object.values(data).filter(product => {
    let priceMatch = true;
    let categoryMatch = true;
    let searchMatch = true;

    if (selectedPrice === 'Under 2000') priceMatch = product.price < 2000;
    else if (selectedPrice === '2000–5000') priceMatch = product.price >= 2000 && product.price <= 5000;
    else if (selectedPrice === 'Above 5000') priceMatch = product.price > 5000;

    if (selectedCategory) categoryMatch = product.category === selectedCategory;

    if (searchQuery) {
      const name = product.name?.toLowerCase() || '';
      searchMatch = name.includes(searchQuery.toLowerCase());
    }

    return priceMatch && categoryMatch && searchMatch;
  });
};


  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(DB_URL);
      const data = await res.json();
      const filtered = filterProducts(data || {});
      const loadedProducts = filtered.map((product, index) => ({
        id: Object.keys(data)[index],
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        description: product.description,
        images: Array.isArray(product.images) ? product.images : [],
        category: product.category,
      }));

      setProducts(loadedProducts);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedPrice, selectedCategory,searchQuery]);

  let heading = 'New Arrivals';
if (searchQuery) {
  heading = `Search Results for "${searchQuery}"`;
} else if (selectedPrice && selectedCategory) {
  heading = `${selectedCategory} Products ${selectedPrice}`;
} else if (selectedPrice) {
  heading = `Products ${selectedPrice}`;
} else if (selectedCategory) {
  heading = `${selectedCategory} Products`;
}

  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>{heading}</Text>

      {loading ? (
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <ProductCard item={item} onAddToCart={openModal} />
          )}
          numColumns={2}
          columnWrapperStyle={styles.row}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>
              No products found.
            </Text>
          }
        />
      )}

      {/* Add to Cart Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select Size & Quantity</Text>

            <View style={styles.sizesRow}>
              {['S', 'M', 'L', 'XL'].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[styles.sizeButton, selectedSize === size && styles.sizeButtonActive]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text style={[styles.sizeText, selectedSize === size && styles.sizeTextActive]}>{size}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.qtyContainer}>
              <Text style={styles.qtyLabel}>Qty:</Text>
              <TouchableOpacity onPress={() => setQty((q) => Math.max(1, q - 1))} style={styles.qBtn}>
                <Text style={styles.qtyBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyCount}>{qty}</Text>
              <TouchableOpacity onPress={() => setQty((q) => q + 1)} style={styles.qBtn}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.confirmBtn} onPress={confirmAdd}>
              <Text style={styles.confirmText}>Add to Cart ({cartCount})</Text>
            </TouchableOpacity>

            <Pressable onPress={() => setModalVisible(false)} style={styles.closeBtn}>
              <Text>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { padding: 16 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 25, textAlign: 'center' },
  row: { justifyContent: 'space-between', marginBottom: 16 },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  sliderImage: { width: CARD_WIDTH, height: CARD_WIDTH },
  cartIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#bbb', margin: 4 },
  activeDot: { backgroundColor: '#000' },
  title: { fontSize: 15, fontWeight: '600', paddingHorizontal: 8 },
  price: { fontSize: 13, color: '#888', paddingBottom: 10, paddingHorizontal: 8 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalBox: { backgroundColor: '#fff', borderRadius: 10, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  sizesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  sizeButton: {
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#888',
  },
  sizeButtonActive: { backgroundColor: '#000', borderColor: '#000' },
  sizeText: { color: '#000' },
  sizeTextActive: { color: '#fff' },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  qtyLabel: { marginRight: 8 },
  qBtn: { backgroundColor: '#eee', padding: 8, borderRadius: 4 },
  qtyBtnText: { fontSize: 18, fontWeight: 'bold' },
  qtyCount: { marginHorizontal: 12, fontSize: 16 },
  confirmBtn: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  confirmText: { color: '#fff', fontWeight: 'bold' },
  closeBtn: { marginTop: 10, alignItems: 'center' },
});
