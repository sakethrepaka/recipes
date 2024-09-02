import React, { useState, useContext } from 'react';
import { View, Text, Image, Button, Modal, StyleSheet, Pressable, Alert } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Admin from './Screens/Admin';
import CustomDrawerContent from './CustomDrawerContent';
const Drawer = createDrawerNavigator();


const AdminNavigation = ({ route, state }) => {
    const { params } = route;
  
    return (
      <View style={{ flex: 1 }}>
        <Drawer.Navigator initialRouteName='Admin' screenOptions={{ drawerActiveTintColor: '#fff', drawerActiveBackgroundColor: '#FD8D14' }} drawerContent={(props) => <CustomDrawerContent {...props} routeParams={params} />}>
          <Drawer.Screen name='Admin' options={{
            headerTitleStyle: { fontWeight: 'bold' }, drawerLabel: ({ focused }) => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="home-outline" size={24} style={{ marginRight: 5, fontWeight: 'bold', color: focused ? '#fff' : '#000' }} />
                <Text style={{ fontWeight: 'bold', marginTop: 5, color: focused ? '#fff' : '#000' }}>Home</Text>
              </View>)
          }}>
            {(props) => <Admin {...props} routeParams={params} />}
          </Drawer.Screen>
  
        </Drawer.Navigator>
      </View>
    );
  };
  
  export default AdminNavigation 