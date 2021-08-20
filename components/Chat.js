import React from 'react';
import { GiftedChat } from "react-native-gifted-chat";
import { View, Button, Text } from 'react-native';

export default class Chat extends React.Component {
  //   constructor(props) {
  //     super(props);
  //     this.state = {
  //       name: '',
  //     }
  //   }
  //   render() {
  //     let name = this.props.route.params.name;
  //     this.props.navigation.setOptions({ title: name });
  //     return (
  //       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: this.props.route.params.backColor }}>
  //         <Button
  //           title="Go to Start"
  //           onPress={() => this.props.navigation.navigate('Start')}
  //         />
  //       </View>
  //     )
  //   }
  // }

  constructor() {
    super();
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
        },
      ],
    });
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={(messages) => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    );
  }
}