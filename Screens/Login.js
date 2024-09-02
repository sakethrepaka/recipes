import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';

const Login = ({ route, navigation }) => {
  const { registeredUsers } = route.params || { registeredUsers: [] };

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (name === 'admin' && password === '123456') {
      
      navigation.navigate('AdminNavigation',{registeredUsers});
      setName('');
      setPassword('');
      setError('');
    } else {
 
      const user = registeredUsers.find(user => user.name === name && user.password === password);
      if (user) {

        navigation.navigate('Restaurant', {
          UserID: user.email,
          UserName: user.name,
          userPassword: user.password,
          DOB: user.dateOfBirth,
          profileImage: user.profileImage,
          registeredUsers
        });
        setName('');
        setPassword('');
        setError('');
      } else {
        // Login failed
        setError('Invalid name or password');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Let's Go</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  form: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 3, // Adds shadow on Android
    shadowColor: '#000', // Changes shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Changes shadow offset for iOS
    shadowOpacity: 0.25, // Changes shadow opacity for iOS
    shadowRadius: 3.84, // Changes shadow radius for iOS
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    width: '100%',
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'orange',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Login;
