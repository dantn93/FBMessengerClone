import React from "react";
import { View, Image, StyleSheet, TouchableOpacity, Picker, Text, TextInput } from "react-native";
import { connect } from 'react-redux';
import { GiftedChat } from "react-native-gifted-chat";
import Chatkit from "@pusher/chatkit";
import axios from 'axios';
// import { TextInput } from 'react-native-paper';

import { SECRET_KEY, CHATKIT_TOKEN_PROVIDER_ENDPOINT, CHATKIT_INSTANCE_LOCATOR } from '@config/chatConfig';
import { LANGUAGES } from '@config/languageArr';

class ChatScreen extends React.Component {
  state = {
    messages: [],
    username: '',
    roomid: '',
    selectFromPicker: false,
    selectToPicker: false,
    fromLanguage: 'vi',
    toLanguage: 'en',
    rawMessage: '',
    translateMessage: ''
  }


  componentDidMount() {
    const username = this.props.navigation.getParam("username");
    const roomid = this.props.navigation.getParam("roomid");
    console.log(roomid);
    this.setState({ username, roomid });

    // This will create a `tokenProvider` object. This object will be later used to make a Chatkit Manager instance.
    const tokenProvider = new Chatkit.TokenProvider({
      url: CHATKIT_TOKEN_PROVIDER_ENDPOINT
    });

    // This will instantiate a `chatManager` object. This object can be used to subscribe to any number of rooms and users and corresponding messages.
    // For the purpose of this example we will use single room-user pair.
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: CHATKIT_INSTANCE_LOCATOR,
      userId: username,
      tokenProvider: tokenProvider
    });

    // In order to subscribe to the messages this user is receiving in this room, we need to `connect()` the `chatManager` and have a hook on `onNewMessage`. There are several other hooks that you can use for various scenarios. A comprehensive list can be found [here](https://docs.pusher.com/chatkit/reference/javascript#connection-hooks).
    chatManager.connect({
      onAddedToRoom: room => {
        console.log(`Added to room ${room.id}`);
      }
    })
      .then(currentUser => {
        this.currentUser = currentUser;
        this.currentUser.subscribeToRoom({
          roomId: roomid,
          hooks: {
            onNewMessage: this.onReceive.bind(this)
          }
        });
      })
      .catch(err => {
        console.log('Error on connection', err)
      })
  };
  onReceive(data) {
    const { id, senderId, text, createdAt } = data;
    const incomingMessage = {
      _id: id,
      text: text,
      createdAt: new Date(createdAt),
      user: {
        _id: senderId,
        name: senderId,
        // avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmXGGuS_PrRhQt73sGzdZvnkQrPXvtA-9cjcPxJLhLo8rW-sVA"
      }
    };

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, incomingMessage)
    }));
  }

  onSend([message]) {
    this.currentUser.sendMessage({
      text: message.text,
      roomId: this.state.roomid
    });
    this.setState({
      rawMessage: '',
      translateMessage: ''
    });
  }

  onGoBack() {
    this.props.dispatch({ type: 'GO_BACK' });
  }

  onTranslate = () => {
    console.log(this.state.fromLanguage);
    console.log(this.state.toLanguage);
    console.log(this.state.rawMessage);
    axios.post('http://localhost:4000/translate', {
      "rawMessage": this.state.rawMessage,
      "fromLanguage": this.state.fromLanguage,
      "toLanguage": this.state.toLanguage
    })
      .then(res => {
        if (res.status == 200) {

          this.setState({ translateMessage: res.data });
        } else {
          this.setState({ translateMessage: '' });
        }
      })
      .catch(err => console.log('Cant send translated request to server'));
  }

  renderPicker() {
    if (this.state.selectFromPicker || this.state.selectToPicker) {
      return <Picker
        selectedValue={this.state.language}
        style={{ width: '100%', backgroundColor: '#fafafa', position: 'absolute', bottom: 0 }}
        onValueChange={(itemValue, itemIndex) => {
          this.state.selectFromPicker ? this.setState({
            fromLanguage: itemValue,
            selectFromPicker: false,
            selectToPicker: false
          }) : this.setState({
            toLanguage: itemValue,
            selectFromPicker: false,
            selectToPicker: false
          });
        }}>
        {LANGUAGES.map(e => <Picker.Item key={e.id} label={e.label} value={e.value} />)}
      </Picker>
    } else {
      return null;
    }

  }

  renderChatFooter(props) {
    return (
      <View>
        <View style={styles.footerselectlang}>
          <Text style={styles.translatelabel}>Translate from: </Text>
          <TouchableOpacity style={styles.touchfrom}
            onPress={() => this.setState({ selectFromPicker: true, selectToPicker: false })}
          >
            <Text style={{ fontSize: 14 }}>{LANGUAGES.filter(e => e.value == this.state.fromLanguage).map(e => e.label)}</Text>
          </TouchableOpacity>
          <Text style={styles.to}>to: </Text>
          <TouchableOpacity style={styles.touchfrom}
            onPress={() => this.setState({ selectFromPicker: false, selectToPicker: true })}
          >
            <Text style={{ fontSize: 14 }}>{LANGUAGES.filter(e => e.value == this.state.toLanguage).map(e => e.label)}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rawmessbox}>
          <View style={{ flex: 8.5 }}>
            <TextInput
              multiline={true}
              style={styles.rawmessage}
              placeholder={'Type a message to translate...'}
              onChangeText={(text) => this.setState({ rawMessage: text })}
              value={this.state.rawMessage}
            />
          </View>
          <View style={styles.boxbuttontranslate}>
            <TouchableOpacity
              style={{ width: '80%', height: '80%' }}
              onPress={this.onTranslate}
            >
              <Image source={require('@assets/images/icons8-google-translate-96.png')} style={{ width: '100%', height: '100%' }} />
            </TouchableOpacity>
          </View>
        </View>
        {this.renderPicker()}
      </View>
    )
  }

  render() {
    return <View style={styles.container}>
      <GiftedChat
        text={this.state.translateMessage}
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: this.state.username
        }}
        onInputTextChanged={text => this.setState({ translateMessage: text })}
        renderChatFooter={this.renderChatFooter.bind(this)}
      />

      <TouchableOpacity style={styles.touchBack} onPress={() => this.onGoBack()}>
        <Image source={require('@assets/images/icons8-back-filled-100.png')} style={styles.backImage} />
      </TouchableOpacity>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  touchBack: {
    width: 30,
    height: 30,
    position: 'absolute',
    zIndex: 1
  },
  backImage: {
    width: 30,
    height: 30,
    top: 30,
    left: 10
  },
  footerselectlang: {
    flexDirection: 'row',
    width: '100%',
    height: 40,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#707070'
  },
  translatelabel: {
    flex: 2.5,
    marginLeft: 3,
    fontSize: 14
  },
  touchfrom: {
    flex: 2.2,
    marginLeft: 5,
    backgroundColor: 'white',
    height: 25,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  to: {
    flex: 0.5,
    marginLeft: 8,
    fontSize: 14
  },
  rawmessage: {
    height: 40,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
    justifyContent: 'center',
    paddingLeft: 5,
    justifyContent: 'center',
    fontSize: 16
  },
  rawmessbox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginLeft: 5, 
    marginRight: 5, 
    marginBottom: 3 
  },
  boxbuttontranslate: { 
    flex: 1.5,
    marginLeft: 5,
    marginRight: 5,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default connect()(ChatScreen);
