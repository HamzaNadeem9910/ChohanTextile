// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, Image, ScrollView, Alert, StyleSheet } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { uploadImageToGoogleDrive } from '../utils/GoogleDriveUploader';

// const DB_URL = 'https://chohan-textile-default-rtdb.firebaseio.com//products.json'; // 🔴 Replace with your real Firebase URL
// const ACCESS_TOKEN = 'your-valid-oauth-token'; // 🔴 Replace with valid token

// export default function ManageProducts() {
//   const [product, setProduct] = useState({
//     name: '',
//     description: '',
//     price: '',
//     quantity: '',
//     images: [],
//   });

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaType.All,
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.cancelled) {
//       setProduct((prev) => ({
//         ...prev,
//         images: [...prev.images, result.assets[0]],
//       }));
//     }
//   };

//   const handleAddProduct = async () => {
//     try {
//       const imageUrls = [];

//       for (const img of product.images) {
//         const url = await uploadImageToGoogleDrive(img.uri, `${Date.now()}.jpg`, 'image/jpeg', ACCESS_TOKEN);
//         imageUrls.push(url);
//       }

//       const newProduct = {
//         name: product.name,
//         description: product.description,
//         price: product.price,
//         quantity: product.quantity,
//         images: imageUrls,
//       };

//       const res = await fetch(DB_URL, {
//         method: 'POST',
//         body: JSON.stringify(newProduct),
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (res.ok) {
//         Alert.alert('Success', 'Product added successfully');
//         setProduct({
//           name: '',
//           description: '',
//           price: '',
//           quantity: '',
//           images: [],
//         });
//       } else {
//         throw new Error('Failed to add product');
//       }
//     } catch (e) {
//       console.error(e);
//       Alert.alert('Error', e.message);
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Add Product</Text>

//       <TextInput placeholder="Name" value={product.name} onChangeText={(text) => setProduct({ ...product, name: text })} style={styles.input} />
//       <TextInput placeholder="Description" value={product.description} onChangeText={(text) => setProduct({ ...product, description: text })} style={styles.input} />
//       <TextInput placeholder="Price" value={product.price} onChangeText={(text) => setProduct({ ...product, price: text })} style={styles.input} keyboardType="numeric" />
//       <TextInput placeholder="Quantity" value={product.quantity} onChangeText={(text) => setProduct({ ...product, quantity: text })} style={styles.input} keyboardType="numeric" />

//       <Button title="Pick Image" onPress={pickImage} />

//       <View style={styles.imagePreview}>
//         {product.images.map((img, idx) => (
//           img.uri ? <Image key={idx} source={{ uri: img.uri }} style={styles.image} /> : null
//         ))}
//       </View>

//       <Button title="Add Product" onPress={handleAddProduct} />
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { padding: 20 },
//   title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
//   input: { borderWidth: 1, marginVertical: 5, padding: 10, borderRadius: 8 },
//   imagePreview: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
//   image: { width: 80, height: 80, margin: 5 },
// });
