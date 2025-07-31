import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Linking } from 'react-native';


function Header({setSearchQuery}) {
  const cartItemCount = 2; 
const router = useRouter();
const pathname = usePathname();

  const handleIconPress = (icon) => {
    
    if (icon === 'cart') {
      router.push('/Cart'); 
    } else if (icon === 'account') {
      router.push('/LoginSelection');
    } else if (icon === 'checkout') {
      router.push('/Checkout');
    }else if(icon==='home'){
      router.push('/')
    }else if(icon === 'phone'){
      Linking.openURL('tel:03001234567');
    }else if (icon === 'order') {
      router.push('/components/OrderHistory');
    }
  };



  return (
    <View style={styles.headerWrapper}>
      {/* Top Header */}
      <View style={styles.headerContainer}>
        <Image
          style={styles.logo}
          source={require('../../assets/images/logo.jpg')}
        />
        <Text style={styles.name}>Chohan Textile</Text>

        <TouchableOpacity onPress={() => handleIconPress('cart')}>
          <View style={styles.cartContainer}>
            <Image
              style={styles.cart}
              source={require('../../assets/images/cart.png')}
            />
            {cartItemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Bottom Header */}
      <View style={styles.headerDownContainer}>
        <TouchableOpacity onPress={() => handleIconPress('home')}>
          <Image
            style={styles.logodown}
            source={require('../../assets/images/home.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleIconPress('phone')}>
          <Image
            style={styles.logodown}
            source={require('../../assets/images/tel.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleIconPress('order')}>
          <Image
            style={styles.logodown}
            source={require('../../assets/images/order.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleIconPress('account')}>
          <Image
            style={styles.logodown}
            source={require('../../assets/images/account.png')}
          />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Search"
          placeholderTextColor="#777"
          onChangeText={(text) => setSearchQuery(text)}
        />

        <TouchableOpacity onPress={() => handleIconPress('checkout')}>
          <Text style={styles.text}>CHECKOUT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 10,
    paddingTop:20,
    backgroundColor: '#000',
    
    
  },
  headerContainer: {
   
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
    borderRadius: 30,
  },
  cartContainer: {
    position: 'relative',
  },
  cart: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  name: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  headerDownContainer: {
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 5,
  },
  logodown: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginHorizontal: 4,
  },
input: {
  backgroundColor: '#fff',
  width: 120,
  height: 15,
  paddingHorizontal: 12,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: '#ccc',
  fontSize: 10,
  color: '#000',
  
},
  text: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 10,
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000',
  },
});

export default Header;
