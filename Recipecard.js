import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

const Recipecard = ({ recipe }) => {
    const [showAllIngredients, setShowAllIngredients] = useState(false);
    const [showAllInstructions, setShowAllInstructions] = useState(false);


    const generateRandomRating = () => {
        return (Math.random() * 4 + 1).toFixed(1);
    };
    const rating = generateRandomRating()

    if (!recipe || !recipe.Title || !recipe.Image || !recipe.Ingredients || !recipe.Instructions) {
        return null;
    }

    const ingredientsList = Object.values(recipe.Ingredients);

    const toggleIngredients = () => {
        setShowAllIngredients(!showAllIngredients);
    };

    const toggleInstructions = () => {
        setShowAllInstructions(!showAllInstructions);
    };

    return (
        <Card style={styles.card}>
            <Card.Content>
                <Title style={styles.title}>{recipe.Title}</Title>
                <Image source={{ uri: `https://${recipe.Image}` }} style={styles.image} />
                <View style={styles.ingredientsContainer}>
                    <Text style={styles.ingredientsTitle}>Ingredients:</Text>
                    {ingredientsList.map((ingredient, index) => (
                        <Text key={index} style={styles.ingredient}>{ingredient}</Text>
                    ))}
                </View>
                <View>
                    <Text style={styles.instructionsTitle}>Instructions:</Text>
                    <Text style={styles.instructions}>{showAllInstructions ? recipe.Instructions : `${recipe.Instructions.substring(0, 100)}...`}</Text>
                    {recipe.Instructions.length > 100 && (
                        <TouchableOpacity onPress={toggleInstructions}>
                            <Text style={styles.showMore}>{showAllInstructions ? 'Show Less' : 'Show More'}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 20,
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 10,
        elevation: 3,
        marginLeft: 10,
        marginRight: 10
    },
    title: {
        fontSize: 22,
        marginBottom: 15,
        fontWeight: 'bold',
        color: '#333',
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginBottom: 15,
        borderRadius: 10,
    },
    ingredientsContainer: {
        marginTop: 10,
    },
    ingredientsTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
        color: '#555',
    },
    ingredient: {
        marginBottom: 5,
        fontSize: 16,
        color: '#666',
    },
    instructionsTitle: {
        fontWeight: 'bold',
        marginTop: 15,
        fontSize: 18,
        marginBottom: 10,
        fontStyle: 'italic',
        color: '#555',
    },
    instructions: {
        lineHeight: 22,
        fontSize: 16,
        color: '#666',
    },
    showMore: {
        color: 'blue',
        marginTop: 10,
        fontSize: 16,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom:5
      },
      ratingText: {
        marginRight: 5,
      },
      star: {
        fontSize: 20,
        color: '#FFD700',
      },
});

export default Recipecard;
