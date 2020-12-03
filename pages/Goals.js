import * as React from 'react';
import {Component} from 'react';
import Axios from 'axios';
import { Button, StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, ImageBackground } from 'react-native';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import DateTimePicker from '@react-native-community/datetimepicker';
import {FontAwesome, MaterialCommunityIcons, AntDesign, FontAwesome5} from '@expo/vector-icons';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import image from './../img/water.jpg';

/* customFonts Variable */
let customFonts = {
    'Cascadia': require('./../assets/fonts/Cascadia.ttf')
};

/* Goals Class Component */
class Goals extends Component {

    /* Constructor for class */
    /*
        State Declarations
            user:       State object for holding the User information, The id of the User, Token for authentication, 
                        set to empty initially
            goal:       State object for holding the Goal information for a goal that is going to be sent to the database.
                        It contains a Start Date, an End Date and a PercentGoal.
            goalRes :   State object for holding the Goal information for a the response that is sent back from the database
                        It contains a Start Date, an End Date and a PercentGoal.
            update:     State for controlling the page to check to see if there has been an update. Set to false
            showStart:  State for controling the view of the calendar for selecting a start date
            showEnd:    State for controling the view of the calendar for selecting a end date
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
            goal: {
                name: '',
                startDate: new Date(),
                endDate: new Date(),
                percentGoal: 0
            },
            goalRes: {
                name: '',
                startDate: new Date(),
                endDate: new Date(),
                percentComplete: 0
            },
            update: false,
            showStart: false,
            showEnd: false,
            fontsLoaded: false,
        }
    }

    /* This function is responsible for setting and updating the startDate variable in the Goal object State. */
    setStartDate = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.goal.startDate;
        this.setState({showStart: false})
    
        this.setState({
          goal:{
              ...this.state.goal,
              startDate: currentDate
          }})
    }

    /* This function is responsible for setting and updating the endDate variable in the Goal object State. */
    setEndDate = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.task.goal.endDate;
        this.setState({showEnd: false})
    
        this.setState({
          goal:{
              ...this.state.goal,
              endDate: currentDate
          }})
    }

    /* This function is responsible for setting and updating the percentGoal variable in the Goal object State. */
    setPercent = (e) => {
        if(e.nativeEvent.text > 100 || e.nativeEvent.text < 0 ) {
            Alert.alert(
                'Error',
                'Percent Goal has to within 0 - 100',
                [
                  { text: 'OK' }
                ],
                { cancelable: true}
              )
        }
        else {
            this.setState({
                goal:{
                    ...this.state.goal,
                    percentGoal: e.nativeEvent.text
                }})
        }
    }

    /* This function is responsible for setting and updating the name variable in the Goal object State. */
    setName = (name) => {
        this.setState({goal:{...this.state.goal, name: name}})
    }

    /* This function is responsible for setting the showStart state variable to true */
    showDatepicker = () => {
        this.setState({showStart: true})
    }

    /* This function is responsible for setting the showEnd state variable to true */
    showDatepicker2 = () => {
        this.setState({showEnd: true})
    }

    /* Function to load the customFonts variable and set the fontsLoaded State to true */
    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
    }

    /*
         This function is responsible for calling the nesscary compenents to mount to the page before the page does it's initial render. 
        It's intended purpose is to call the function setRoute to set up the User information and _loadFontsAsync to load the custom fonts
    */
    async componentDidMount() {
        this._loadFontsAsync();
       await this.setRoutes();
    }

    /*
       This function is responsible for updating the page based on if the update State is set to true. If the
       update state is false, the page won't update, but if it is set to true, the page will re-render updating
       any information. Once the Goal has been created, it will set this state to true to updating the content of
       the page.
    */
    async componentDidUpdate() {
        if(this.state.update !== false)
        {
            await this.setState({update: false})
        }
    }

    /*
       This function is responsible for setting up the necessary information needed to make calls to the DB and navigating, through the
       application. We then set the user state object to the data that was passed from the previous screen. 
    */
    setRoutes() {
        this.setState({
            user:{
                ...this.state.user,
                id: this.props.route.params.id,
                token: this.props.route.params.token
            }}) 
    }

    /* This function is responsible for handling the user logging out and redirecting the user to the home page. */
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

    /* This function is responsible for setting the time of day to be the end of the day so the entire day is taken into account when comparing. */
    setEndOfDay = () => {
        let offset = (new Date().getTimezoneOffset()) / 60;
        this.state.goal.endDate.setHours(23 + offset)
        this.state.goal.endDate.setMinutes(59)
        this.state.goal.endDate.setSeconds(59)
        this.state.goal.endDate.setMilliseconds(999)
    }

    /* This function is responsible for setting the time of day to be the start of the day so the entire day is taken into account when comparing. */
    setBeginningOfDay = () => {
        this.state.goal.startDate.setHours(0)
        this.state.goal.startDate.setMinutes(0)
        this.state.goal.startDate.setSeconds(0)
        this.state.goal.startDate.setMilliseconds(0)
    }

    dateSubOffsetOnChange = (date) => {
        let newDate = new Date(date);
        newDate.setDate(newDate.getDate() - 1)

        this.setState({
            goal:{
                ...this.state.goal,
                endDate: newDate
            }
        })
    }

    /*
        This function is responsible for creating a Goal and sendng a POST request to the database. The Goal object state
        is sent to the database. If the operation was a sucessful, the response code should be Code 200 and the update State
        is set to true.
    */
    createGoal = () => {
        this.setBeginningOfDay()
        this.setEndOfDay()
        Axios({
            method: 'POST',
            url: 'https://cs360-task-manager.herokuapp.com/goals/create',
            data: this.state.goal,
            headers: {"Authorization" : `Bearer ${this.props.route.params.token}`}
        }).then((response) => {
            this.setState({
                goalRes:{
                    ...this.state.goalRes,
                    startDate: response.data.startDate,
                    endDate: response.data.endDate,
                    percentComplete: response.data.percentComplete
            }})
            this.setState({update: true});
            this.dateSubOffsetOnChange(this.state.goal.endDate)
        })
        .catch(function(error) {
            if(error.response.status === 400)
            {
                Alert.alert(
                    'Error',
                    'Goal was unable to be created.',
                    [
                      { text: 'OK' }
                    ],
                    { cancelable: true}
                  )
            }
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

        <View style={styles.calendarContainer}>
            <View style={styles.row}>
                <TouchableOpacity
                    onPress={this.showDatepicker}>
                        <Text style={styles.text}>
                            Start Date: {new Date(this.state.goal.startDate).toDateString()} 
                            <FontAwesome name="calendar" size={24} color="black"/>
                        </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.row}>
                <TouchableOpacity
                    onPress={this.showDatepicker2}>
                    <Text style={styles.text}>
                        End Date: {new Date(this.state.goal.endDate).toDateString()}
                        <FontAwesome name="calendar" size={24} color="black"/>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.row}>
            <Text style={styles.text}>
                Goal Name:
            </Text>
            <View>
                <TextInput
                    value={this.state.goal.name}
                    style={styles.nameInput}
                    onChangeText={this.setName}/>
            </View>
        </View>

        <View style={styles.row}>
            <Text style={styles.text}>
                Enter A Percent Goal
            </Text>

            <TextInput
            style={styles.numberInput}
            keyboardType="numeric"
            onChange={this.setPercent}/>
        </View>

        <View style={styles.textPadding}>
            <Text style={styles.text}> 
                You have completed {this.state.goalRes.percentComplete}% of your goals.
            </Text>
        </View>
        <View style={styles.button}>
            <Button  color='#2ea6f1' title='Create Goal'
                onPress={() => this.createGoal()}>
            </Button>
        </View>

        <View>
            {this.state.showStart && (
                <DateTimePicker
                testID="dateTimePicker"
                value={new Date()}
                mode='date'
                is24Hour={true}
                display="default"
                onChange={this.setStartDate}/>)}
        </View>
        <View>
            {this.state.showEnd && (
                <DateTimePicker
                testID="dateTimePicker"
                value={new Date()}
                mode='date'
                is24Hour={true}
                display="default"
                onChange={this.setEndDate}/>)}
        </View>
        </ImageBackground>
        </View>
        );
    }
    else
    {
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
    calendarContainer: {
        alignItems: 'flex-start',
        justifyContent: "center",
        width: 350,
        height: 100
    },
    nameInput: {
        borderBottomWidth: 2,
        width: 240,
        justifyContent: "flex-end",
        fontFamily: 'Cascadia',
    },
    numberInput: {
        borderBottomWidth: 2,
        width: 50,
        justifyContent: "flex-end",
        marginLeft: 5,
        fontFamily: 'Cascadia',
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
        alignItems: 'center'
    },
    row:{
        flexDirection: 'row',
        paddingTop: 10,
    },
    text: {
        fontFamily: 'Cascadia',
        fontSize: 18,
    },
    headerText: {
        fontFamily: 'Cascadia',
        fontSize: 26,
    },
    menuText: {
        fontFamily: 'Cascadia',
        fontSize: 15,
    },
    textPadding: {
        marginTop: 5,
    },
    button: {
        marginTop: 20,
        marginHorizontal: 120,
    }
  });
  
  export default Goals;