import React, { useState, useEffect, useMemo, useContext } from 'react';
import { View, Text, SectionList, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, Button, Platform, TouchableWithoutFeedback, BackHandler, Image } from 'react-native';
import { recipeData } from './recipeData';
import { NotificationContext } from './NotificationContext';
import fetchYoutube from './fetchyoutube';
const gmail = require('./assets/gmail.png')
import RecipeModal from './RecipeModal';
import { SegmentedButtons } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';



const RecipeItem = ({ name, ingredients, instructions, onDelete, onEdit, isDarkMode, setEdit }) => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [loading, setLoading] = useState(false);



  const toggleModal = async () => {
    setShowModal(!showModal);
    if (!showModal && youtubeVideos.length === 0) {
      // Fetch YouTube videos when modal is opened for the first time
      setLoading(true);
      try {
        const response = await fetchYoutube(name);
        setYoutubeVideos(response.items);
      } catch (error) {
        console.error('Error fetching YouTube videos:', error);
      } finally {
        setLoading(false);
      }
    }
  };


  return (
    <View style={styles.recipeItem}>
      <View style={styles.recipeInfo}>
        <Text style={[styles.recipeName, isDarkMode && styles.recipeNameDark]}>{name} </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onDelete}>
            <Text style={styles.deleteButton}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { onEdit(); setEdit(true) }}>
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={[styles.ingredients, isDarkMode && styles.ingredientsDark]}>{ingredients.join(', ')}</Text>
      <TouchableOpacity onPress={toggleModal}>
        <Text style={styles.toggleButton}>Related Vidoes</Text>
      </TouchableOpacity>
      <RecipeModal
        visible={showModal}
        toggleModal={toggleModal}
        instructions={instructions}
        youtubeVideos={youtubeVideos} // Pass YouTube videos as props
        loading={loading} // Pass loading state as props
        isDarkMode={isDarkMode} // Pass dark mode state as props
      />
    </View>
  );
};

const Restaurant = ({ navigation, route}) => {
  const [recipes, setRecipes] = useState([]);
  const [add, setAdd] = useState(false)
  const [edit, setEdit] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [itemName, setItemName] = useState('');
  const [itemIngredients, setItemIngredients] = useState('');
  const [itemInstructions, setItemInstructions] = useState('');
  const [itemNameError, setItemNameError] = useState(false);
  const [itemIngredientsError, setItemIngredientsError] = useState(false);
  const [itemInstructionsError, setItemInstructionsError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isAscending, setIsAscending] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [categorySortDirections, setCategorySortDirections] = useState({});
  const [value, setValue] = useState('');
  const [segmentedCategory, setSegmentedCategory] = useState(null);
  const categoriesButtons = useMemo(() => recipes.map(category => ({ value: category.category, label: category.category })), [recipes]);
  const [lastTap, setLastTap] = useState(null);

  

  const {routeParams} = route.params
  const {UserName} = routeParams


  useEffect(() => {
    const loadRecipesFromStorage = async () => {
      try {
        const recipesJson = await AsyncStorage.getItem(UserName);
        if (recipesJson) {
          // Recipes found in AsyncStorage
          const storedRecipes = JSON.parse(recipesJson);
          setRecipes(storedRecipes);
          console.log('Recipes loaded from AsyncStorage');
        } else {
          // Recipes not found in AsyncStorage, setting default
          setRecipes(recipeData);
          console.log('Recipes set to default data');
        }
      } catch (error) {
        console.error('Error loading recipes from AsyncStorage:', error);
      }
    };
  
    loadRecipesFromStorage();
  }, []);
  


  const { addNotification } = useContext(NotificationContext);



  const toggleCategorySort = (category) => {
    setCategorySortDirections((prevDirections) => ({
      ...prevDirections,
      [category]: prevDirections[category] === 'asc' ? 'desc' : 'asc', // Toggle sorting direction
    }));
  };

  const filteredRecipes = useMemo(() => {
    setIsSearching(searchTerm !== '');
    return recipes
      .map(category => {
        if (segmentedCategory && category.category !== segmentedCategory) {
          return null;
        }

        const filteredData = category.data.filter(item => {
          const nameMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
          const instructionsMatch = item.instructions.toLowerCase().includes(searchTerm.toLowerCase());
          return nameMatch || instructionsMatch;
        });

        if (filteredData.length > 0) {
          return {
            ...category,
            data: filteredData
          };
        }
        return null;
      })
      .filter(category => category !== null);
  }, [recipes, searchTerm, segmentedCategory]);


  const sortedFilteredRecipes = useMemo(() => {

    if (!segmentedCategory) {
      return filteredRecipes;
    }

    return filteredRecipes.map((category) => ({
      ...category,
      data: category.data.slice().sort((a, b) => {
        const direction = categorySortDirections[category.category];
        return direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }),
    }));
  }, [filteredRecipes, categorySortDirections, segmentedCategory]);

  const toggleModal = (category) => {
    setSelectedCategory(category);
    setIsModalVisible(!isModalVisible);
  };

  const handleDelete = (itemName) => {
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete ${itemName}'s recipe?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            // Find the category of the item being deleted
            let deletedCategory = null;
            const updatedRecipes = recipes.map(category => {
              const filteredData = category.data.filter(item => {
                if (item.name === itemName) {
                  deletedCategory = category.category;
                  return false; // Exclude the item being deleted
                }
                return true; // Include other items
              });
              return { ...category, data: filteredData };
            });
            setRecipes(updatedRecipes);

            // Add notification for item deletion, including the category
            addNotification({
              type: 'delete',
              itemName: itemName,
              category: deletedCategory
            });
          },
          style: 'default',
        },
      ],
    );
  };

  const handleEdit = (itemName, itemIngredients, itemInstructions, category) => {
    // Set the selected category and item name
    setSelectedCategory({
      category: category.category,
      itemName: itemName
    });

    // Set the item details in the input fields
    setItemName(itemName);
    setItemIngredients(itemIngredients.join(', '));
    setItemInstructions(itemInstructions);

    // Open the modal
    setIsModalVisible(true);
  };

  const handleEditClean = () => {
    setItemName('');
    setItemIngredients('');
    setItemInstructions('');
    setSelectedCategory(null);

    setItemNameError(false);
    setItemIngredientsError(false);
    setItemInstructionsError(false);
    setIsModalVisible(false);
  }

  const handleAddItem = () => {
    // Check if any field is empty
    if (!selectedCategory || itemName.trim() === '' || itemIngredients.trim() === '' || itemInstructions.trim() === '') {
      // Set error state variables accordingly
      setItemNameError(itemName.trim() === '');
      setItemIngredientsError(itemIngredients.trim() === '');
      setItemInstructionsError(itemInstructions.trim() === '');
      return; // Prevent adding the item if any field is empty or no category is selected
    }

    // Reset error state variables
    setItemNameError(false);
    setItemIngredientsError(false);
    setItemInstructionsError(false);

    // Create a new item
    const newItem = {
      name: itemName,
      ingredients: itemIngredients.split(',').map(ingredient => ingredient.trim()),
      instructions: itemInstructions,
    };

    // Update or add the item to the selected category
    const updatedRecipes = recipes.map(category => {
      if (category.category === selectedCategory.category) {
        if (selectedCategory.itemName) {
          // If an item name is present, it means the user wants to edit an existing item within that category
          return {
            ...category,
            data: category.data.map(item => {
              // If the item name matches the selected item name, update it; otherwise, return the original item
              if (item.name === selectedCategory.itemName) {
                return {
                  ...item,
                  name: newItem.name,
                  ingredients: newItem.ingredients,
                  instructions: newItem.instructions,
                };
              }
              return item;
            }),
          };
        } else {
          // If no item name is present, it means the user wants to add a new item to the category
          return {
            ...category,
            data: [...category.data, newItem],
          };
        }
      }
      return category;
    });

    setRecipes(updatedRecipes);

    // Reset input fields and hide modal
    setItemName('');
    setItemIngredients('');
    setItemInstructions('');
    setSelectedCategory(null);
    setIsModalVisible(false);

    const notificationType = selectedCategory.itemName ? 'update' : 'add';
    addNotification({
      type: notificationType,
      itemName: newItem.name,
      category: selectedCategory.category
    });

    Alert.alert(
      selectedCategory.itemName ? 'Item Updated' : 'Item Added',
      `${itemName} has been ${selectedCategory.itemName ? 'updated' : 'added'} to the recipe.`,
      [{ text: 'OK' }]
    );
  };

  const renderRecipeItem = ({ item, section }) => (
    <RecipeItem
      name={item.name}
      ingredients={item.ingredients}
      instructions={item.instructions}
      onDelete={() => handleDelete(item.name)}
      isDarkMode={isDarkMode}
      onEdit={() => handleEdit(item.name, item.ingredients, item.instructions, section)}
      setEdit={setEdit}
    />
  );

  const renderSectionHeader = ({ section }) => (
    <View style={[styles.sectionHeader, isDarkMode && styles.sectionHeaderDark]}>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <Text style={[styles.sectionHeaderText, isDarkMode && styles.sectionHeaderTextDark]}>{section.category}</Text>
        <TouchableOpacity style={{ marginLeft: 10, marginTop: 1 }} onPress={() => toggleCategorySort(section.category)}>
          <Text style={{ color: "white", backgroundColor: 'grey', fontWeight: 'bold', borderRadius: 5, padding: 1.5 }}>
            {categorySortDirections[section.category] === 'asc' ? 'Z-A' : 'A-Z'}
          </Text>
        </TouchableOpacity>

      </View>
      <View>
        <TouchableOpacity onPress={() => { toggleModal(section); setAdd(true) }} >
          <Text style={[styles.modeButton, isDarkMode && styles.modeButtonDark]}>🖊️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const updateSuggestions = (term) => {
    const matchingItems = recipes.flatMap((category) =>
      category.data.filter((item) =>
        item.name.toLowerCase().includes(term.toLowerCase())
      )
    );
    const uniqueNames = [...new Set(matchingItems.map((item) => item.name))];
    setSuggestions(uniqueNames);

    // Update search history
    if (term.length >= 3) {
      const isIncludedInHistory = searchHistory.includes(term); // Check if term is already in history
      if (!isIncludedInHistory) {
        setSearchHistory((prevHistory) => {
          const isValidTerm = recipes.flatMap(category => category.data).some((recipe) =>
            recipe.name.toLowerCase() === term.toLowerCase() ||
            recipe.ingredients.includes(term)
          );
          if (isValidTerm) {
            // Add term to history if it's a valid recipe name or ingredient
            const newHistory = [...prevHistory, term];
            return newHistory.length > 5 ? newHistory.slice(-5) : newHistory;
          }
          return prevHistory; // If term is not valid, keep the history unchanged
        });
      }
    }

  };

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'Confirm Exit',
        'Are you sure you want to exit the app?',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          { text: 'LogOut', onPress: () => navigation.navigate('SignUp') },
        ],
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const saveRecipesToStorage = async () => {
      try {
        const recipesJson = JSON.stringify(recipes);
        await AsyncStorage.setItem(UserName, recipesJson); // Using UserName as the key
        console.log(`Recipes saved to AsyncStorage for user ${UserName}`);
      } catch (error) {
        console.error('Error saving recipes to AsyncStorage:', error);
      }
    };
  
    saveRecipesToStorage();
  }, [recipes]);



  return (

    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <TouchableWithoutFeedback onPress={() => setShowSuggestions(false)}>
        <View style={styles.headerContainer}>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder='Search Items'
              value={searchTerm}
              onChangeText={(text) => {
                setSearchTerm(text);
                setShowSuggestions(true);
                updateSuggestions(text);
              }}
              onBlur={() => setShowSuggestions(false)}
            >

            </TextInput>

            <View style={{ position: 'absolute', left: 300 }}>
              <Button onPress={() => {
                setSearchTerm('')
                setShowSuggestions(false)
              }} title='Clear' color='grey' disabled={searchTerm.length <= 0}>
              </Button>
            </View>
          </View>

          <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)}>
            <Text style={[{ position: 'absolute', top: -50, right: 170 }]}>
              {isDarkMode ? '☀️' : '🌙'}
            </Text>

          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.searchHistoryContainer}>
        {searchHistory.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setSearchTerm(item);
              setShowSuggestions(false);

            }}
          >
            <Text style={styles.searchHistoryItem}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {showSuggestions && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSearchTerm(item);
                setShowSuggestions(false);
                updateSuggestions(item)
              }}
            >
              <Text style={styles.suggestion}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {isSearching && filteredRecipes.length === 0 && (
        <Text style={styles.noResults}>No results found.</Text>
      )}

      <SegmentedButtons
        value={segmentedCategory}
        onValueChange={(category) => {
          // Check if the same category was tapped twice
          if (category === segmentedCategory) {
            setSegmentedCategory(null); // Reset segmented category filter
          } else {
            setSegmentedCategory(category);
          }
        }}
        buttons={categoriesButtons}
        style={{marginBottom:20}}
      />



      <TouchableWithoutFeedback onPress={() => setShowSuggestions(false)}>
        <SectionList
          sections={sortedFilteredRecipes}
          keyExtractor={(item) => item.name}
          renderItem={renderRecipeItem}
          renderSectionHeader={renderSectionHeader}
          // onScroll={()=>setShowSuggestions(false)}
          // onScrollBeginDrag={()=>setShowSuggestions(false)}
          onTouchStart={() => setShowSuggestions(false)}
        />
      </TouchableWithoutFeedback>
      <Modal
        visible={isModalVisible}
        onRequestClose={() => toggleModal(selectedCategory)}
        animationType='slide'
        presentationStyle='pageSheet'
      >
        <View style={styles.modalContent}>
          <Text style={[styles.modalTitle]}>Add Item</Text>
          <TextInput
            style={[styles.input, itemNameError && styles.errorInput]}
            placeholder='Item name'
            value={itemName}
            onChangeText={(text) => {
              setItemName(text);
              setItemNameError(false);

            }}
          />
          {itemNameError && <Text style={styles.errorText}>Please enter item name</Text>}
          <TextInput
            style={[styles.input, itemIngredientsError && styles.errorInput]}
            placeholder='Ingredients (comma separated)'
            value={itemIngredients}
            onChangeText={(text) => {
              setItemIngredients(text);
              setItemIngredientsError(false); // Clear error when typing
            }}
          />
          {itemIngredientsError && <Text style={styles.errorText}>Please enter ingredients</Text>}
          <TextInput
            style={[styles.input, styles.multilineInput, itemInstructionsError && styles.errorInput]}
            placeholder='Instructions'
            multiline
            value={itemInstructions}
            onChangeText={(text) => {
              setItemInstructions(text);
              setItemInstructionsError(false); // Clear error when typing
            }}
          />
          {itemInstructionsError && <Text style={styles.errorText}>Please enter instructions</Text>}
          <View style={styles.buttonContainer}>
            <Button title={add ? "Add" : "Edit"} onPress={handleAddItem} color={add ? "green" : "orange"} />
            <View style={styles.buttonSpacer} />
            <Button title="Cancel" onPress={() => { handleEditClean(); setAdd(false); setEdit(false) }} color="red" />

          </View>

        </View>
      </Modal>
    </View>


  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 50 : 0,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 10,
    flex: 1,
    paddingTop: 5,
    paddingBottom: 5
  },
  clearSearch: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginLeft: 250,
    backgroundColor: 'red'
  },
  containerDark: {
    backgroundColor: '#222222',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modeButton: {
    padding: 10,
    color: '#ffffff',
    backgroundColor: 'grey',
    borderRadius: 5,
    marginLeft: 'auto',
  },
  modeButtonDark: {
    backgroundColor: '#4a4a4a',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingLeft: 120,
  },
  titleDark: {
    color: 'white',
  },
  sectionHeader: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    flexDirection: 'row',
  },
  sectionHeaderDark: {
    backgroundColor: 'black',
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionHeaderTextDark: {
    color: 'yellow',
    backgroundColor: 'black',
  },
  recipeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  recipeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recipeNameDark: {
    color: '#ffffff',
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
    marginRight: 10,
    marginBottom: 5
  },
  editButton: {
    color: 'green',
    fontWeight: 'bold'
  },
  ingredients: {
    fontStyle: 'italic',
    marginBottom: 5,
  },
  ingredientsDark: {
    color: '#ffffff',
  },
  instructions: {
    marginTop: 5,
  },
  instructionsDark: {
    color: '#ffffff',
  },
  toggleButton: {
    color: 'blue',
    marginTop: 5,
  },
  input: {
    padding: 10,
    margin: 12,
    height: 40,
    borderWidth: 1,
  },
  multilineInput: {
    height: 100,
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonSpacer: {
    width: 10,
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
    marginLeft: 10
  },
  noResults: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 120,
    marginTop: 200
  },
  sortButton: {
    marginBottom: 5,
    marginLeft: 5,
    fontWeight: 'bold',
    backgroundColor: 'grey',
    color: 'white',
    padding: 1.5,
    borderRadius: 5
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 80, // Adjust as needed based on your layout
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    elevation: 4, // Add elevation for shadow on Android
    zIndex: 999, // Ensure dropdown is above other content
  },
  suggestion: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  searchHistoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  searchHistoryItem: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  categoryFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryFilterButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
  },
  dropdownContent: {
    position: 'absolute',
    top: 30,
    right: 10,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    zIndex: 1,
  },
  dropdownItem: {
    fontSize: 16,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});

export default Restaurant