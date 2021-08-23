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
      loggedInText: "Please wait, you are getting logged in",
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
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
    this.referenceChatMessagesUser = null;
  }

  componentDidMount() {
    let name = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    //creates a referenmce to message collection and bring it
    this.referenceChatMessages = firebase.firestore().collection("messages");

    // creates the user authentication
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      // Update user state with active user
      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
        }
      });
      // create a reference to the active user's documents
      this.referenceChatMessagesUser = firebase
        .firestore()
        .collection("messages")
        .where("uid", "==", this.state.uid);

      // Listen for collection changes
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    // stop listening for changes
    this.unsubscribe();
  }

  //retrieve data and store
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        user: data.user,
        system: data.system,
        createdAt: data.createdAt.toDate(),
      });
    });
    this.setState({
      messages,
    });
  }

  // Add messages 
  addMessages() {
    const message = this.state.messages[0];
    // add a new messages to the collection
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      createdAt: message.createdAt,
      text: message.text || null,
      user: message.user,
    });
  }

  //Send Messages Function
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
      // Call addMessages to saved on the server
      () => {
        this.addMessages();
      })
  }

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
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    return (
      <View style={{ flex: 1 }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {Platform.OS === 'android' ?
          <KeyboardAvoidingView behavior="height" /> : null
        }
      </View>
    );
  }
}
