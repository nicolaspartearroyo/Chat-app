import React from 'react';
//import async storage
import AsyncStorage from '@react-native-async-storage/async-storage';
//import netinfo to see who is online 
import NetInfo from '@react-native-community/netinfo';
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { View, Button, Text, Platform, KeyboardAvoidingView } from 'react-native';

import { Constants, MapView, Location, Permissions } from 'expo';

// circle button component
import CustomActions from './CustomActions';

//import firebase
const firebase = require('firebase');
require('firebase/firestore');

// Firebase config 
const firebaseConfig = {
  apiKey: "AIzaSyCB3io7lP6Be0d3TV4YI-LVQ-Kqk6yFB1E",
  authDomain: "chat-app-c6812.firebaseapp.com",
  projectId: "chat-app-c6812",
  storageBucket: "chat-app-c6812.appspot.com",
  messagingSenderId: "1010968703852",
  appId: "1:1010968703852:web:1ec491fb0c71c4a89e3949",
  measurementId: "G-CEMW2YZ5YL"
}


export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      isConnected: false,
      image: null,
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    this.referenceChatMessages = firebase.firestore().collection("messages");
    this.referenceMessageUser = null;
  };

  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  componentDidMount() {
    const name = this.props.route.params.username;
    // this.props.navigation.setOptions({ title: name });

    // Check online status of user
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.props.navigation.setOptions({ title: `${name} is Online` });
        // online
        console.log("online");
        this.setState({
          isConnected: true,
        });

        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if (!user) {
            firebase.auth().signInAnonymously();
          }
          this.setState({
            uid: user.uid,
            messages: []
          });

          // Create reference to messages of active users
          this.referenceMessagesUser = firebase
            .firestore()
            .collection("messages")
            .where("uid", "==", this.state.uid);

          // Listen for collection changes
          this.unsubscribe = this.referenceChatMessages
            .orderBy("createdAt", "desc")
            .onSnapshot(this.onCollectionUpdate);
        });
        //Offline
      } else {
        this.props.navigation.setOptions({ title: `${name} is Offline` });
        this.setState({
          isConnected: false,
        });
        console.log("Offline");
        this.setState({ isConnected: false });
        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    //stop listening to authentication
    this.authUnsubscribe();
    //stop listening for changes
    this.unsubscribe();
  }

  handleConnectivityChange = (state) => {
    const isConnected = state.isConnected;
    if (isConnected == true) {
      this.setState({
        isConnected: true,
      });
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    } else {
      this.setState({
        isConnected: false,
      });
    }
  };

  //add message to firebase
  addMessage = () => {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  };
  //define title in navigation bar
  static navigationOptions = ({ navigation }) => {
    return {
      title: `${navigation.state.params.userName}'s Chat`,
    };
  };

  //send messages function
  onSend = (messages = []) => {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
        this.saveMessages();
      }
    );
  };
  //save messages function
  async saveMessages() {
    try {
      //convert your messages object into a string:
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  //function to delete stored messages
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (error) {
      console.log(error.message);
    }
  }

  //retrieve and store messae on state
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({
      messages,
    });
  };

  // set message buble color
  renderBubble(props) {
    return (
      <Bubble
        {...props}
      // wrapperStyle={{
      //   right: {
      //     backgroundColor: this.props.route.params.backColor
      //   }
      // }
      // }
      />
    )
  }

  //If offline, dont render the input toolbar
  renderInputToolbar = (props) => {
    console.log("renderInputToolbar --> props", props.isConnected);
    if (props.isConnected === false) {
      return <InputToolbar {...props} />
    } else {
      return <InputToolbar {...props} />;
    }
  };

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  //custom map view
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: this.props.navigation.state.params.backgroundColor,
        }}
      >
        <GiftedChat
          messages={this.state.messages}
          isConnected={this.state.isConnected}
          renderBubble={this.renderBubble}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          onSend={(messages) => this.onSend(messages)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          user={this.state.user}
        />
        {Platform.OS === 'android' ?
          <KeyboardAvoidingView behavior="height" /> : null
        }
      </View>
    );
  }
}
