import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, Modal, Pressable, CheckBox,FlatList } from 'react-native';
import fetchdata from './fetchdata';
import Recipecard from './Recipecard';
import { recipeData } from './recipeData';
import { Button, Checkbox } from 'react-native-paper';




const Feed = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [displayedRecipes, setDisplayedRecipes] = useState([]);

  const animation = require('./Animation .json')
  useEffect(() => {
    const fetchDataForRecipes = async () => {
      console.log("fetched")
      try {
        const allRecipes = [];
        for (const category of recipeData) {
          for (const recipe of category.data) {
            const data = await fetchdata(recipe.name);
            allRecipes.push(...data.d);
          }
        }
        setRecipes(allRecipes);
        setDisplayedRecipes(allRecipes);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataForRecipes();
    console.log("useeffect called")
  }, []);


  useEffect(() => {
    const filteredRecipes = recipes.filter(recipe =>
      recipe.Title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDisplayedRecipes(filteredRecipes);
  }, [searchTerm, recipes]);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };


  const handleItemSelect = (itemName) => {
    if (selectedItems.includes(itemName)) {
      setSelectedItems(selectedItems.filter(item => item !== itemName));
    } else {
      setSelectedItems([...selectedItems, itemName]);
    }
  };

  const handleFilterApply = () => {
    console.log(selectedItems);
    let filteredRecipes = recipes.filter(recipe =>
      selectedItems.some(item => recipe.Title.toLowerCase().includes(item.toLowerCase()))
    );
    setDisplayedRecipes(filteredRecipes);
    setModalVisible(false);
  };


  return (
    <View>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="black" />
          <Text style={{ fontStyle: 'italic', fontSize: 15, marginTop: 10 }}>Please wait while we fetch your recipes</Text>
        </View>
      ) : (
        <View>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder='Search Items'
              value={searchTerm}
              onChangeText={setSearchTerm}
              style={styles.searchInput}
            />
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <Text style={styles.clearSearch}>X</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={toggleModal}>
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
          <FlatList
            data={displayedRecipes}
            renderItem={({ item, index }) => (
              <Recipecard key={index} recipe={item} />
            )}
            keyExtractor={(item, index) => index.toString()} // or use a unique ID if available
          />

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {recipeData.map(category => (
                  <View key={category.category}>
                    <Text style={styles.categoryText}>{category.category}</Text>
                    {category.data.map(recipe => (
                      <TouchableOpacity
                        key={recipe.name}
                        onPress={() => handleItemSelect(recipe.name)}
                        style={styles.checkboxContainer}>
                        <Checkbox
                          status={selectedItems.includes(recipe.name) ? 'checked' : 'unchecked'}
                          onPress={() => handleItemSelect(recipe.name)}
                        />
                        <Text style={styles.label}>{recipe.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={handleFilterApply}>
                  <Text style={styles.textStyle}>Filter</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose, { marginTop: 5 }]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </View>
  );
};

export default Feed;

const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 280
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
    marginLeft: 10,
    marginRight: 10
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 8,
  },
  clearSearch: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginLeft: 10,
  },
  filterButton: {
    backgroundColor: 'lightgrey',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 10,
    width: 100,
    marginLeft: 270
  },
  filterText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'flex-start',
    justifyContent: 'center',
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: 'center'
  },
  label: {
    margin: 8,
    fontSize: 18,
  },
  categoryText: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
  },
});