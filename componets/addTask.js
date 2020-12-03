import * as React from 'react';
import Axios from 'axios';
import {StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView, ImageBackground} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {FontAwesome} from '@expo/vector-icons'
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import image from './../img/water.jpg';

/* customFonts Variable */
let customFonts = {
    'Cascadia': require('./../assets/fonts/Cascadia.ttf')
};

/* addTask Class Component */
class addTask extends React.Component {

    /*
    State Declarations
        tasks:      State object for holding the Task information for a specific task, The description of the Task,
                    the Due Date it should be completed, if it has been completed and the owner of the task (User ID)
        user:       State object for holding the User information, The id of the User, Token for authentication.
        show:       State variable for controling the view of the calendar
        fontsLoaded:    State for checking to see if the fonts have been loaded
    */
    constructor(props)
    {
        super(props);
        this.state = {
            task: {
                description: '',
                dueDate: new Date(),
                completed: false,
            },
            user: {
                id:'',
                token: ''
            },
            show: false,
            fontsLoaded: false,
        }
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
    componentDidMount() {
        this._loadFontsAsync();
        this.setRoute();
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
            token: this.props.route.params.token,
        }}) 
    }

    /* This function is responsible for setting and updating the dueDate variable in the task object State. */
    setDate = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.task.dueDate;
        this.setState({show: false})
        this.setState({task:{...this.state.task, dueDate: currentDate}})
    }

    /* This function is responsible for setting the show state variable to true */
     showDatepicker = () => {
        this.setState({show: true});
    }

    /* This function is responsible for setting the description variable in the tasks State. */
    setDescription = (description) => {
        this.setState({task:{...this.state.task, description: description,}})
    }

    /* This function is responsible for adding the offset to accommodate for the UTC time setting that the database is set to. */
    dateAddOffset() {
        let offset = (new Date().getTimezoneOffset()) / 60;
        this.state.task.dueDate.setHours(23 + offset)
        this.state.task.dueDate.setMinutes(59)
        this.state.task.dueDate.setSeconds(59)
        this.state.task.dueDate.setMilliseconds(999)
    }

    /*
        This function is responsible for creating a task and making a POST request to the database. The dateAddOffset function
        is called and then the POST request to the database is made, The task state object is sent to the database and if the 
        request was successful (status = 201). If not then an alert is made to the user.
    */
    createTask() {
        this.dateAddOffset()
        Axios({
            method: 'POST',
            url: 'https://cs360-task-manager.herokuapp.com/tasks',
            data: this.state.task,
            headers: {"Authorization" : `Bearer ${this.props.route.params.token}`}
          }).then((response) => {
            if(response.status === 201)
            {
                this.props.navigation.push('Tasks', this.state.user);
            }
          })
          .catch(function(error) {
              if(error.response.status === 400)
              {
                Alert.alert('Error', 'Task is empty! ',
                [
                    {text: 'Ok'}
                ])
              }
          })
    }
    render()
    {
        if (this.state.fontsLoaded) 
      {
        return(
            <View style={styles.container}>
                <ImageBackground source={image} style={styles.image}>
                    <View style={styles.buttonBox}>
                        <View style={styles.headerRow}>
                            <TouchableOpacity onPress={() => this.createTask()}>
                                <Text style={styles.headerText}> Create Task </Text> 
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}> 
                                <Text style={styles.headerText}> Cancel </Text> 
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.date}>
                        <TouchableOpacity
                            onPress={this.showDatepicker}>
                                <Text style={styles.text}>
                                Due Date:  {this.state.task.dueDate.toLocaleDateString()}
                                <FontAwesome name="calendar" size={24} color="black"/> </Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.inputBox}>
                        <TextInput
                        multiline={true}
                        placeholder="Enter your task here"
                        style={styles.input}
                        onChangeText={this.setDescription}/>    
                    </ScrollView>
                
                    <View>
                        {this.state.show && (
                            <DateTimePicker
                            testID="dateTimePicker"
                            value={new Date()}
                            mode='date'
                            is24Hour={true}
                            display="default"
                            onChange={this.setDate}/>)}
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

/* StylesSheet */
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        alignItems: 'center',
    },
    buttonBox:{
        paddingTop: 85,
        alignItems: 'center',
    },
    inputBox: {
        width: 380,
        padding: 6,
        margin: 7,
        borderColor: '#000',
        borderTopWidth: 2
    },
    input: {
        fontFamily: 'Cascadia',
        fontSize: 16,
        textAlignVertical: "top",
        height: 500,
    },
    date: {
        flexDirection: "row",
        width: 350,
        justifyContent:"space-between",
        alignSelf: "center",
        marginTop: 15
    },
    text: {
        fontFamily: 'Cascadia',
        fontSize: 18
    },
    headerRow: {
        flexDirection: "row",
        width: 350,
        justifyContent:"space-between",
        alignSelf: "center",
    },
    headerText: {
        fontFamily: 'Cascadia',
        fontSize: 26,
    }
})

export default addTask