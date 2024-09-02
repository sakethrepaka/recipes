import React from 'react';
import { View, Text, Modal, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet, Linking, Animated,FlatList } from 'react-native';
import YoutubePlayer from "react-native-youtube-iframe";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';


const RecipeModal = ({ visible, toggleModal, title, instructions, youtubeVideos, loading, error, isDarkMode }) => {
    const openChannel = (channelId) => {
        const channelUrl = `https://www.youtube.com/channel/${channelId}`;
        Linking.openURL(channelUrl);
    };

    const translateY = new Animated.Value(0);
    const onGestureEvent = Animated.event(
        [{ nativeEvent: { translateY: translateY } }],
        { useNativeDriver: true }
    );

    const onHandlerStateChange = event => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            }).start();
        }
    };

    const Burger = require('./burger.json')

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={toggleModal}
        >
            <PanGestureHandler
                onGestureEvent={onGestureEvent}
                onHandlerStateChange={onHandlerStateChange}
            >
                <Animated.View
                    style={[
                        styles.modalContainer,
                        isDarkMode && styles.darkMode,
                        { transform: [{ translateY: translateY }] }
                    ]}
                >
                    {/* Modal Title */}
                    <Text style={[styles.modalTitle, isDarkMode && styles.modalTitleDark]}>{title}</Text>

                    {/* Close Button */}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={toggleModal}
                        accessibilityRole="button"
                        accessibilityLabel="Close Modal"
                    >
                        <Ionicons name="close" size={24} color={isDarkMode ? '#fff' : '#333'} />
                    </TouchableOpacity>

                    {/* YouTube Videos */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>YouTube Videos</Text>
                        {error ? (
                            <Text style={styles.errorText}>Failed to load YouTube videos. Please try again later.</Text>
                        ) : (
                            <View style={styles.youtubeContainer}>
                                {loading ? (
                                    <LottieView
                                        style={{ width: 175, height: 175, marginLeft: 100, marginTop: 80 }}
                                        source={Burger}
                                        autoPlay
                                        loop
                                    />
                                ) : (
                                    <FlatList
                                        data={youtubeVideos}
                                        keyExtractor={(video) => video.id.videoId}
                                        renderItem={({ item: video }) => (
                                            <View style={styles.videoContainer}>
                                                <YoutubePlayer
                                                    videoId={video.id.videoId}
                                                    height={200}
                                                />
                                                <View style={styles.videoInfo}>
                                                    <View style={styles.channelInfo}>
                                                        <MaterialIcons name="person" size={18} color="black" />
                                                        <TouchableOpacity onPress={() => openChannel(video.snippet.channelId)}>
                                                            <Text style={[styles.channelLink, { backgroundColor: 'red', marginLeft: 5, borderRadius: 2 }]}>
                                                                {video.snippet.channelTitle}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <Text style={[styles.videoTitle, isDarkMode && styles.videoTitleDark]}>{video.snippet.title}</Text>
                                                </View>
                                            </View>
                                        )}
                                    />

                                )}
                            </View>
                        )}
                    </View>
                </Animated.View>
            </PanGestureHandler>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    darkMode: {
        backgroundColor: '#333',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    modalTitleDark: {
        color: '#fff',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
        textAlign: 'center'
    },
    instructions: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
    },
    youtubeContainer: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingTop: 20,
    },
    videoContainer: {
        marginBottom: 20,
    },
    videoInfo: {
        marginTop: 10,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    channelInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    videoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    videoTitleDark: {
        color: '#fff',
    },
    channelLink: {
        fontSize: 14,
        color: '#fff',
        textDecorationLine: 'underline',
        paddingHorizontal: 5,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
    // Dark mode styles
    sectionTitleDark: {
        color: '#fff',
    },
    instructionsDark: {
        color: '#fff',
    },
});

export default RecipeModal;
