import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { DatePickerInput } from 'react-native-paper-dates';
import { en, registerTranslation } from 'react-native-paper-dates'
import * as Linking from 'expo-linking';
import * as AuthSession from 'expo-auth-session';
import { Image, SocialIcon } from 'react-native-elements'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Icon } from 'react-native-elements'

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential } from 'firebase/auth';
import { auth } from '../firebaseConfig';

WebBrowser.maybeCompleteAuthSession();


// web 471007882125-v58brcg3bo0klotq5ntguffsrefosocm.apps.googleusercontent.com
// android 471007882125-ornuc6uh8uihmlgki8asceet0g4ljq89.apps.googleusercontent.com
// ios 471007882125-j1cbt6qvvlm8n565eo3h7ri9r54r2m87.apps.googleusercontent.com

registerTranslation('en', en)



const SignUp = ({ navigation, route }) => {
  const { params } = route;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [userInfo, setUserInfo] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '471007882125-j1cbt6qvvlm8n565eo3h7ri9r54r2m87.apps.googleusercontent.com',
    androidClientId: '471007882125-ornuc6uh8uihmlgki8asceet0g4ljq89.apps.googleusercontent.com'
  })


  useEffect(() => {


    if (response?.type === "success") {
      setIsLoading(true);
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          console.log(JSON.stringify(response));
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error signing in with Google:', error);
          setIsLoading(false);
        });
    }

    const unsubscribeAuthStateChanged = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const { displayName, email, photoURL } = user;
        const newUser = {
          name: displayName || '',
          email: email || '',
          profileImage: photoURL || '',
          password:'',
          DOB:''
        };

        setRegisteredUsers(prevUsers => [...prevUsers, newUser]);

        AsyncStorage.setItem('registeredUsers', JSON.stringify([...registeredUsers, newUser]))
          .then(() => {
            console.log('User added to registered users and stored in AsyncStorage');

            navigation.navigate('Restaurant', {
              UserID: newUser.email,
              UserName: newUser.name,
              userPassword: newUser.password,
              DOB: newUser.DOB,
              profileImage: newUser.profileImage,
              registeredUsers: [...registeredUsers, newUser]
            });
          })
          .catch(error => {
            console.error('Error storing registered users in AsyncStorage:', error);
          });
      } else {
        console.log("User is not signed in");
      }
    });


    return () => unsubscribeAuthStateChanged();
  }, [response]);



  useEffect(() => {
    if (params && params.userData) {
      setRegisteredUsers(params.userData);
    }
  }, [params]);

  useEffect(() => {
    const fetchRegisteredUsers = async () => {
      try {
        const storedUsers = await AsyncStorage.getItem('registeredUsers');
        if (storedUsers !== null) {
          setRegisteredUsers(JSON.parse(storedUsers));
        }
      } catch (error) {
        console.error('Error retrieving registered users from AsyncStorage:', error);
      }
    };

    fetchRegisteredUsers();
  }, []);

  console.log(registeredUsers, "In SignUp")

  const handleSignUp = () => {
    setErrors({});

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors(prevErrors => ({ ...prevErrors, email: 'Invalid email format' }));
      return;
    }

    if (password.length < 6) {
      setErrors(prevErrors => ({
        ...prevErrors,
        password: 'Password must be at least 6 characters long',
      }));
      return;
    }

    if (password !== confirmPassword) {
      setErrors(prevErrors => ({ ...prevErrors, confirmPassword: 'Passwords do not match' }));
      return;
    }

    if (registeredUsers.some(user => user.email === email)) {
      setErrors(prevErrors => ({ ...prevErrors, email: 'Account with this email already exists' }));
      return;
    }

    if (registeredUsers.some(user => user.name === name)) {
      setErrors(prevErrors => ({ ...prevErrors, name: 'Username already taken' }));
      return;
    }
    const isoString = dateOfBirth.toISOString();
    const formattedDate = isoString.substring(8, 10) + '-' + isoString.substring(5, 7) + '-' + isoString.substring(2, 4);
    const newUser = { name, email, password, formattedDate };
    const newUserWithSerializableDate = {
      ...newUser,
      dateOfBirth: formattedDate
    };
    setRegisteredUsers(prevUsers => [...prevUsers, newUserWithSerializableDate]);

    AsyncStorage.setItem('registeredUsers', JSON.stringify([...registeredUsers, newUserWithSerializableDate]))
      .then(() => {
        console.log('Registered user added and stored in AsyncStorage');
      })
      .catch(error => {
        console.error('Error storing registered users in AsyncStorage:', error);
      });

    navigation.navigate('Login', { registeredUsers: [...registeredUsers, newUserWithSerializableDate] });

    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrors('');
  };


  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Signing in ...</Text>
        </View>
      )}
      <View style={styles.form}>
        <Text style={styles.title}>Sign Up</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>DOB</Text>
          <View style={{ marginTop: 20, marginBottom: 20 }}>
            <DatePickerInput
              style={{ ...styles.input, backgroundColor: '#fff' }}
              locale="en"
              label=""
              withDateFormatInLabel=""
              value={dateOfBirth}
              onChange={(d) => setDateOfBirth(d)}
              inputMode="start"
              presentationStyle='pageSheet'
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="grey" style={styles.visibilityIcon} />
          </TouchableOpacity>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
        </View>
        <TouchableOpacity onPress={handleSignUp} style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <View style={{ height: 20 }} />
        <TouchableOpacity onPress={() => {
          navigation.navigate('Login', {
            registeredUsers,
          });
          setName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setErrors('');
        }} style={styles.button}>
          <Text style={styles.buttonText}>Already A User</Text>
        </TouchableOpacity>


        <View style={{ alignItems: 'center', flexDirection: 'column', justifyContent: 'center', marginTop: 15 }}>
          <Text style={{ marginBottom: 10 }}> Sign in with Google</Text>
          <TouchableOpacity style={styles.Google} onPress={() => { promptAsync() }}>
            <Image source={require('../assets/google.png')} style={[{ height: 25, width: 25 }]}></Image>
          </TouchableOpacity>
        </View>
        <View style={{ height: 20 }} />
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
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
    marginLeft: 2,
  },
  visibilityIcon: {
    position: 'absolute',
    right: 15,
    bottom: 8
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
  Google: {
    elevation: 4,
    shadowColor: "black", // Light grey shadow color
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 1, // Make the shadow fully visible
    shadowRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // White background color for elevation
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default SignUp;
