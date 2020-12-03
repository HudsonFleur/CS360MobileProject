import React, {useState} from 'react';
import Axios from 'axios';
import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {MaterialIcons, Ionicons} from '@expo/vector-icons';
import { AppLoading } from 'expo';
import {useFonts} from 'expo-font';

/* LoginForm Function */
export default function LoginForm() 
{
    /* Variable Declaration for navigation */
    const navigation = useNavigation();

    /* customFonts Variable */
    let [fontsLoaded] = useFonts({
      'Cascadia': require('./../assets/fonts/Cascadia.ttf')
    })

    /* Person State object containing the email and password */
    const [person, setPerson] = useState({
      email: '',
      password:''
    });

    /* Function for setting the email variable in the person state object */
    const setEmail = (email) => {
      setPerson( {...person, email: email })
    }

    /* Function for setting the password variable in the person state object */
    const setPassword = (password) => {
      setPerson( {...person, password: password })
    }

    /* 
      Function for sending a POST request to the database and passing the person state object.
      If the request was sucessful then the function will redirect to the Goals page passing the
      id and token for the user. If the request failed, it will alert the user.
    */
    const handleSubmit = () => {
      Axios({
        method: 'POST',
        url: 'https://cs360-task-manager.herokuapp.com/users/login',
        data: person
      }).then(function(response) {
        if(response.status === 200)
        {
          navigation.navigate('Goals', {
            id: response.data.user._id,
            token: response.data.token,
          });
        }
      })
      .catch(function(error) {
        if(error.response.status === 400)
        {
          Alert.alert(
            'Error',
            'The username or password is incorrect.',
            [
              { text: 'OK' }
            ],
            { cancelable: true}
          )
        }
      })
    }

    if (!fontsLoaded) {
      return <AppLoading />;
    }
    else
    {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
              Sign in
            </Text>
            <View style={styles.rowContainer}>

              <View style={styles.row}>
                <MaterialIcons name="email" size={45} color="black" />
                <TextInput
                placeholder="Email" 
                style={styles.inputForm}
                onChangeText={setEmail}/>
              </View>

              <View style={styles.row}>
                <Ionicons name="ios-lock" size={72} color="black" />
                <TextInput 
                  placeholder="Password" 
                  style={styles.inputForm}
                  secureTextEntry
                  onChangeText={setPassword}/>
              </View>

              <View style={styles.button}>
                <Button onPress={handleSubmit}  color='#2ea6f1' title='Login'/>
              </View>
            </View>
        </View>
    )
  }
}

/* StylesSheet */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowContainer: {
    justifyContent: 'space-between',
    height: 350,
    justifyContent: 'center',
  },
  inputForm: {
    margin: 10,
    borderWidth: 2,
    borderColor: '#000',
    padding: 10,
    width: 300,
    fontFamily: 'Cascadia',
    fontSize: 16,
  },
  button: {
      marginTop: 20,
      marginHorizontal: 120,
  },
  row: {
    flexDirection: 'row',
  },
  text:{
    fontFamily: 'Cascadia',
    fontSize: 26,
  }

});