import React from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';
import Header from '../componets/Header'
import RegisterForm from '../componets/RegisterForm'
import image from './../img/water.jpg'

/* Login function Component */
export default function Home() {
  return (
    <View style={styles.container}>
      <ImageBackground source={image} style={styles.image}>
        <Header />
        <RegisterForm />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    alignItems: 'center',
  },
});
