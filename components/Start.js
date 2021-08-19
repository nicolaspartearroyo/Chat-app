import React from 'react';
import { View, Text, Button, TextInput, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '' };
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

        <ImageBackground
          source={require('../assets/background.png')}
          style={styles.imageBackground}>

          <Text style={styles.chatAppTitle}>Chat App</Text>

          <View style={styles.whiteBox}>
            <TextInput
              style={{
                fontWeight: '300', width: 300, height: 40, borderColor: 'gray', borderWidth: 1, paddingLeft: 15,
              }}
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              placeholder='Your Name'
            />

            <View>
              <Text style={styles.colorChooseText}>Choose Background Color:</Text>
              <View style={styles.backColor}>
                <TouchableOpacity
                  style={styles.colorOption1}
                  onPress={() => this.setState({ backColor: '#090C08' })}
                />
                <TouchableOpacity
                  style={styles.colorOption2}
                  onPress={() => this.setState({ backColor: '#474056' })}
                />
                <TouchableOpacity
                  style={styles.colorOption3}
                  onPress={() => this.setState({ backColor: '#8A95A5' })}
                />
                <TouchableOpacity
                  style={styles.colorOption4}
                  onPress={() => this.setState({ backColor: '#B9C6AE' })}
                />
              </View>
            </View>
            <TouchableOpacity style={styles.startBttn}
              onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, backColor: this.state.backColor })}
            >
              <Text style={styles.startText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View >
    )
  }
}

const styles = StyleSheet.create({

  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  chatAppTitle: {
    fontSize: 45,
    fontWeight: '600',
    color: 'white',
    justifyContent: 'space-evenly',
    flex: 0.8,
  },

  whiteBox: {
    backgroundColor: 'white',
    width: '88%',
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },

  colorChooseText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    margin: 5
  },

  backColor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
  },

  colorOption1: {
    backgroundColor: '#090C08',
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 5,


  },

  colorOption2: {
    backgroundColor: '#474056',
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 5,

  },

  colorOption3: {
    backgroundColor: '#8A95A5',
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 5,


  },

  colorOption4: {
    backgroundColor: '#B9C6AE',
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 5,

  },

  startBttn: {
    margin: 5,
    width: '80%',
    height: 50,
    backgroundColor: '#757083',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },

  startText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,

  }

});