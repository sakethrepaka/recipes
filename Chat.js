import React, { useState, useEffect, useLayoutEffect } from 'react';
import { ToastAndroid, Share, ActivityIndicator, StyleSheet, View, TextInput, Dimensions, Image, ScrollView, Platform, KeyboardAvoidingView, Text, Modal, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { GiftedChat } from 'react-native-gifted-chat';
import { recipeData } from './recipeData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Typewriter from 'react-native-typewriter';
import fetchdata from './fetchdata';
import FeedbackModal from './FeedbackModal';
import * as FileSystem from 'expo-file-system';
import * as Clipboard from 'expo-clipboard';
import { FontAwesome } from '@expo/vector-icons'
import { FontAwesome5 } from '@expo/vector-icons';
import {
  collection,
  addDoc,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
  getFirestore
} from 'firebase/firestore';
import app from './firebaseConfig';
import messaging from '@react-native-firebase/messaging';


const image = require('./assets/profile.png')
const image1 = require('./assets/food1.jpg');
const image2 = require('./assets/one.jpeg');
const image3 = require('./assets/two.jpeg');
const image4 = require('./assets/food3.jpg');

export function Chat({ routeParams }) {
  const [messages, setMessages] = useState([]);
  const [textInputValue, setTextInputValue] = useState('');
  const { UserID, UserPassword, registeredUsers, UserName, DOB, profileImage } = routeParams;
  const [recipes, setRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [instructionText, setInstructionText] = useState('');
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [currentFeedbackMessage, setCurrentFeedbackMessage] = useState('');

  const db = getFirestore(app);

  useEffect(() => {
    const fetchMessagesFromFirestore = async () => {
      try {
        const userDocRef = doc(db, 'messages', UserName);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userDocData = userDocSnapshot.data();
          console.log(userDocData.messages,"saketh")
          setMessages(userDocData.messages);
          console.log('Messages loaded from Firestore:', userDocData.messages);
        } else {
          console.log('No messages found for user:', UserName);
        }
      } catch (error) {
        console.error('Error fetching messages from Firestore:', error);
      }
    };

    fetchMessagesFromFirestore();
  }, [UserName]);






  const shareContent = async (content, imageUrl, instructions) => {
    try {
      console.log(imageUrl)
      await Share.share({
        title: content,
        message: instructions,
        url: imageUrl
      });
    } catch (error) {
      console.error('Error sharing content:', error.message);
    }
  };


  const handleDownload = async (name, imageUrl) => {
    const filename = name
    const result = await FileSystem.downloadAsync(
      imageUrl,
      FileSystem.documentDirectory + filename
    );
    console.log(result);

    save(result.uri, filename, result.headers["Content-Type"]);
  };

  const save = async (uri, filename, mimetype) => {
    if (Platform.OS === "android") {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype)
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
            ToastAndroid.show('Image Saved', ToastAndroid.SHORT);
          })
          .catch(e => console.log(e));
      } else {
        shareAsync(uri);
      }
    } else {
      shareAsync(uri);
    }
  };


  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
    ToastAndroid.show('Text copied!', ToastAndroid.SHORT);
  };




  const submitFeedback = (feedbackText, message) => {

    const data = {
      username: UserName,
      feedbackText: feedbackText,
      message: message
    };


    fetch('http://192.168.0.109:3001/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Feedback submitted successfully:', data.message);

      })
      .catch(error => {
        console.error('There was a problem with your fetch operation:', error);

      });
  };




  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: `Hello ${UserName}
how can i help you`,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Bot',
          avatar: image,
        },
      },
    ]);
  }, [UserName, profileImage]);

  useEffect(() => {
    const loadRecipesFromStorage = async () => {
      try {
        const recipesJson = await AsyncStorage.getItem(UserName);
        if (recipesJson) {
          const storedRecipes = JSON.parse(recipesJson);
          setRecipes(storedRecipes);
          console.log('Recipes loaded from AsyncStorage');
        } else {
          setRecipes(recipeData);
          console.log('Recipes set to default data');
        }
      } catch (error) {
        console.error('Error loading recipes from AsyncStorage:', error);
      }
    };

    loadRecipesFromStorage();
  }, []);

  const onSend = async (newMessages = []) => {


    let botMessageText = 'Hello!';
    let messageText = newMessages[0].text;

    if (messageText === "Brainstorming") {
      botMessageText = 'Bot response to Brainstorming';
    } else if (messageText === "Details") {
      botMessageText = `Username: ${UserName}\nDOB: ${DOB}`;
    } else if (messageText === "Hello") {
      botMessageText = 'Hi boss!';
    } else {
      // Check if the message matches a recipe name
      const selectedRecipes = recipeData.find((category) => category.category === selectedCategory)?.data;
      if (selectedRecipes) {
        const selectedRecipe = selectedRecipes.find((recipe) => recipe.name === messageText);
        if (selectedRecipe) {
          botMessageText = `Instructions for ${selectedRecipe.name}:\n${selectedRecipe.instructions}`;
        } else {
          botMessageText = 'Recipe not found!';
        }
      }
    }

    const botMessage = {
      _id: Math.round(Math.random() * 1000000),
      text: botMessageText,
      createdAt: new Date().toString(),
      user: {
        _id: 2,
        name: 'Bot',
        avatar: image,
      },
    };
    try {
      // Create a reference to the document with UserName
      const userDocRef = doc(db, 'messages', UserName);
      // Get the existing messages
      const userDocSnapshot = await getDoc(userDocRef);
      let existingMessages = [];
      if (userDocSnapshot.exists()) {
        const userDocData = userDocSnapshot.data();
        existingMessages = userDocData.messages;
      }
      // Append the new messages to the existing ones
      const updatedMessages = [botMessage, ...existingMessages, ...newMessages];
      // Update the document with the combined messages
      await setDoc(userDocRef, { messages: updatedMessages });
      console.log('Messages added to Firestore successfully:', newMessages);
    } catch (error) {
      console.error('Error adding messages to Firestore:', error);
    }





    setTimeout(() => {
      // Update local state with the bot message
      setMessages((prevMessages) => GiftedChat.append(prevMessages, botMessage));
    }, 1000);

    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
    setTextInputValue('');
  };





  const handleInputChange = (text) => {
    setTextInputValue(text);
  };

  const renderInputToolbar = (props) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 8,
          paddingVertical: 4,
          marginBottom: 10,
        }}>
        <TextInput
          placeholder="Type a message..."
          multiline
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#CCCCCC',
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 8,
            backgroundColor: 'white'
          }}
          value={textInputValue}
          onChangeText={handleInputChange}
        />
        <TouchableOpacity
          onPress={() => {
            if (textInputValue.trim().length > 0) {
              props.onSend([{ text: textInputValue }]);
              setTextInputValue('');
            }
          }}
          style={{ marginLeft: 8 }}>
          <MaterialIcons name="send" size={24} color="orange" />
        </TouchableOpacity>
      </View>
    );
  };



  const Footer = (props) => {
    const [showCategories, setShowCategories] = useState(false);

    const brainstormHandler = async () => {

      const randomCategoryIndex = Math.floor(Math.random() * recipes.length);

      const randomCategory = recipes[randomCategoryIndex].data;

      const randomRecipeIndex = Math.floor(Math.random() * randomCategory.length);
      const randomRecipe = randomCategory[randomRecipeIndex].name;


      try {

        const apiResponse = await fetchdata(randomRecipe);
        const Response = apiResponse.d

        let randomItem = Response[Math.floor(Math.random() * Object.keys(Response).length)];
        let imageUrl = `http:${randomItem.Image}`;

        setTimeout(() => {
          const botMessage = {
            _id: Math.round(Math.random() * 1000000),
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'Bot',
              avatar: image,
            },
            image: imageUrl,
            text: randomItem.Title,
            instructions: randomItem.Instructions
          };
          setMessages((prevMessages) => GiftedChat.append(prevMessages, botMessage));
        }, 1000)

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };



    const toggleShowCategories = () => {
      setShowCategories(!showCategories);
      if (selectedCategory !== null) {
        setSelectedCategory(null)
      }
    };

    const toggleCategory = (category) => {
      setSelectedCategory(category === selectedCategory ? null : category);
    };

    const renderCategoryButtons = () => {
      return recipeData.map((category, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.button, styles.recipeButton, (selectedCategory === category.category) && { backgroundColor: 'lightgreen' }]}
          onPress={() => toggleCategory(category.category)}>
          <Text style={styles.buttonText}>{category.category}</Text>
        </TouchableOpacity>
      ));
    };

    const renderRecipeButtons = () => {
      if (!selectedCategory) return null;

      const selectedRecipes = recipeData.find((category) => category.category === selectedCategory)?.data;

      if (!selectedRecipes) return null;

      return selectedRecipes.map((recipe, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.button, styles.recipeButton]}
          onPress={() => {
            props.onSend([{ text: recipe.name, _id: Math.round(Math.random() * 1000000), createdAt: new Date(), user: { _id: UserName, avatar: profileImage } }]);
            setShowCategories(false);
          }}>
          <Text style={styles.buttonText}>{recipe.name}</Text>
        </TouchableOpacity>
      ));
    };

    return (
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 10 }}>
          <TouchableOpacity style={styles.button} onPress={() => { props.onSend([{ text: "Details", _id: Math.round(Math.random() * 1000000), createdAt: new Date().toISOString(), user: { _id: UserName, avatar: profileImage } }]) }}>
            <Text style={styles.buttonText}>My Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, (showCategories) && { backgroundColor: 'lightgreen' }]}
            onPress={() => {
              toggleShowCategories();
            }}>
            <Text style={styles.buttonText}>My Recipes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              brainstormHandler();
              onSend([{ text: "Brainstorming", _id: Math.round(Math.random() * 1000000), createdAt: new Date(), user: { _id: UserName, avatar: profileImage } }]);
            }}
          >
            <Text style={styles.buttonText}>Brainstorm 💡</Text>
          </TouchableOpacity>
        </View>

        {showCategories && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 10, padding: 10 }}>
            {renderCategoryButtons()}
          </View>
        )}

        {showCategories && selectedCategory && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', padding: 10 }}>
            {renderRecipeButtons()}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, marginBottom: 10 }}>

      <GiftedChat
        messages={messages}
        onSend={onSend}
        showAvatarForEveryMessage={true}
        renderInputToolbar={renderInputToolbar}
        renderFooter={Footer}
        renderLoading={() => (
          <ActivityIndicator size="large" color="orange" />
        )}
        renderBubble={(props) => {
          // console.log(props.currentMessage)

          const openModal = (instructions) => {
            setInstructionText(instructions);
            setModalVisible(true);
          };


          const closeModal = () => {
            setModalVisible(false);
          }

          const handleFeedback = (message, type) => {
            if (type === 'downvote') {
              setCurrentFeedbackMessage(message);
              setFeedbackModalVisible(true);
            } else {

            }
          };

          return (
            <View>
              {props.currentMessage.user._id === 2 ? (
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                  <View style={{ marginRight: 10 }}>
                    {props.currentMessage.image &&
                      <TouchableOpacity onPress={() => openModal(props.currentMessage.instructions)}>
                        <Image
                          source={{ uri: props.currentMessage.image }}
                          style={{ width: 200, height: 200, borderRadius: 10, marginBottom: 10 }}
                        />
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                          <TouchableOpacity onPress={() => shareContent(props.currentMessage.text, props.currentMessage.image, props.currentMessage.instructions)}>
                            <FontAwesome5 name="share" size={20} color="black" />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => handleDownload(props.currentMessage.text, props.currentMessage.image)} style={{ marginTop: 3, marginBottom: 3, marginLeft: 180 }}>
                            <FontAwesome name="download" size={20} color="black" />
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    }
                    <View style={{ flexDirection: 'column', backgroundColor: '#008DDA', borderRadius: 10, padding: 7.5, maxWidth: 250, paddingBottom: 5 }}>
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 10 }}>
                        {props.currentMessage.user.name}
                      </Text>
                      <Typewriter typing={1} minDelay={5} maxDelay={20} style={{ color: 'white' }}>
                        {props.currentMessage.text}
                      </Typewriter>
                      <Text style={{ fontSize: 10, color: 'white', alignSelf: 'flex-end', marginTop: 3 }}>
                        {typeof props.currentMessage.createdAt === 'string' ?
                          new Date(props.currentMessage.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) :
                          props.currentMessage.createdAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                      </Text>

                    </View>
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={modalVisible}
                      onRequestClose={closeModal}
                    >
                      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
                          <View style={{ flexDirection: 'row', display: 'flex', marginBottom: 5, justifyContent: 'flex-end' }}>
                            <TouchableOpacity onPress={() => copyToClipboard(instructionText)}>
                              <FontAwesome5 name="copy" size={24} color="blue" />
                            </TouchableOpacity>
                            <Text style={{ marginLeft: 5 }}>Copy</Text>
                          </View>

                          <Text>{instructionText}</Text>
                          <TouchableOpacity onPress={closeModal} style={{ marginTop: 20 }}>
                            <Text style={{ color: 'blue', textAlign: 'center' }}>Close</Text>
                          </TouchableOpacity>
                        </View>
                      </ScrollView>
                    </Modal>

                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    {/* <TouchableOpacity style={{ marginRight: 10, borderRadius: 15, borderWidth: 1, borderColor: 'green', width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }} onPress={() => handleFeedback(props.currentMessage.text, 'upvote')}>
                      <Text style={{ fontSize: 15, color: 'white' }}>👍</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity style={{ marginRight: 10, borderRadius: 15, borderWidth: 1, borderColor: 'red', width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }} onPress={() => handleFeedback(props.currentMessage.text, 'downvote')}>
                      <Text style={{ fontSize: 15 }}>👎</Text>
                    </TouchableOpacity>
                  </View>
                </View>

              ) : (

                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 2 }}>

                  <View style={{ flexDirection: 'column', backgroundColor: '#008DDA', borderRadius: 10, padding: 7.5, maxWidth: 250, paddingBottom: 5, marginLeft: 10 }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 10 }}>
                      {props.currentMessage.user._id}
                    </Text>
                    <Text style={{ color: 'white' }}>
                      {props.currentMessage.text}
                    </Text>
                    <Text style={{ fontSize: 10, color: 'white', alignSelf: 'flex-end', marginTop: 3 }}>
                        {typeof props.currentMessage.createdAt === 'string' ?
                          new Date(props.currentMessage.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) :
                          props.currentMessage.createdAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                      </Text>
                  </View>

                  <Image
                    source={{ uri: props.currentMessage.user.avatar }}
                    style={{
                      height: 40,
                      width: 40,
                      borderRadius: 20,
                      marginLeft: 5,
                      marginTop: 20
                    }}
                  />
                </View>

              )}
            </View>
          );
        }}
        user={{
          _id: UserName,
          name: UserName,
          avatar: profileImage
        }}
      />

      <FeedbackModal
        isVisible={feedbackModalVisible}
        message={currentFeedbackMessage}
        onClose={() => setFeedbackModalVisible(false)}
        onSubmit={submitFeedback}
      />
    </View>

  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'orange',
    borderRadius: 20, // Adjust the value as needed
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  recipeButton: {
    marginRight: 5
  }
});




// const renderCarouselItem = ({ item, index }) => {
//   return (
//     <View style={{ justifyContent: 'center', alignItems: 'center' }}>
//       <Image
//         source={item}
//         style={{
//           width: Dimensions.get('window').width - 50,
//           height: 250,
//           resizeMode: 'cover',
//           borderRadius: 20,
//         }}
//       />
//     </View>
//   );
// };

// <Carousel
// data={[image1, image2, image3, image4]}
// renderItem={renderCarouselItem}
// width={Dimensions.get('window').width}
// height={300}
// style={{ margin: 0, padding: 0 }}
// loop={true}
// autoplay={false}
// autoplayInterval={30000}
// mode='parallax'
// modeConfig={{
//   parallaxScrollingScale: 0.88,
// }}
// />

// renderBubble={(props) => {

//   if (props.currentMessage.user._id === '2') {
//     return (
//       <Typewriter typing={1} minDelay={50} maxDelay={100}>
//         <GiftedChat.Bubble {...props} />
//       </Typewriter>
//     );
//   } else {
//     return <GiftedChat.Bubble {...props} />;
//   }
// }}



