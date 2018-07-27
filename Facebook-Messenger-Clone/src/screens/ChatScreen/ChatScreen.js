import React from "react";
import {View, Image, StyleSheet, TouchableOpacity} from "react-native";
import {connect} from 'react-redux';
import { GiftedChat } from "react-native-gifted-chat";
import Chatkit from "@pusher/chatkit";

import { SECRET_KEY, CHATKIT_TOKEN_PROVIDER_ENDPOINT, CHATKIT_INSTANCE_LOCATOR } from '@config/chatConfig';

class ChatScreen extends React.Component {
  state = {
    messages: [],
    username: '',
    roomid: ''
  };

  componentDidMount(){
    const username = this.props.navigation.getParam("username");
    const roomid = this.props.navigation.getParam("roomid");
    console.log(roomid);
    this.setState({username, roomid});

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

  onGoBack(){
    this.props.dispatch({type: 'GO_BACK'});
  }

  render() {
    return <View style={styles.container}>
      <GiftedChat
        messages={this.state.messages} 
        onSend={messages => this.onSend(messages)}
        user={{
        _id: this.state.username
        }}
      />
      <TouchableOpacity style={styles.touchBack} onPress={() => this.onGoBack()}>
        <Image source={require('@assets/images/icons8-back-filled-100.png')} style={styles.backImage}/>
      </TouchableOpacity>
    </View>
    
  }
};

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
