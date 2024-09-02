import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Modal, StyleSheet, Platform, FlatList,PanResponder } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Example, you can use any icon library
import { Linking } from 'react-native';


const AppLinksModal = ({ setAppVisible }) => {
  const [visible, setVisible] = useState(true);

  const number = '9381821847'
  const message = "hello there!!"

  const openApp = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening app:', error);
    }
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // Close the modal if dragged from the top
        if (gestureState.dy > 50) { // Adjust the threshold as needed
          setVisible(false);
          setAppVisible(false);
        }
      },
    })
  ).current;
  

  const quickLinks = [
    { name: 'YouTube', icon: 'youtube', color: 'red', url: 'https://www.youtube.com/' },
    { name: 'WhatsApp', icon: 'whatsapp', color: 'green', url: 'whatsapp://send?phone=${number}&text=${message}' },
    { name: 'Outlook', icon: 'gmail', color: 'orange', url: `mailto:support@me.com?subject=testing&body=${message}`},
    { name: 'Google Map', icon: 'map-marker', color: 'green', url: `https://www.google.com/maps/search/?api=1&query=india`},
    { name: 'Phone', icon: 'phone', color: 'blue', url: `tel:${number}`},
    { name: 'Facebook', icon: 'facebook', color: 'blue', url: `https://www.facebook.com/`}

    // Add more quick links as needed
  ];

  const renderQuickLinkItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => {openApp(item.url)}} style={styles.quickLinkItem}>
        <View style={styles.iconContainer}>
          <Icon name={item.icon} size={30} color={item.color} style={styles.icon} />
        </View>
      </TouchableOpacity>
    );
  };
  

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => { setVisible(false); setAppVisible(false) }} // Use a function reference here
    >
      <View style={styles.modalContainer} {...panResponder.panHandlers}>
        <View style={styles.modal}>
          <Text style={styles.title}>Quick Links</Text>
          <FlatList
            data={quickLinks}
            renderItem={renderQuickLinkItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    maxHeight: 300,
    width: '100%',
    borderTopLeftRadius: 20, // Round top left corner
    borderTopRightRadius: 20, // Round top right corner
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  quickLinkItem: {
    alignItems: 'center',
    margin: 10,
    marginRight:20,
    marginHorizontal: 10,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: "black", // Light grey shadow color
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 1, // Make the shadow fully visible
    shadowRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // White background color for elevation
  }
  ,
  icon: {
    marginBottom: 10,
  },
  label: {
    fontSize: 13.5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});



export default AppLinksModal;
