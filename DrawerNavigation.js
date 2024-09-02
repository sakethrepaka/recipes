
import React, { useState, useContext } from 'react';
import { View, Text, Image, Button, Modal, StyleSheet, Pressable, Alert } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationContext } from './NotificationContext';
import { Badge } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Cook from './Cook';
import Restaurant from './Restaurant';
import Notification from './Notification';
import CustomDrawerContent from './CustomDrawerContent';
import Account from './Screens/Account';
import Feed from './Feed'
import AppLinksModal from './AppLinksModal';
import { Chat } from './Chat';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();
const image = require('./assets/profile.png')
const profilePhotoUri = Image.resolveAssetSource(image).uri;


const BlankComponent = () => {
  return (
    null
  );
};


const DrawerNavigation = ({ route, state }) => {
  const { params } = route;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(params?.registeredUsers?.find(user => user.email === params?.UserID)?.profileImage || profilePhotoUri);

  const [visible, setAppVisible] = useState(false)

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
    <View style={{ flex: 1 }}>
      <Drawer.Navigator initialRouteName='Recipes' screenOptions={{ drawerActiveTintColor: '#fff', drawerActiveBackgroundColor: '#FD8D14' }} drawerContent={(props) => <CustomDrawerContent {...props} routeParams={params} />}>
        <Drawer.Screen name='Recipes' options={{
          headerTitleStyle: { fontWeight: 'bold' }, drawerLabel: ({ focused }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="home-outline" size={24} style={{ marginRight: 5, fontWeight: 'bold', color: focused ? '#fff' : '#000' }} />
              <Text style={{ fontWeight: 'bold', marginTop: 5, color: focused ? '#fff' : '#000' }}>Home</Text>
            </View>), headerRight: () => {
              return (
                <Pressable onPress={openModal}>
                  <Image style={{ height: 40, width: 40, marginRight: 20, borderRadius: 20 }} source={{ uri: selectedImage }} />
                </Pressable>
              );
            }
        }}>
          {(props) => (
            <Tab.Navigator initialRouteName='Recipe' screenOptions={{
              tabBarActiveTintColor: 'orange',
              tabBarInactiveTintColor: 'grey'
            }}>
              <Tab.Screen name="Recipe" options={{
                tabBarIcon: ({ color }) => {
                  return (<View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <MaterialCommunityIcons name="pot-mix" size={35} color={color} style={{ marginRight: 5 }} />
                  </View>)
                }, headerShown: false, tabBarLabelStyle: { fontWeight: 'bold', marginBottom: 2, fontSize: 12, color: "black", display: 'none' }
              }}>
                {(props) => (
                  <TopTab.Navigator screenOptions={{ tabBarLabelStyle: { fontWeight: 'bold', textTransform: 'none', fontSize: 15 }, tabBarIndicatorStyle: { backgroundColor: 'orange', height: 5, width: '8%', marginLeft: '15.5%' } }}>
                    <TopTab.Screen name="Home" component={Restaurant} initialParams={{ routeParams:params }} />
                    <TopTab.Screen name="Cook" component={Cook} />
                  </TopTab.Navigator>
                )}
              </Tab.Screen>
              <Tab.Screen
                name="Notifications"
                component={Notification}
                options={{
                  tabBarIcon: ({ color }) => (
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                      <Ionicons name="notifications" size={30} color={color} style={{ marginRight: 5 }} />
                      {notifications.length > 0 && <Badge style={{ position: 'absolute', top: -4, right: -4 }}>{notifications.length}</Badge>}
                    </View>
                  ),
                  headerShown: false,
                  tabBarLabelStyle: { display: 'none' },
                }}
              />
              <Tab.Screen
                name="AppLinks"
                component={BlankComponent} // Empty component
                listeners={({ navigation }) => ({
                  tabPress: (e) => {
                    // Prevent default navigation behavior
                    e.preventDefault();
                    setAppVisible(true)
                    // Log the message
                    console.log("AppLinks tab pressedd!");
                  },
                })}
                options={{
                  tabBarIcon: ({ color }) => (
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                      <Ionicons name="apps" size={30} color={color} style={{ marginRight: 5 }} />
                    </View>
                  ),
                  headerShown: false,
                  tabBarLabelStyle: { display: 'none' },
                  // Use onPress instead of onPlay
                }}
              />
              <Tab.Screen
                name="Chat"
                options={{
                  tabBarIcon: ({ color }) => (
                    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                      <Ionicons name="chatbubbles" size={40} color={color} style={{ marginRight: 5 }} />
                    </View>
                  ),
                  headerShown: false,
                  tabBarLabelStyle: { display: 'none' },
                  tabBarActiveTintColor:'blue'
                }}
              >
                {(props) => <Chat {...props} routeParams={params} />}
              </Tab.Screen>

            </Tab.Navigator>
          )}
        </Drawer.Screen>
        <Drawer.Screen name='Profile' options={{
          headerTitle: "Profile", drawerLabel: ({ focused }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="account" size={24} style={{ marginRight: 5, color: focused ? '#fff' : '#000' }} />
              <Text style={{ fontWeight: 'bold', marginTop: 5, color: focused ? '#fff' : '#000' }}>Profile</Text>
            </View>)
        }}>
          {(props) => <Account {...props} routeParams={params} />}
        </Drawer.Screen>
        <Drawer.Screen name='Feed' options={{
          headerTitle: "Feed", drawerLabel: ({ focused }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="newspaper-variant-outline" size={24} style={{ marginRight: 5, color: focused ? '#fff' : '#000' }} />
              <Text style={{ fontWeight: 'bold', marginTop: 5, color: focused ? '#fff' : '#000' }}>Feed</Text>
            </View>
          )
        }}>
          {() => <Feed />}
        </Drawer.Screen>

      </Drawer.Navigator>



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
      {
        visible && <AppLinksModal setAppVisible={setAppVisible}></AppLinksModal>
      }

    </View>
  );
};

export default DrawerNavigation


const styles = StyleSheet.create({
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Adjust the background color as needed
  },
});