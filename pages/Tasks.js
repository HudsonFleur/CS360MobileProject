import * as React from 'react';
import Axios from 'axios'
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import {MaterialCommunityIcons, AntDesign, FontAwesome5} from '@expo/vector-icons';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import image from './../img/water.jpg';

//import { get } from 'react-native/Libraries/Utilities/PixelRatio';

/* customFonts Variable */
let customFonts = {
    'Cascadia': require('./../assets/fonts/Cascadia.ttf')
  };

/* Tasks Class Component */
class Tasks extends React.Component {
    /* Constructor for Tasks Class */
    /*
        State Declarations
        tasks:      State array for holding all of the task objects for the respective user, set to empty initially.
        user:       State object for holding the User information, The id of the User, Token for authentication.
        fontsLoaded:    State for checking to see if the fonts have been loaded.
    */
    constructor(props)
    {
        super(props);
        this.state = {
            tasks: [],
            user: {
                id: "",
                token: "",
                taskID: ""
            },
            fontsLoaded: false
        }
    }

    /* Function to load the customFonts variable and set the fontsLoaded State to true. */
    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
    }
    
    /*
        This function is responsible for calling the nesscary compenents to mount to the page before the page does it's initial render. 
        It's intended purpose is to call the function setRoute to set up the User information and _loadFontsAsync to load the custom fonts
        and getTasks to get all of the tasks associated with the user.
    */
    async componentDidMount() {
        this._loadFontsAsync();
        await this.setRoute();
        this.getTasks();
    }

    /*
        This function is responsible for setting up the necessary information needed to make calls to the database and navigating, through the
        application. We then set the user state object to the data that was passed from the previous page.
    */
    setRoute() {
        this.setState({
            user:{
                ...this.state.user,
                id: this.props.route.params.id,
                token: this.props.route.params.token
            }}) 
        this.setState({
            userInfo:{
                ...this.state.user,
                id: this.props.route.params.id,
                token: this.props.route.params.token
            }}) 
    }

    /* 
        This function is responsible for retrieving the tasks associated with the account. If the request was successful
        then the taskArr state object is updated with the information found from the database.
    */
    getTasks() {
        Axios({
            method: 'GET',
            url: 'https://cs360-task-manager.herokuapp.com/tasks',
            headers: {"Authorization" : `Bearer ${this.props.route.params.token}`}
        }).then((response) => {
            this.setState({tasks: response.data});
        })
        .catch(function(error) {
            console.log(error);
        })
    }

    /*
        This function has a GET request to the database to retrieve a specific Task when supplied the Task
        ID for it. It updates the task State to contain the data retrieved from the database.
    */
    async getTask(TaskID) {
        await this.setState({
            user:{
                ...this.state.user,
                taskID: TaskID,
            }}) 
        this.props.navigation.push('ViewTask', this.state.user)     
    }

    /* This function is responsible for logging the User out of the application. They will be redirected back to the Homepage. */
    logout = () => {
        Axios({
            method: 'POST',
            url: 'https://cs360-task-manager.herokuapp.com/users/logout',
            data: this.state.user,
            headers: {"Authorization" : `Bearer ${this.props.route.params.token}`}
        }).then((response) => {
            this._menu.hide();
            this.props.navigation.navigate('Home')
        })
        .catch(function(error) {
            console.log(error);
        })
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
        if (this.state.fontsLoaded) 
        {
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
                            
                    <Menu style={styles.menu}
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

                <View style={styles.actionsBox}> 
                    <TouchableOpacity
                        onPress={() => this.props.navigation.push('AddTask', this.state.user)}>
                        <Text style={styles.headerText}> Create Task </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.body}>
                    {this.state.tasks.map(task => (
                        <TouchableOpacity key={task._id} onPress={() =>  this.getTask(task._id)}>
                            <Text numberOfLines={1} style={styles.task}> {task.description} </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
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
        alignItems: 'center',
    },
    task: {
        padding: 12,
        marginTop: 12,
        borderColor: '#000',
        borderBottomWidth: 2,
        borderStyle: 'solid',
        borderRadius: 50,
        fontSize: 18,
        fontFamily: 'Cascadia',
    },
    actionsBox: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: 350
    },
    body: {
        width: 410
    },
    taskbarContainer: {
        paddingTop: 45,
        marginTop: 20,
        height: 90,
        width: 400,
        alignItems: "center"
    },
    taskbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerText: {
        fontFamily: 'Cascadia',
        fontSize: 26,
    },
    menuText: {
        fontFamily: 'Cascadia',
        fontSize: 15,
    }
  });
  
export default Tasks