import React from 'react';
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { View, Button, Text, Platform, KeyboardAvoidingView } from 'react-native';

//import firebase
const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor() {
    super();

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

    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        name: '',
      },
    };
  }

  componentDidMount() {
    const { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: `${name}` });


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

      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });

    this.referenceChatMessages = firebase.firestore().collection('messages');
    // Listen for collection changes
    this.unsubscribe = this.referenceChatMessages.onSnapshot(this.onCollectionUpdate);
  }


  componentWillUnmount() {
    this.unsubscribe();
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
      image: message.image || null,
      location: message.location || null,
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
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
      });
    });
  };








  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: this.props.route.params.backColor
          }
        }}
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