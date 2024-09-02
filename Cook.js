import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { recipeData } from './recipeData';
import TimerComponent from './TimerComponent';

const Cook = () => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeDetails, setRecipeDetails] = useState(null);

  useEffect(() => {
    if (selectedRecipe) {
      let selectedRecipeDetails = recipeData
        .flatMap(category => category.data)
        .find(recipe => recipe.name === selectedRecipe);

      setRecipeDetails(selectedRecipeDetails);
    } else {
      setRecipeDetails(null);
    }
  }, [selectedRecipe]);

  const handleRecipeChange = (recipeName) => {
    setRecipeDetails(null);
    setSelectedRecipe(recipeName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedRecipe}
          onValueChange={handleRecipeChange}
          style={styles.picker}
        >
          <Picker.Item label="Select a recipe" value={null}/>
          {recipeData.map((category) =>
            category.data.map((recipe) => (
              <Picker.Item
                key={recipe.name}
                label={recipe.name}
                value={recipe.name}
              />
            ))
          )}
        </Picker>
      </View>
      {selectedRecipe && recipeDetails && (
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Instructions:</Text>
          <Text style={styles.instructionsText}>
              {recipeDetails.instructions}
          </Text>
        </View>
      )}
      <View style={{ margin: 25 }}></View>
      {recipeDetails && <TimerComponent initialTime={recipeDetails.time * 60} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  instructionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  instructionsTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  instructionsText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
});

export default Cook;
