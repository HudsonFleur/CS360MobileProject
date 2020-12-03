import React, {useState} from 'react';
import Axios from 'axios';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {MaterialIcons, Ionicons} from '@expo/vector-icons';
import { AppLoading } from 'expo';
import {useFonts} from 'expo-font';

/* RegisterForm Function */
export default function RegisterForm() {

  /* Variable Declaration for navigation */
  const navigation = useNavigation();

  /* customFonts Variable */
  let [fontsLoaded] = useFonts({
    'Cascadia': require('./../assets/fonts/Cascadia.ttf')
  })

  /* Person State object containing the name, email and password */
  const [person, setPerson] = useState({
    name: '',
    email: '',
    password:''
  });

  /* confirmPassword State object containing the password for comfirmation */
  const [confirmPassword, setConfirmation] = useState({
    password:''
  });

  /* 
      Function for sending a POST request to the database and passing the person state object.
      If the request was sucessful then the function will redirect to the Goals page passing the
      id and token for the user. If the request failed, it will alert the user on the basis of if
      the input doesn't satisfy the requirements. A name must be more than 2 characters long, A
      email must be a valid email of form <string>@<string>.<string>, a password must be more than
      7 characters long and a password must match the confirmation input. If the request gives the
      user a error 400, another alert is giving prompting the user to check the input once again.
  */
  const handleSubmit = () => {
    if(person.name.length < 2 ) {
      Alert.alert('Error', 'Name must be at least 2 characters long.', [
        {text: 'Ok.'}
      ])
    }
    else if(emailValidation(person.email) === false) {
      Alert.alert('Error', 'Please enter a valid email address.',
      [
        {text: 'Ok.'}
      ])
    }
    else if(person.password.length < 7) {
      Alert.alert('Error', 'Password must be at least 7 characters long.',
      [
        {text: 'Ok.'}
      ])
    }
    else if(person.password !== confirmPassword.password)
    {
      Alert.alert('Error', 'The passwords do not match, Please re-enter your passwords.',
      [
        {text: 'Ok.'}
      ])
    }
    else {

    Axios({
      method: 'POST',
      url: 'https://cs360-task-manager.herokuapp.com/users',
      data: person
    }).then(function(response) {
      if(response.status === 200)
      {
        navigation.navigate('Tasks', {
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
            'Please Check Your input',
            [
              { text: 'OK' }
            ],
            { cancelable: true}
          )
        }
    })
    }
  }
  /* 
    Function for checking to see if a email string is a valid email in the form of <string>@<string>.<string>
  */
  function emailValidation(email)
  {
    let mailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (email.match(mailFormat))
    {
      return (true)
    }
      return (false)
  }

  /* Function for setting the name variable in the person state object */
  const setName = (name) => {
    setPerson( {...person, name: name })
  }
  /* Function for setting the email variable in the person state object */
  const setEmail = (email) => {
    setPerson( {...person, email: email })
  }
  /* Function for setting the password variable in the person state object */
  const setPassword = (password) => {
    setPerson( {...person, password: password })
  }
  /* Function for setting the password variable in the confirmPassword state object */
  const setConfirmationPassword = (password) => {
    setConfirmation( {...confirmPassword, password: password })
  }

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  else
  {
  return (
    <View style={styles.container}> 
        <ScrollView>
        <Text style={styles.text}>
          Register
        </Text>
          <View style={styles.rowContainer}>
          <View style={styles.row}>
            <MaterialIcons name="person" size={45} color="black" />
            <TextInput 
            placeholder="Name" 
            style={styles.inputForm}
            onChangeText={setName}/>
          </View>

          <View style={styles.row}>
            <MaterialIcons name="email" size={45} color="black" />
            <TextInput
            placeholder="Email" 
            style={styles.inputForm}
            onChangeText={setEmail}
            />
           </View>

          <View style={styles.row}>
           <Ionicons name="ios-lock" size={72} color="black" />
           <TextInput
           placeholder="Password" 
           style={styles.inputForm}
           secureTextEntry
           onChangeText={setPassword}
           />
          </View>

          <View style={styles.row}>
           <Ionicons name="ios-lock" size={72} color="black" />
           <TextInput
           placeholder="Confirm Password" 
           style={styles.inputForm}
           secureTextEntry
           onChangeText={setConfirmationPassword}
           /> 
          </View>

          <View style={styles.button}>
            <Button  onPress={handleSubmit} color='#2ea6f1' title='Register !'/>
          </View>
          </View>
           
        </ScrollView>
        
    </View>
  );
  }
}

/* StylesSheet */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontFamily: 'Cascadia',
    fontSize: 26
  }, 
  inputForm: {
    margin: 10,
    borderWidth: 2,
    borderColor: '#777',
    padding: 10,
    width: 300,
    fontFamily: 'Cascadia',
    fontSize: 16,
  },
  rowContainer: {
    justifyContent: 'space-between',
    height: 500,
    paddingTop: 20,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  button: {
      marginTop: 20,
      marginHorizontal: 120,
      fontFamily: 'Cascadia',
      fontSize: 16,
  }

});
