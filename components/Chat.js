import React from 'react';
import { View, Button, Text } from 'react-native';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
    }
  }
  render() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: this.props.route.params.backColor }}>
        <Button
          title="Go to Start"
          onPress={() => this.props.navigation.navigate('Start')}
        />
      </View>
    )
  }
}