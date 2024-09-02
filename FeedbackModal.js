import React, { useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const FeedbackModal = ({ isVisible, message, onClose, onSubmit }) => {
  const [feedbackText, setFeedbackText] = useState('');


  const handleFeedbackSubmit = () => {
    if (feedbackText.trim() !== '') { 
      onSubmit(feedbackText,message);
      setFeedbackText('');
      onClose() 
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 ,textAlign:'center',color:'darkorange'}}>FEEDBACK FORM</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Bot Message</Text>
          <Text style={{ fontSize: 14, marginBottom: 20 }}>{message}</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Feedback:</Text>
          <TextInput
            placeholder="Enter your feedback..."
            value={feedbackText}
            onChangeText={setFeedbackText}
            multiline 
            style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 20 }}
          />
          <TouchableOpacity
            onPress={handleFeedbackSubmit}
            style={{
              backgroundColor:feedbackText.trim() === '' ? '#ccc' : 'green', 
              padding: 10,
              borderRadius: 5,
              alignItems: 'center'
            }}
            disabled={feedbackText.trim() === ''}
          >
            <Text style={{ color: 'white', fontSize: 16 }}>Submit Feedback</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={{ marginTop: 10 }}>
            <Text style={{ color: 'red', fontSize: 16, textAlign: 'center',fontWeight:'bold' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default FeedbackModal;
