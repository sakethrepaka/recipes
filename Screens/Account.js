import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, Pressable, Modal, Button, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NotificationContext } from '../NotificationContext';
import { TabView, TabBar } from 'react-native-tab-view';

const url = require('../assets/bg.jpeg')
const image = require('../assets/profile.png')
const profilePhotoUri = Image.resolveAssetSource(image).uri;

const FirstRoute = () => {

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = () => {
    if (passwordError) {
      Alert.alert('Error', 'New password does not meet the requirements.');
      return;
    }

    const userIndex = registeredUsers.findIndex(user => user.name === UserName);

    if (userIndex !== -1 && registeredUsers[userIndex].password === currentPassword) {
      if (newPassword === confirmPassword) {
        registeredUsers[userIndex].password = newPassword;

        AsyncStorage.setItem('registeredUsers', JSON.stringify(registeredUsers))
          .then(() => {
            console.log('Registered users updated in AsyncStorage');
          })
          .catch(error => {
            console.error('Error updating registered users in AsyncStorage:', error);
          });
        Alert.alert('Success', 'Password updated successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordStrength('')
      } else {
        Alert.alert('Error', 'New password and confirm password do not match.');
      }
    } else {
      Alert.alert('Error', 'Incorrect current password.');
    }
  };

  const handleNewPasswordChange = (password) => {
    setNewPassword(password);
    if (password.length >= 6) {
      setPasswordStrength('Strong');
      setPasswordError('');
    } else {
      setPasswordStrength('');
      setPasswordError('Password must be at least 6 characters long.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', padding: 20 }}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Current Password:</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Current Password"
            secureTextEntry={!showCurrentPassword}
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>New Password:</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="New Password"
            secureTextEntry={!showNewPassword}
            value={newPassword}
            onChangeText={handleNewPasswordChange} advanced concepts
          />
          <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
            <MaterialIcons name={showNewPassword ? 'visibility' : 'visibility-off'} size={24} color="grey" style={styles.visibilityIcon} />
          </TouchableOpacity>
        </View>
        {passwordStrength ? <Text style={styles.passwordStrength}>{passwordStrength}</Text> : null}
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm Password:</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.changePasswordButton} onPress={handlePasswordChange}>
        <Text style={styles.changePasswordButtonText}>Change Password</Text>
      </TouchableOpacity>
    </View>
  )
};

const SecondRoute = ({ DOB }) => (
  <View style={{ flex: 1, backgroundColor: '#fff' }}>
    <Text style={{
      fontSize: 15, marginTop: 20,marginLeft:20, fontWeight: 'bold',
    }}>Date Of Birth: {DOB}</Text>
  </View>
);



const Account = ({ routeParams }) => {
  const { UserID, UserPassword, registeredUsers, UserName, DOB, profileImage } = routeParams;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(routeParams?.registeredUsers?.find(user => user.email === routeParams?.UserID)?.profileImage || profilePhotoUri);



  const [index, setIndex] = useState(0);


  const routes = [
    { key: 'first', title: 'Security' },
    { key: 'second', title: 'Details', DOB: DOB },
  ];

  const renderScene = ({ route }) => {

    switch (route.key) {
      case 'first':
        return <FirstRoute DOB={route.DOB} />;
      case 'second':
        return <SecondRoute DOB={route.DOB} />;
      default:
        return null;
    }
  };
  const initialLayout = { width: Dimensions.get('window').width }

  const { notifications } = useContext(NotificationContext);
  const openModal = () => {
    setModalVisible(true);
  }

  const closeModal = () => {
    setModalVisible(false);
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const selectedURI = result.assets[0].uri;
      setSelectedImage(selectedURI);
      const updatedUsers = params.registeredUsers.map(user => {
        if (user.email === params.UserID) {
          return { ...user, profileImage: selectedURI };
        }
        return user;
      });
      params.registeredUsers = updatedUsers;
      AsyncStorage.setItem('registeredUsers', JSON.stringify(updatedUsers))
        .then(() => {
          console.log('Registered users updated in AsyncStorage');
        })
        .catch(error => {
          console.error('Error updating registered users in AsyncStorage:', error);
        });
      closeModal();

      Alert.alert('Profile Image Updated Successfully')
    }
  };

  const handleCameraCapture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const selectedURI = result.assets[0].uri;
      setSelectedImage(selectedURI);
      const updatedUsers = params.registeredUsers.map(user => {
        if (user.email === params.UserID) {
          return { ...user, profileImage: selectedURI };
        }
        return user;
      });
      params.registeredUsers = updatedUsers;
      AsyncStorage.setItem('registeredUsers', JSON.stringify(updatedUsers))
        .then(() => {
          console.log('Registered users updated in AsyncStorage');
        })
        .catch(error => {
          console.error('Error updating registered users in AsyncStorage:', error);
        });
      closeModal();

      Alert.alert('Profile Image Updated Successfully')
    }
  };



  return (
    <View style={styles.container}>
      <ImageBackground source={url} style={{ padding: 20, position: 'relative', height: 125, width: 500 }}>
        <Pressable onPress={openModal}>
          <Image source={{ uri: profileImage }} style={{ height: 100, width: 100, borderRadius: 60, marginTop: 70, marginLeft: 125, position: 'absolute' }}></Image>
        </Pressable>
      </ImageBackground>
      <Text style={{
        fontSize: 18, marginBottom: 5, fontWeight: 'bold', marginLeft: 5, position: 'absolute', marginTop: 195, marginLeft: 160
      }}>{UserName}</Text>
      <Text style={{
        fontSize: 15, marginBottom: 5, fontWeight: 'bold', marginLeft: 5, position: 'absolute', marginTop: 220, marginLeft: 100
      }}>{UserID}</Text>
      <View style={{ marginTop: 120 }}></View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        style={styles.tabView} // Add style prop to apply custom styling
        tabBarStyle={styles.tabBar} // Add tabBarStyle prop to style the tab bar
        renderTabBar={props => (
          <TabBar
            {...props}
            activeColor="#FFA500"
            inactiveColor='lightgrey'
            labelStyle={styles.tabLabel}
            indicatorStyle={styles.tabIndicator}
            tabStyle={styles.tabBar}
          />
        )}
      />
      <View style={{ padding: 20 }}></View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalView}>
          <View style={styles.modalContent}>
            <Image style={{ height: 100, width: 100, borderRadius: 50, marginBottom: 20 }} source={{ uri: selectedImage }} />
            <View style={styles.buttonContainer}>
              <Button title="Upload Image" onPress={pickImage} style={styles.button} />
              <View style={{ width: 10 }}></View>
              <Button title="Use Camera" onPress={handleCameraCapture} style={styles.button} />
            </View>
            <Button title="Close" onPress={closeModal} color="red" style={styles.closeButton} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 20
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
    marginBottom: 10,
    width: 150,
  },
  info: {
    flex: 1,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
  },
  visibilityIcon: {
    position: 'absolute',
    right: 15,
    bottom: -12
  },
  passwordStrength: {
    marginTop: 5,
    color: 'green',
  },
  errorText: {
    marginTop: 5,
    color: 'red',
  },
  changePasswordButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'orange',
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  changePasswordButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,

  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  closeButton: {
    marginVertical: 10,
    borderRadius: 10,
    width: 100
  },
  tabView: {
    backgroundColor: 'transparent',
    flex: 1,
    elevation: 0,
    shadowOpacity: 0
  },
  tabBar: {
    backgroundColor: 'white',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    height: 50,
  },
  tabLabel: {
    textTransform: 'capitalize',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabIndicator: {
    backgroundColor: '#FFA500',
    height: 3,
    elevation: 0,
    shadowOpacity: 0
  },
});

export default Account;
