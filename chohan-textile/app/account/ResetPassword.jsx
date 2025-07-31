import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ResetPassword() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');

  const reset = async () => {
  if (!identifier) {
    alert('Please enter your email');
    return;
  }

  try {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyAm8J4uH1GCiBkbFgHWWle7p5lcMryRegQ',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestType: 'PASSWORD_RESET',
          email: identifier,
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      alert(`Error: ${data.error.message}`);
    } else {
      alert('✅ Reset link sent to your email!');
      router.push('/account/Login');
    }
  } catch (error) {
    console.error(error);
    alert('Something went wrong. Please try again.');
  }
};


  return (
    <ImageBackground
      source={require('../../assets/images/back.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <View style={styles.formCard}>
            <Text style={styles.header}>Reset Password</Text>

            <TextInput
              placeholder="Enter email or phone"
              value={identifier}
              onChangeText={setIdentifier}
              style={styles.input}
              placeholderTextColor="#aaa"
            />

            <TouchableOpacity style={styles.button} onPress={reset}>
              <Text style={styles.buttonText}>Send Reset Link</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/account/Login')}>
              <Text style={styles.link}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        <View style={styles.footerWrapper}>
          <Footer />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    paddingTop: 150,
  },
  scrollContainer: {
    paddingTop: 40,
  },
  keyboardView: {
    flex: 1,
    alignItems: 'center',
  },
  formCard: {
    width: '90%',
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'transparent',
  },
  input: {
    backgroundColor: 'transparent',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    color: 'white',
  },
  button: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: 'white',
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '600',
  },
  footerWrapper: {
    marginTop: 90,
  },
});
