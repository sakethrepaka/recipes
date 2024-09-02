import React from 'react';
import { View, Alert, StyleSheet, Image, Text,TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { ImageBackground } from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


const CustomDrawerContent = ({ routeParams, navigation, ...rest }) => {
  const { registeredUsers } = routeParams
  const { profileImage } = routeParams
  const { UserName } = routeParams
  const url = require('./assets/bg.jpeg')
  const userData = registeredUsers
  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?', // Provide a string as the message
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "LOGOUT",
          onPress: () => {
            console.log(registeredUsers, "In LogOut")
            navigation.navigate('SignUp', {
              userData
            });
          }
        }
      ]
    )
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...rest}>
        <ImageBackground source={url}style={{ padding: 20 }}>
          <Image source={{ uri: profileImage }} style={{ height: 80, width: 80, borderRadius: 40, marginBottom: 10 }}></Image>
          <Text style={{
            fontSize: 18, marginBottom: 5, fontWeight: 'bold', marginLeft: 5
          }}>{UserName}</Text>
        </ImageBackground>
        <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 10 }}>
          <DrawerItemList navigation={navigation} {...rest} />
        </View>
      </DrawerContentScrollView>
      <View style={{padding: 20, borderTopWidth: 1, borderTopColor: '#ccc'}}>
      <TouchableOpacity onPress={handleLogout} style={{paddingVertical: 15}}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name="exit-outline" size={22} />
        <Text
          style={{
            fontSize: 15,
            marginLeft: 5,
            fontWeight:'bold'
          }}>
          Sign Out
        </Text>
      </View>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  boldLabel: {
    fontWeight: 'bold',
    color: "red",
    fontSize: 20
  },
  drawerItem: {
    marginTop: 60,
  },
});

export default CustomDrawerContent;
