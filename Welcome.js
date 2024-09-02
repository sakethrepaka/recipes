import { View, Text, Pressable, Image, SafeAreaView } from 'react-native'
import { StatusBar } from 'react-native';
import React from 'react'
import { LinearGradient } from "expo-linear-gradient";
import COLORS from './Colors';
import Button from './Button';

const Welcome = ({ navigation }) => {

    return (

            <LinearGradient
                style={{
                    flex: 1,
                }}
                colors={['#FE7A36', COLORS.primary]}
            >
                <View style={{ flex: 1 }}>
                    <View>
                        <Image
                            source={require("./assets/one.jpeg")}
                            style={{
                                height: 100,
                                width: 100,
                                borderRadius: 20,
                                position: "absolute",
                                top: 10,
                                transform: [
                                    { translateX: 20 },
                                    { translateY: 50 },
                                    { rotate: "-15deg" }
                                ]
                            }}
                        />

                        <Image
                            source={require("./assets/two.jpeg")}
                            style={{
                                height: 100,
                                width: 100,
                                borderRadius: 20,
                                position: "absolute",
                                top: -30,
                                left: 100,
                                transform: [
                                    { translateX: 50 },
                                    { translateY: 50 },
                                    { rotate: "-5deg" }
                                ]
                            }}
                        />

                        <Image
                            source={require("./assets/three.jpeg")}
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 20,
                                position: "absolute",
                                top: 130,
                                left: -50,
                                transform: [
                                    { translateX: 50 },
                                    { translateY: 50 },
                                    { rotate: "15deg" }
                                ]
                            }}
                        />

                        <Image
                            source={require("./assets/bg.jpeg")}
                            style={{
                                height: 200,
                                width: 200,
                                borderRadius: 20,
                                position: "absolute",
                                top: 110,
                                left: 100,
                                transform: [
                                    { translateX: 50 },
                                    { translateY: 50 },
                                    { rotate: "-15deg" }
                                ]
                            }}
                        />
                    </View>

                    <View style={{
                        paddingHorizontal: 22,
                        position: "absolute",
                        top: 400,
                        width: "100%"
                    }}>
                        <Text style={{
                            fontSize: 50,
                            fontWeight: 800,
                            color: COLORS.white
                        }}>Let's Get</Text>
                        <Text style={{
                            fontSize: 46,
                            fontWeight: 800,
                            color: COLORS.white
                        }}>Started</Text>

                        <View style={{ marginVertical: 22 }}>
                            <Text style={{
                                fontSize: 16,
                                color: COLORS.white,
                                marginVertical: 4
                            }}>Craft recipes with ease</Text>
                            <Text style={{
                                fontSize: 16,
                                color: COLORS.white,
                            }}>Create, customize, and save your own recipes with ease</Text>
                        </View>

                        <Button
                            title="Join Now"
                            onPress={() => navigation.navigate("SignUp")}
                            style={{
                                marginTop: 22,
                                width: "100%"
                            }}
                        />

                        <View style={{
                            flexDirection: "row",
                            marginTop: 12,
                            justifyContent: "center"
                        }}>
                            <Text style={{
                                fontSize: 16,
                                color: COLORS.white
                            }}>Already have an account ?</Text>
                            <Pressable
                                onPress={() => navigation.navigate("Login")}
                            >
                                <Text style={{
                                    fontSize: 16,
                                    color: COLORS.white,
                                    fontWeight: "bold",
                                    marginLeft: 4
                                }}>Login</Text>
                            </Pressable>

                        </View>
                    </View>
                </View>
            </LinearGradient>

    )
}

export default Welcome