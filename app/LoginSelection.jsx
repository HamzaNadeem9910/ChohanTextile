import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginSelection() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login As</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/Admin/AdminModule')}>
        <Text style={styles.buttonText}>Admin</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/account/Login')}>
        <Text style={styles.buttonText}>Customer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  heading: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 40,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#FFD700',
    padding: 16,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold'
  }
});
