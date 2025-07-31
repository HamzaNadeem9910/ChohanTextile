// app/auth/login.js
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

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const login = async () => {
  if (!email || !password) {
    alert('Please enter both fields');
    return;
  }

  try {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAm8J4uH1GCiBkbFgHWWle7p5lcMryRegQ',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert('Logged in!');
      router.push('/');
    } else {
      alert(data.error?.message || 'Login failed');
    }
  } catch (error) {
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
            <Text style={styles.header}>Login</Text>

            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              placeholderTextColor="#aaa"
            />

            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.inputFlex}
                placeholderTextColor="#aaa"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.toggle}>{showPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={login}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/account/ResetPassword')}>
              <Text style={styles.link}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/account/Register')}>
              <Text style={styles.link}>Don't have an account? Register</Text>
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
    elevation: 6,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  inputFlex: {
    flex: 1,
    paddingVertical: 10,
    color: 'white',
  },
  toggle: {
    color: '#007BFF',
    fontWeight: 'bold',
    marginLeft: 8,
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
    marginTop: 40,
  },
});
