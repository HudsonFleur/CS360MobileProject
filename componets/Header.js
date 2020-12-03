import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {AntDesign} from '@expo/vector-icons';
import { AppLoading } from 'expo';
import {useFonts} from 'expo-font';

export default function Header() {
  /* variable for useNaviagation */
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
          <View style={styles.header}> 
            <TouchableOpacity style={styles.headBox}
              onPress={() => navigation.navigate('Home')}>
              <AntDesign name="home" size={40} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.headBox}> Login </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}>
              <Text style={styles.headBox}> Register</Text>
            </TouchableOpacity>      
          </View>
      </View>
    )
  }
}

/* StylesSheet */
const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingBottom: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headBox: {
    fontFamily: 'Cascadia',
    fontSize: 26,
  }
});
