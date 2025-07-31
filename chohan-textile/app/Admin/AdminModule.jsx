import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const DB_URL = "https://chohan-textile-default-rtdb.firebaseio.com/products";
const AUTH_PARAM = "?auth=AIzaSyAm8J4uH1GCiBkbFgHWWle7p5lcMryRegQ";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function AdminModule() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", quantity: "", category: "Stitched", images: [] });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false); // Loader state

  useEffect(() => {
    if (isLoggedIn) fetchProducts();
  }, [isLoggedIn]);

  const RadioButtonGroup = ({ options, selectedOption, onSelect }) => (
    <View style={styles.radioGroup}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={styles.radioButtonContainer}
          onPress={() => onSelect(option)}
        >
          <View style={styles.outerCircle}>
            {selectedOption === option && <View style={styles.innerCircle} />}
          </View>
          <Text style={styles.optionLabel}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${DB_URL}.json${AUTH_PARAM}`);
      const data = await res.json();
      setProducts(data ? Object.entries(data).map(([id, p]) => ({ id, ...p })) : []);
    } catch (e) {
      Alert.alert("Error", "Failed to load products.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    if (username === "admin" && password === "admin") {
      setIsLoggedIn(true);
    } else {
      Alert.alert("Invalid credentials");
    }
  };

  const handleAddProduct = () => {
    if (!form.name || !form.description || !form.price || !form.quantity) {
      return Alert.alert("Please fill all fields");
    }
    isEditing ? updateProduct() : createProduct();
  };

  const createProduct = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${DB_URL}.json${AUTH_PARAM}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to add product");
      resetForm();
      fetchProducts();
    } catch (e) {
      Alert.alert("Error", e.message);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async () => {
    if (!form.id) return Alert.alert("Error", "Invalid product ID for update");
    const { id, ...updatedData } = form;
    try {
      setLoading(true);
      const res = await fetch(`${DB_URL}/${id}.json${AUTH_PARAM}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Failed to update product");
      resetForm();
      fetchProducts();
    } catch (e) {
      Alert.alert("Error", e.message);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return Alert.alert("Error", "Invalid product ID");

    Alert.alert("Confirm Delete", "Are you sure you want to delete this product?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            const res = await fetch(`${DB_URL}/${id}.json${AUTH_PARAM}`, {
              method: "DELETE",
            });
            if (!res.ok) throw new Error("Delete failed");
            fetchProducts();
          } catch (e) {
            Alert.alert("Error", e.message);
            console.error(e);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const resetForm = () => {
    setForm({ name: "", description: "", price: "", quantity: "", category: "Stitched", images: [] });
    setIsEditing(false);
    setShowForm(false);
  };

  const handleUpdate = (item) => {
    setForm(item);
    setIsEditing(true);
    setShowForm(true);
  };

  const pickImage = async (idx) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return Alert.alert("Permission denied");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const uri = result.assets[0].uri;
      const updatedImages = [...form.images];
      updatedImages[idx] = uri;
      setForm({ ...form, images: updatedImages });
    }
  };

  const removeImage = (idx) => {
    const updatedImages = [...form.images];
    updatedImages.splice(idx, 1);
    setForm({ ...form, images: updatedImages });
  };

  const renderItem = ({ item }) => (
    <View style={styles.productCard}>
      <Text style={styles.title}>{item.name}</Text>
      <Text>Rs : {item.price} | Qty : {item.quantity} | Category : {item.category}</Text>
      <Text>{item.description}</Text>
      <ScrollView horizontal style={{ marginVertical: 8 }}>
        {item.images?.map((uri, i) => (
          <Image key={i} source={{ uri }} style={styles.imageSmall} />
        ))}
      </ScrollView>
      <View style={styles.btnRow}>
        <Button title="Edit" onPress={() => handleUpdate(item)} />
        <Button title="Delete" color="red" onPress={() => handleDelete(item.id)} />
      </View>
    </View>
  );

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Admin Login</Text>
        <TextInput placeholder="admin" placeholderTextColor='black' value={username} onChangeText={setUsername} style={styles.input} autoCapitalize="none" />
        <TextInput placeholder="admin" placeholderTextColor='black' value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
        <Button title="Login" onPress={handleLogin}  />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Product Management</Text>
      <Button title={showForm ? "Cancel" : isEditing ? "Edit Product" : "Add Product"} onPress={() => setShowForm(!showForm)} />
      {showForm && (
        <View style={styles.form}>
          {["name", "description", "price", "quantity"].map((f) => (
            <TextInput
              key={f}
              placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
              placeholderTextColor='black'
              value={form[f]}
              onChangeText={(txt) => setForm({ ...form, [f]: txt })}
              keyboardType={["price", "quantity"].includes(f) ? "numeric" : "default"}
              style={styles.input}
            />
          ))}
          <Text style={{ marginTop: 10 }}>Images:</Text>
          <ScrollView horizontal style={{ marginVertical: 10 }}>
            {[0, 1, 2].map((i) => (
              <TouchableOpacity key={i} onPress={() => pickImage(i)} onLongPress={() => removeImage(i)} style={styles.imageBox}>
                {form.images[i] ? (
                  <Image source={{ uri: form.images[i] }} style={styles.fullImage} />
                ) : (
                  <Text style={{ textAlign: "center" }}>Pick {i + 1}</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={{ marginTop: 10, marginBottom: 4 }}>Select Category:</Text>
          <RadioButtonGroup
            options={["Stitched", "Unstitched"]}
            selectedOption={form.category}
            onSelect={(selected) => setForm({ ...form, category: selected })}
          />
          <Button title={isEditing ? "Update" : "Add"} onPress={handleAddProduct} />
        </View>
      )}
      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}
      <FlatList
        data={products}
        keyExtractor={(i) => i.id?.toString() || Math.random().toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", padding: 10, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "bold", marginVertical: 12,marginTop:60 },
  input: { width: SCREEN_WIDTH * 0.9, borderWidth: 1, padding: 8, borderRadius: 6, marginVertical: 6 },
  form: { width: SCREEN_WIDTH * 0.95, padding: 12, backgroundColor: "#f0f0f0", borderRadius: 8, marginVertical: 12 },
  productCard: { width: SCREEN_WIDTH * 0.95, backgroundColor: "#eef", padding: 15, borderRadius: 8, marginVertical: 8 },
  title: { fontSize: 18, fontWeight: "bold" },
  btnRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  imageSmall: { width: 80, height: 80, borderRadius: 6, marginRight: 6 },
  imageBox: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.6,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  fullImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  radioGroup: {
    flexDirection: "row",
    marginBottom: 10,
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  outerCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#555",
    justifyContent: "center",
    alignItems: "center",
  },
  innerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#555",
  },
  optionLabel: {
    marginLeft: 8,
    fontSize: 14,
  },
});
