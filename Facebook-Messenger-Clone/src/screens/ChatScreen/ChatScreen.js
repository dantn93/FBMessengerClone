import React from "react";
import { View, Image, StyleSheet, TouchableOpacity, Picker, Text, TextInput } from "react-native";
import { connect } from 'react-redux';
import { GiftedChat } from "react-native-gifted-chat";
import Chatkit from "@pusher/chatkit";
import axios from 'axios';
// import { TextInput } from 'react-native-paper';

import { SECRET_KEY, CHATKIT_TOKEN_PROVIDER_ENDPOINT, CHATKIT_INSTANCE_LOCATOR } from '@config/chatConfig';
const langArr = [
  {id: 0, label: 'English', value: 'en'},
  {id: 0, label: 'Vietnamese', value: 'vn'}
]

class ChatScreen extends React.Component {
  state = {
    messages: [],
    username: '',
    roomid: '',
    language: 'en',
    selectPicker: false,
    rawMessage: ''
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
  }

  onGoBack() {
    this.props.dispatch({ type: 'GO_BACK' });
  }

  onTranslate(){
    // axios.post('')
  }

  renderChatFooter(props) {
      return (
      <View>
        <View style={{flexDirection: 'row', width: '100%', height: 40, alignItems: 'center', borderTopWidth: 1, borderColor: '#707070'}}>
          <Text style={{marginLeft: 8, fontSize: 16}}>Translate to: </Text>
          <TouchableOpacity style={{marginLeft: 5, backgroundColor: 'white', width: 100, height: 25, borderRadius: 5, alignItems: 'center', justifyContent: 'center'}}
            onPress={() => this.setState({selectPicker: true})}
          >
            <Text style={{fontSize: 16}}>{langArr.filter(e => e.value == this.state.language).map(e => e.label)}</Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', height: 70, alignItems: 'center', marginLeft: 5, marginRight: 5}}>
          <View style={{flex: 8.5}}>
            <TextInput
              multiline={true}
              style={{height: 50, width: '100%', backgroundColor: 'white', borderRadius: 5, justifyContent: 'center', paddingLeft: 5, justifyContent: 'center', fontSize: 16}}
              placeholder={'Type a message to translate...'}
              onChangeText={(text) => this.setState({rawMessage: text})}
              value={this.state.rawMessage}
            />
          </View>
          <View style={{flex: 1.5, marginLeft: 5, marginRight: 5, height: 50, justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity 
              style={{width: '80%', height: '80%'}}
              onPress={_ => _}
            >
              <Image source={require('@assets/images/icons8-google-translate-96.png')} style={{width: '100%', height: '100%'}}/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      )
  }

  render() {
    return <View style={styles.container}>
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: this.state.username
        }}
        // renderFooter={this.renderFooter.bind(this)}
        renderChatFooter={this.renderChatFooter.bind(this)}
      />
      {this.state.selectPicker == true? <Picker
        selectedValue={this.state.language}
        style={{width: '100%', backgroundColor: '#fafafa', position: 'absolute', bottom: 0}}
        onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue, selectPicker: false})}>
        {langArr.map(e => <Picker.Item key={e.id} label={e.label} value={e.value}/>)}
      </Picker> : null}

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
  }
})

export default connect()(ChatScreen);
