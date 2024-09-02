import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView,ActivityIndicator } from 'react-native';
import axios from 'axios';

const Feedback = ({ route }) => {
    const { user } = route.params;

    const [feedbackData, setFeedbackData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await axios.get(`http://192.168.0.109:3001/get-feedback/${user}`);
                setFeedbackData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching feedback:', error);
                setLoading(false);
            }
        };

        fetchFeedback();
    }, [user]);

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size={20} color="blue"></ActivityIndicator>
            ) : feedbackData ? (
                <ScrollView style={styles.scrollContainer}>
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.headerText, styles.titleText]}>Message</Text>
                            <Text style={[styles.headerText, styles.titleText]}>Feedback</Text>
                        </View>
                        {feedbackData.feedbacks.map((feedback, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={styles.cellText}>{feedback.message}</Text>
                                <Text style={styles.cellText}>{feedback.feedbackText}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            ) : (
                <Text>No feedback found for the provided username</Text>
            )}
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#f0f0f0', // Added background color
    },
    scrollContainer: {
        flex: 1,
        width: '100%',
        marginTop:20
    },
    table: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginTop: 10,
        backgroundColor: 'white', // Added background color
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    headerText: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16, // Increased font size
        color: '#333', // Changed font color
    },
    tableRow: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    cellText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16, // Increased font size
        color: '#555', // Changed font color
    },
    titleText: {
        fontSize: 20, // Increased title font size
        color: '#000', // Changed title font color
    },
});

export default Feedback;