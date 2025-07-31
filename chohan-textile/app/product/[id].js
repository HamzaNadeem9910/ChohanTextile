import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ProductDescription from '../components/ProductDescription';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ProductDetailPage() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Product Details</Text>

        <ProductDescription productId={id} />

        <View style={styles.footerWrapper}>
          <Footer />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 140, 
  },
  scrollContainer: {
    paddingBottom: 60, 
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    marginTop:30
  },
  footerWrapper: {
    marginTop: 40,
  },
});
