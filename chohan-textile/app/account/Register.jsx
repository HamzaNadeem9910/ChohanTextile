// /app/auth/register.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
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

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
  if (form.password !== form.confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  try {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAm8J4uH1GCiBkbFgHWWle7p5lcMryRegQ',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert('Registered successfully!');
      router.push('/account/Login');
    } else {
      // Firebase error messages
      alert(data.error?.message || 'Registration failed');
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
            <Text style={styles.header}>Register</Text>

            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="#aaa"
              value={form.firstName}
              onChangeText={text => handleChange('firstName', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor="#aaa"
              value={form.lastName}
              onChangeText={text => handleChange('lastName', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              value={form.email}
              onChangeText={text => handleChange('email', text)}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.inputFlex}
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry={!showPassword}
                value={form.password}
                onChangeText={text => handleChange('password', text)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.toggle}>{showPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.inputFlex}
                placeholder="Confirm Password"
                placeholderTextColor="#aaa"
                secureTextEntry={!showConfirm}
                value={form.confirmPassword}
                onChangeText={text => handleChange('confirmPassword', text)}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <Text style={styles.toggle}>{showConfirm ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/account/Login')}>
              <Text style={styles.link}>Already have an account? Login</Text>
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
    paddingTop:150,
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
  forgot: {
    color: '#007BFF',
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  footerWrapper: {
    marginTop: 40,
  },
});
