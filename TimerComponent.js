import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from the @expo/vector-icons package
import { CircularProgress } from 'react-native-svg-circular-progress';
import { Snackbar } from 'react-native-paper';

const TimerComponent = ({ initialTime }) => {
  const [time, setTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    let interval;

    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 1) {
            setSnackbarMessage('Timer ended.');
            setSnackbarVisible(true);
          }
          return prevTime - 1;
        });
      }, 1000);
      setSnackbarMessage('Timer started.');
      setSnackbarVisible(true);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  const startTimer = () => {
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setTime(initialTime);
    setIsActive(false);
    setSnackbarMessage('Timer reset.');
    setSnackbarVisible(true);
  };

  const calculateCirclePercentage = () => {
    return (time / initialTime) * 100;
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <CircularProgress
        percentage={calculateCirclePercentage()}
        size={100}
        progressWidth={45}
        backgroundColor="#dcdcdc"
        startColor="#00bcd4"
        endColor="#4caf50"
      >
        <Text style={[styles.timerText]}>{formatTime(time)}</Text>
      </CircularProgress>

      <View style={styles.buttonContainer}>
        {/* Play/Pause Button */}
        <TouchableOpacity onPress={isActive ? pauseTimer : startTimer}>
          <Ionicons name={isActive ? 'pause' : 'play'} size={30} color="#77D970" />
        </TouchableOpacity>
        {/* Reset Button */}
        <Button
          title="Reset"
          onPress={resetTimer}
          color="#FF3B30"
        />
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000} 
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 25,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom:100
  },
  snackbar: {
  }
});

export default TimerComponent;
