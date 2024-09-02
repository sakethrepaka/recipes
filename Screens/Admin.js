import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Modal, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font'

const Admin = ({ routeParams }) => {
    const navigation = useNavigation();
    const { registeredUsers } = routeParams || { registeredUsers: [] };
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const [fontsLoaded, fontError] = useFonts({
        'Super-Sunday': require('../assets/Super Sunday.ttf'),
    });

    if (!fontsLoaded && !fontError) {
        console.log('shit')
        return null;
    }

    const handleDeleteUser = async (index) => {
        try {

            let updatedUsers = [...registeredUsers];
            updatedUsers.splice(index, 1);


            await AsyncStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

            navigation.replace('AdminNavigation', { registeredUsers: updatedUsers });
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setModalVisible(true);
    };

    const handleViewFeedback = (user) => {
        console.log(user)
        navigation.navigate('Feedback', { user });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registered Users</Text>
            <ScrollView contentContainerStyle={styles.scrollView}>
                {registeredUsers.map((user, index) => (
                    <TouchableOpacity key={index} style={styles.userContainer}>
                        <View style={styles.chatContainer}>
                            <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
                            <Text style={styles.userName}>{user.name}</Text>
                            <TouchableOpacity onPress={() => handleViewDetails(user)} style={styles.iconButton}>
                                <MaterialIcons name="visibility" size={24} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDeleteUser(index)} style={styles.iconButton}>
                                <MaterialIcons name="delete" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => handleViewFeedback(user.name)} style={styles.feedbackButton}>
                            <Text style={styles.feedbackButtonText}>View Feedback</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {selectedUser && (
                            <>
                                <Text style={[styles.modalTitle, { fontFamily: 'Super-Sunday' }]}>User Details</Text>
                                <Text style={styles.modalText}>Name: {selectedUser.name}</Text>
                                <Text style={styles.modalText}>Email: {selectedUser.email}</Text>
                                <Text style={styles.modalText}>DOB: {selectedUser.dateOfBirth}</Text>
                                {/* Add more user details here */}
                                <Button title="Close" onPress={() => setModalVisible(false)} />
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 50,
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    scrollView: {
        flexGrow: 1,
        alignItems: 'center',
    },
    userContainer: {
        width: '100%',
        marginBottom: 10,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        elevation: 3,
    },
    chatContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 16,
        flex: 1,
    },
    iconButton: {
        padding: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        minWidth: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'Super-Sunday'
    },
    modalText: {
        fontSize: 16,
        marginBottom: 5,
    },
    feedbackButton: {
        backgroundColor: 'blue',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginLeft: 'auto',
    },
    feedbackButtonText: {
        color: 'white',
        fontWeight: 'bold',
    }
});

export default Admin;
