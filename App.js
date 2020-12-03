import 'react-native-gesture-handler';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import User from './pages/User'
import Goals from './pages/Goals'
import Tasks from './pages/Tasks'
import AddTask from './componets/addTask'
import ViewTask from './componets/viewTask'

const Stack = createStackNavigator();

export default class App extends Component 
{
  render()
  {  
  const HomeNav = () => (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="User" component={User} />
      <Stack.Screen name="Goals" component={Goals} />
      <Stack.Screen name="Tasks" component={Tasks} />
      <Stack.Screen name="AddTask" component={AddTask} />
      <Stack.Screen name="ViewTask" component={ViewTask} />
    </Stack.Navigator>
    </NavigationContainer>
  )

  return (
      <HomeNav />
  );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

});

