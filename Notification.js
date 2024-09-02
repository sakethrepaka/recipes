import React from 'react';
import { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NotificationContext } from './NotificationContext'
import { MaterialIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient';
import { Checkbox } from 'react-native-paper';



const Notification = () => {
    const { notifications, setNotifications } = useContext(NotificationContext);
    const [selectedNotifications, setSelectedNotifications] = useState(new Array(notifications.length).fill(false));
  
    const toggleNotification = (index) => {
      setSelectedNotifications((prevState) => {
        const updatedSelection = [...prevState];
        updatedSelection[index] = !updatedSelection[index];
        return updatedSelection;
      });
    };
  
    const removeSelectedNotifications = () => {
      const updatedNotifications = notifications.filter((_, index) => !selectedNotifications[index]);
      setNotifications(updatedNotifications);
      setSelectedNotifications(new Array(updatedNotifications.length).fill(false));
    };

    console.log(notifications.length)
  
    return (

      <View style={styles.container}>

        {notifications.length==0 && <Text style={{fontWeight:'bold',textAlign:'center',marginTop:300,fontSize:20}}>No notifications for you</Text>}
        {notifications.map((notification, index) => (
          <LinearGradient key={index} colors={['#E6E6E6', '#ffffff']} style={styles.notification}>
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={selectedNotifications[index] ? 'checked' : 'unchecked'}
                onPress={() => toggleNotification(index)}
              />
            </View>
            {notification.type === 'delete' ? (
              <Ionicons name="trash" size={24} color="red" />
            ) : notification.type === 'add' ? (
              <MaterialIcons name="add-card" size={24} color="green" />
            ) : (
              <MaterialIcons name="update" size={24} color="blue" />
            )}
            <View style={styles.notificationText}>
              {notification.type === 'delete' ? (
                <Text style={styles.deleteText}>Deleted {notification.itemName} in {notification.category}</Text>
              ) : notification.type === 'add' ? (
                <Text style={styles.addText}>Added {notification.itemName} to {notification.category}</Text>
              ) : (
                <Text style={styles.updateText}>Updated {notification.itemName} in {notification.category}</Text>
              )}
            </View>
          </LinearGradient>
        ))}
        {selectedNotifications.some((isSelected) => isSelected) && (
          <TouchableOpacity onPress={removeSelectedNotifications} style={[styles.removeButton,styles.container]}>
            <Text style={styles.removeButtonText}>Remove Selected</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    elevation: 5,
    marginBottom: 10,
  },
  checkboxContainer: {
    marginRight: 10,
  },
  notificationText: {
    marginLeft: 10,
  },
  deleteText: {
    color: 'red',
    fontWeight: 'bold',
  },
  addText: {
    color: 'green',
    fontWeight: 'bold',
  },
  updateText: {
    color: 'blue',
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    maxWidth:200,
    marginLeft:90
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default Notification;
