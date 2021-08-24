import React from 'react';
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { View, Button, Text, Platform, KeyboardAvoidingView } from 'react-native';

//import firebase
const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: "",
        name: "",
      },
    };


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
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    this.referenceChatMessages = firebase.firestore().collection("messages");
  };

  componentDidMount() {
    //welcome message with your name but its not working right now, used to work before.
    const name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    // listen to authentication events
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      // Update user state
      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
        },
      });
      this.referenceMessagesUser = firebase
        .firestore()
        .collection("messages")
        .where("uid", "==", this.state.uid);
      //listen collections
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
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
      });
    });
    this.setState({
      messages,
    });
  };

  //add message to firebase
  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
    });
  }

  //send messages function
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
      }
    );
  }

  // set message buble color
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: this.props.route.params.backColor
          }
        }
        }
      />
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={this.state.user}

        />
        {Platform.OS === 'android' ?
          <KeyboardAvoidingView behavior="height" /> : null
        }
      </View>
    );
  }
}
