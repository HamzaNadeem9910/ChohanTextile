import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import Header from './components/Header';
import Home from './components/Home';
import ProductListPage from './components/ProductListPage';
import Footer from './components/Footer';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Header setSearchQuery={setSearchQuery} />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.container}>
          <Home />

          {/* Category Circles */}
          <View style={styles.categoryRow}>
            <TouchableOpacity
              style={styles.circle}
              onPress={() => setSelectedCategory('Stitched')}
            >
              <Image
                source={require('../assets/images/stitched.jpeg')}
                style={styles.circleImage}
              />
              <Text style={styles.circleLabel}>Stitched</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.circle}
              onPress={() => setSelectedCategory('Unstitched')}
            >
              <Image
                source={require('../assets/images/unstitched.jpeg')}
                style={styles.circleImage}
              />
              <Text style={styles.circleLabel}>Unstitched</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Button */}
          <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilter(true)}>
            <Ionicons name="filter" size={20} color="white" />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>

          <ProductListPage
            selectedPrice={selectedPrice}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
          />

          <Footer />
        </View>
      </ScrollView>

      {/* Filter Modal */}
      <Modal visible={showFilter} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Filter by Price</Text>
            {['Under 2000', '2000–5000', 'Above 5000'].map((price, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.modalOption,
                  selectedPrice === price && styles.selectedOption,
                ]}
                onPress={() => setSelectedPrice(price)}
              >
                <Text
                  style={
                    selectedPrice === price
                      ? styles.selectedOptionText
                      : styles.modalOptionText
                  }
                >
                  {price}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowFilter(false)}>
              <Text style={styles.closeBtn}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 130,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 7,
  },
  circle: {
    alignItems: 'center',
  },
  circleImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  circleLabel: {
    marginTop: 5,
    fontWeight: '600',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 12,
    marginHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
  filterText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalOption: {
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: '#000',
  },
  modalOptionText: {
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeBtn: {
    textAlign: 'center',
    color: '#007BFF',
    marginTop: 10,
    fontWeight: '600',
  },
});
