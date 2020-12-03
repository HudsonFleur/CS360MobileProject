import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from './../componets/Header';
import { AppLoading } from 'expo';
import {useFonts} from 'expo-font';
import image from './../img/homepage.jpg';

/* Jome Function Component */
export default function Home() 
{
  /* Variable Declaration for navigation */
  const navigation = useNavigation();

  /* customFonts Variable */
  let [fontsLoaded] = useFonts({
    'Cascadia': require('./../assets/fonts/Cascadia.ttf')
  })
  if (!fontsLoaded) {
    return <AppLoading />;
  }
  else
  {
  return (
    <View style={styles.container}>
      <ImageBackground source={image} style={styles.image}>
      <Header />
        <View style={styles.body}>
            <Text style={styles.headerText}> OYL </Text>
            <Text style={styles.text}> Organize Your Life</Text>
        </View>
      </ImageBackground>
    </View>
  );
 }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    alignItems: 'center',
  },
  headerText: {
    fontFamily: 'Cascadia',
    fontSize: 45,
    alignSelf: 'center',
    color: "white"
  },
  body: {
    paddingTop: 240,
  },
  text: {
    fontFamily: 'Cascadia',
    color: "white",
    alignItems: "center",
    fontSize: 26,
  }
});
