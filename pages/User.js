import * as React from 'react';
import Axios from 'axios'
import { StyleSheet, Text, View, TouchableOpacity, Button , TextInput, Alert, ImageBackground} from 'react-native';
import {MaterialCommunityIcons, AntDesign, FontAwesome5, MaterialIcons} from '@expo/vector-icons';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import image from './../img/water.jpg';

let customFonts = {
    'Cascadia': require('./../assets/fonts/Cascadia.ttf'),
  };

/* User Class Component */
class User extends React.Component
{
    /* Constructor for User Class Component*/
    /*
        State Declarations
            user:       State object for holding the User information, The id of the User, Token for authentication
            userInfo:   State object for holding the User Account information, The name of the User, the email associated
                        with the account and the password
            password:   State for holding the password
            fontsLoaded:    State for checking to see if the fonts have been loaded
    */
   constructor(props)
   {
       super(props);
       this.state = {
           user: {
               id: "",
               token: ""
           },
           userInfo: {
               name: "",
               email: ""
           },
           password: "",
           fontsLoaded: false,
       }
   }
   /* Function to load the customFonts variable and set the fontsLoaded State to true */
    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });   
    }

   /*
        This function is responsible for updating the page based on if the update State is set to true. If the
        update state is false, the page won't update, but if it is set to true, the page will re-render updating
        any information. Once the Goal has been created, it will set this state to true to updating the content of
        the page.
   */
   componentDidMount() {
    this._loadFontsAsync();
    this.setRoute();
    this.getUserInfo();
   }

   /*
        This function is responsible for settign up the nesscary information needed to make calls to the DB and navigating, through the
        application. We then set our User State variable to the data that was passed from the previous page.
    */
   setRoute() {
        this.setState({
            user:{
                ...this.state.user,
                id: this.props.route.params.id,
                token: this.props.route.params.token
            }}) 
    }

    /*
        This function is responsible for getting the information asscoiated with this user, being that we should have already
        set up the routes, we can now make a GET request to our server and set our tasks State to our resposne. We will then 
        set the userInfo object to hold the name of the user and the email of the user.
    */
    getUserInfo() {
        Axios({
            method: 'GET',
            url: 'https://cs360-task-manager.herokuapp.com/users/me',
            headers: {"Authorization" : `Bearer ${this.props.route.params.token}`}
        }).then((response) => {
            this.setState({
                userInfo:{
                    ...this.state.userInfo,
                    name: response.data.name,
                    email: response.data.email
                }
            });
        })
        .catch(function(error) {})
    }

    /*
        This function is responsible for upading the information asscoiated with this user. We will make a PATCH request to our 
        server to update either the Name, Email or Password on the account for this user.
    */
    async updateUserInfo() {
        if(this.state.password !== "" && this.state.password.length >= 7)
        {
           await this.setState({
                userInfo:{
                    ...this.state.userInfo,
                    password: this.state.password
                }})
        }
        
        Axios({
            method: 'PATCH',
            url: 'https://cs360-task-manager.herokuapp.com/users/me',
            data: this.state.userInfo,
            headers: {"Authorization" : `Bearer ${this.props.route.params.token}`}
          }).then((response) => {
              if(response.status === 200)
              {
                Alert.alert('Success', 'User information was successfully updated.',
                [
                    {text: 'Ok.'}
                ])
                this.props.navigation.push('User', this.state.user);
              }
          })
          .catch(function(error) {
            if(error.response.status === 400)
            {
                Alert.alert('Error', 'User information was unable to save.',
                [
                    {text: 'Ok.'}
                ])
            }
          })
    }

    /*  This function is responsible for deleting the asking the user for confirmation if the user choses to delete their account. */
    deleteUserConfirmation() {
        Alert.alert('Confirmation Required', 'Are you sure you want to delete your account? Once you confirm, all of your data will be permanetly deleted.',
        [
            {text: 'Cancel.'},
            {text: 'Delete My Account.', onPress: () => this.deleteUser()}
        ])
    }

    /*
        This function is responsible for deleting the information asscoiated with this user. We will make a DELETE request to our 
        server to delete this user's account.
    */
    deleteUser() {
        Axios({
            method: 'DELETE',
            url: 'https://cs360-task-manager.herokuapp.com/users/me',
            data: this.state.userInfo,
            headers: {"Authorization" : `Bearer ${this.props.route.params.token}`}
        }).then((response) => {
            this.props.navigation.push('Home');
        })
        .catch(function(error) {})
    }

    /* This function is responsible for updating our name variable in the userInfo State. */
    updateName = (event) => {
        this.setState({
            userInfo:{
                ...this.state.userInfo,
                name: event,
            }})
    }

    /* This function is responsible for updating our email variable in the userInfo State. */
    updateEmail = (event) => {
        this.setState({
            userInfo:{
                ...this.state.userInfo,
                email: event,
            }})
    }

    /* This function is responsible for updating our password variable in the userInfo State. */
    updatePassword = (event) => {
        this.setState({password: event})
    }

    /* This function is responsible for logging the User out of the application. They will be redirected back to the Homepage. */
    logout = () => {
        Axios({
            method: 'POST',
            url: 'https://cs360-task-manager.herokuapp.com/users/logout',
            data: this.state.user,
            headers: {"Authorization" : `Bearer ${this.props.route.params.token}`}
        }).then((response) => {
            this.props.navigation.navigate('Home')
        })
        .catch(function(error) {})
    }

    /* This variable and functions is responsible for handling the Menu component */
    _menu = null;
    setMenuRef = ref => {
        this._menu = ref;
    }
        
    showMenu = () => {
        this._menu.show();
    }

    /* This function is responsible for navigating to the Settings screen. */
    navigateSettings = () => {
        this._menu.hide();
        this.props.navigation.navigate('User', this.state.user)
    }

    render()
    {
        if (this.state.fontsLoaded) {
        return (
            <View style={styles.container}>
                <ImageBackground source={image} style={styles.image}>
                <View style={styles.taskbarContainer}>
                    <View style={styles.taskbar}>  
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Goals', this.state.user)}>
                        <View style={styles.taskbar}>
                            <AntDesign name="star" size={24} color="gold" />
                            <Text style={styles.headerText}> Goals </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Tasks', this.state.user)}>
                        <View style={styles.taskbar}>
                            <FontAwesome5 name="tasks" size={24} color="black" />
                            <Text style={styles.headerText}> Tasks </Text>
                        </View>
                    </TouchableOpacity>
                            
                    <Menu
                        ref={this.setMenuRef}
                        button={<MaterialCommunityIcons name="menu-down" size={30} color="black" onPress={this.showMenu} />}>

                        <MenuItem onPress={() => this.navigateSettings()}>
                            <Text style={styles.menuText}>Settings</Text> 
                        </MenuItem>
                        <MenuItem onPress={() => this.logout()}>
                            <Text style={styles.menuText}>Sign-Out</Text> 
                        </MenuItem>
                        <MenuDivider />
                    </Menu>    
                    </View>
                </View>

                <View>
                    <Text style={styles.text}> Name </Text>
                    <TextInput
                        value={this.state.userInfo.name} 
                        style={styles.inputForm}
                        onChangeText={this.updateName}/>

                    <Text style={styles.text}> Email </Text>
                    <TextInput
                        value={this.state.userInfo.email}  
                        style={styles.inputForm}
                        onChangeText={this.updateEmail}/>

                    <Text style={styles.text}> Password </Text>
                    <TextInput 
                        style={styles.inputForm}
                        secureTextEntry
                        onChangeText={this.updatePassword}/>

                    <View style={styles.buttonBox}>
                        <View style={styles.button}>
                            <Button color='#2ea6f1' onPress={() => this.updateUserInfo()}title='Save Changes'> </Button>
                        </View>
                        <View style={styles.button}>
                            <Button color='#2ea6f1' onPress={() => this.props.navigation.goBack()} title='Cancel'> </Button>
                        </View>
                        <View style={styles.button}>
                            <Button color='#2ea6f1' onPress={() => this.deleteUserConfirmation()} title='Delete'> </Button>
                        </View>
                    </View>
                </View>
                </ImageBackground>
            </View>
        )
    }
        else {
            return <AppLoading />;
          }
    }
    
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
        flex: 1,
        resizeMode: "cover",
    },
    taskbarContainer: {
        paddingTop: 45,
        marginTop: 20,
        height: 90,
        width: 400,
        alignItems: 'center',
    },
    taskbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerText: {
        fontFamily: 'Cascadia',
        fontSize: 26,
    },
    text: {
        fontFamily: 'Cascadia',
        fontSize: 18,
    }, 
    inputForm: {
        fontFamily: 'Cascadia',
        margin: 10,
        borderWidth: 2,
        borderColor: '#000',
        padding: 10,
        //width: 300
    },
    menuText: {
        fontFamily: 'Cascadia',
        fontSize: 15,
    },
    row:{
        flexDirection: 'row',
    },
    buttonBox: {
        flexDirection: 'row',
        alignSelf: 'center',
    },
    button: {
        paddingLeft: 7,
        paddingRight: 7,
    },
  });

export default User