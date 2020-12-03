import * as React from 'react';
import Axios from 'axios';
import {StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Alert, ScrollView} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome} from '@expo/vector-icons';
import CheckBox from '@react-native-community/checkbox';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import image from './../img/water.jpg';

/* customFonts Variable */
let customFonts = {
  'Cascadia': require('./../assets/fonts/Cascadia.ttf'),
};

/* viewTask Class Component */
class viewTask extends React.Component {
  
 /*
    State Declarations
      user:       State object for holding the User information, The id of the User, Token for authentication, 
                  and the TaskID of the the task to view.
      tasks:      State object for holding the Task information for a specific task, The description of the Task,
                  the Due Date it should be completed, if it has been completed and the owner of the task (User ID)
      show:       State variable for controling the view of the calendar            
      fontsLoaded:    State for checking to see if the fonts have been loaded
 */
  constructor(props)
  {
      super(props);
      this.state = {
          tasks: {
            description: '',
            dueDate: new Date(),
            completed: false
          },
          user: {
            id: '',
            token: '',
            taskID: ''
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
    and getTask to get the specific task.
  */
  componentDidMount() {
    this._loadFontsAsync();
    this.setRoute();
    this.getTask();
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
        taskID: this.props.route.params.taskID
    }}) 
  }

  /*
    This function is responsible for retrieving the tasks associated with the account. If the request was successful
    then the taskArr state object is updated with the information found from the database.
  */
  getTask() {
    Axios({
        method: 'GET',
        url: 'https://cs360-task-manager.herokuapp.com/tasks/' + this.props.route.params.taskID,
        headers: {"Authorization" : `Bearer ${this.props.route.params.token}`}
      }).then((response) => {
        this.setState({
            tasks:{
            ...this.state.tasks,
            description: response.data.description,
            dueDate: response.data.dueDate,
            completed: response.data.completed,
            }})
      })
      .catch(function(error) {})
  }

  /* This function is responsible for updating our description variable in the tasks State. */
  setDescription = (event) => {
    this.setState({
        tasks:{
            ...this.state.tasks,
            description: event,
        }})
  }

  /* This function is responsible for setting and updating the dueDate variable in the task object State. */
  setDate = (event, selectedDate) => {
    let newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1)
    this.setState({show: false})

    this.setState({
      tasks:{
          ...this.state.tasks,
          dueDate: newDate,
      }})
  }

  /* This function is responsible for subtracting the offset to accommodate for the UTC time setting that the database is set to. */
  dateSubOffset = (date) => {
    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() -1)
    return newDate
  }

  /* This function is responsible for setting the show state variable to true. */
  showDatepicker = () => {
    this.setState({show: true})
  }

  /* This function is responsible for setting the completed variable in the tasks state object.*/
  setCompleted() {
    this.setState({
      tasks:{
          ...this.state.tasks,
          completed: !this.state.tasks.completed,
      }})
  }

  /*
    This function is responsible for updating the information for a specific task. The user is able to  change the description, due date, 
    mark it as completed and delete as task. If the request was successful then page navigates back to the Tasks page.
  */
  updateTask() {
    Axios({
        method: 'PATCH',
        url: 'https://cs360-task-manager.herokuapp.com/tasks/' + this.props.route.params.taskID,
        data: this.state.tasks,
        headers: {"Authorization" : `Bearer ${this.props.route.params.token}`}
      }).then((response) => {
            this.props.navigation.push('Tasks', this.state.user);
      })
      .catch(function(error) {})
  }

  /* This function is responsible for deleting a specific task and prompts a confirmation. */
  deleteTaskConfirmation() {
      Alert.alert('Confirmation Required', 'Are you sure you want to delete this task?',
      [
          {text: 'Yes.', onPress: () => this.deleteTask()},
          {text: 'Cancel.'}
      ])
  }

  /* This function is responsible for deleting a task. If the request was successful then page navigates back to the Tasks page.*/
  deleteTask() {
    Axios({
        method: 'DELETE',
        url: 'https://cs360-task-manager.herokuapp.com/tasks/' + this.props.route.params.taskID,
        data: this.state.tasks,
        headers: {"Authorization" : `Bearer ${this.props.route.params.token}`}
      }).then((response) => {
            this.props.navigation.push('Tasks', this.state.user);
      })
      .catch(function(error) {})
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
                  <TouchableOpacity onPress={() => this.updateTask()}> 
                    <Text style={styles.headerText}> Save </Text> 
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.deleteTaskConfirmation()}>
                    <Text style={styles.headerText}> Delete </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                    <Text style={styles.headerText}> Cancel </Text>
                  </TouchableOpacity>
              </View>
            </View>

            <View style={styles.row}>
              <View>
                <TouchableOpacity
                  onPress={this.showDatepicker}>
                  <Text style={styles.text}>
                    {this.dateSubOffset(this.state.tasks.dueDate).toDateString()}
                    <FontAwesome name="calendar" size={30} color="black"/>
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.checkBox}>
                <Text style={styles.text}> Completed </Text>
                  <CheckBox 
                    disabled={false}
                    value={this.state.tasks.completed}
                    onValueChange={() => this.setCompleted()} />
              </View>
            </View>

            <ScrollView style={styles.inputBox}>
              <TextInput
                multiline={true}
                value={this.state.tasks.description}
                onChangeText={this.setDescription}
                style={styles.input}/> 
            </ScrollView>
              
            <View>
              {this.state.show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={new Date(this.state.tasks.dueDate)}
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
        paddingTop: 65,
        alignItems: 'center'
    },
    input: {
      fontFamily: 'Cascadia',
      fontSize: 16,
      textAlignVertical: "top",
      height: 500,
    },
    inputBox: {
      width: 380,
      padding: 6,
      margin: 7,
      borderColor: '#000',
      borderTopWidth: 2,
    },
    row: {
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
    headerText: {
      fontFamily: 'Cascadia',
      fontSize: 26,
    },
    headerRow: {
      flexDirection: "row",
      width: 350,
      justifyContent:"space-between",
      alignSelf: "center",
    },
    checkBox: {
      flexDirection: "row",
    },
})

export default viewTask