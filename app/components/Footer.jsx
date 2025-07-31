import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';

const Footer = () => {
  const instagramAppUrl = 'instagram://user?username=chohantextiles';

  const instagramWebUrl = 'https://instagram.com/chohantextiles';

  const openInstagram = async () => {
    try {
      const supported = await Linking.canOpenURL(instagramAppUrl);
      if (supported) {
        Linking.openURL(instagramAppUrl); 
      } else {
        Linking.openURL(instagramWebUrl); 
      }
    } catch (err) {
      console.warn('Error opening Instagram:', err);
    }
  };

  return (
    <View style={styles.footerContainer}>
      {/* Info Sections */}
      <View style={styles.infoSection}>
        {/* CUSTOMER CARE */}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>CUSTOMER CARE</Text>
          <Text style={styles.link}>Order Tracking</Text>
          <Text style={styles.link}>Shipping & Handling</Text>
          <Text style={styles.link}>Exchange Policy</Text>
          <Text style={styles.link}>Privacy Policy</Text>
          <Text style={styles.link}>FAQ's</Text>
        </View>

        {/* INFORMATION */}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>INFORMATION</Text>
          <Text style={styles.link}>About Us</Text>
          <Text style={styles.link}>Contact Us</Text>
          <Text style={styles.link}>Careers</Text>
          <Text style={styles.link}>Store Locator</Text>
          <Text style={styles.link}>Blogs</Text>
        </View>
      </View>

      {/* Social Media Icons */}
      <Text style={styles.acceptText}>Follow Us On </Text>
      <View style={styles.socialIcons}>
        <Image style={styles.icon} source={require('../../assets/images/facebook.png')} />
        <TouchableOpacity onPress={openInstagram}>
          <Image source={require('../../assets/images/instagram.png')} style={styles.icon} />
        </TouchableOpacity>
        <Image style={styles.icon} source={require('../../assets/images/tiktok.png')} />
      </View>

      {/* Payment Methods */}
      <Text style={styles.acceptText}>We Accept</Text>
      <View style={styles.paymentMethods}>
        <Image style={styles.icon} source={require('../../assets/images/credit-card.png')} />
        <Image style={styles.icon} source={require('../../assets/images/cod.png')} />
      </View>

      {/* Footer Bottom */}
      <View style={styles.copyRight}>
        <Text style={styles.copyText}>© 2025, ChohanTextilepk | Powered By Hamza</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ccc',
    width: '100%',
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  column: {
    flex: 1,
    paddingHorizontal: 10,
  },
  columnTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#222',
  },
  link: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  icon: {
    width: 30,
    height: 30,
    marginHorizontal: 8,
  },
  acceptText: {
    fontSize: 15,
    fontWeight: '600',
    marginVertical: 15,
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  copyRight: {
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 10,
  },
  copyText: {
    fontSize: 12,
    color: '#888',
  },
});

export default Footer;
