import React, { Component } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, AsyncStorage } from 'react-native';
import { BottomScreenStyles } from '@config/styles';
import { users } from '@assets/fake_data';
import { connect } from 'react-redux';
import Chatkit from "@pusher/chatkit";
import { SECRET_KEY, CHATKIT_TOKEN_PROVIDER_ENDPOINT, CHATKIT_INSTANCE_LOCATOR } from '@config/chatConfig';
import axios from 'axios';
import { url } from '@config/loopBackConfig';

// This will create a `tokenProvider` object. This object will be later used to make a Chatkit Manager instance.
const tokenProvider = new Chatkit.TokenProvider({
  url: CHATKIT_TOKEN_PROVIDER_ENDPOINT
});

class ActiveScreen extends Component {
  state = {
    friends: [],
    name: '', //email or phone number
    id: '', //userid
    roomid: null
  }

  getLocalData = async () => {
    try {
      const name = await AsyncStorage.getItem('name');
      const id = await AsyncStorage.getItem('id');
      if (name != null && id != null) {
        // We have data!!
        console.log('1. ', name);
        this.setState({ name, id });
      }
    } catch (error) {
      // Error retrieving data
      console.log('Retrieve data from AsyncStore');
    }
  }

  getListUsers(){ //retrieve people in chatkit server
    axios.post(url + 'chats/getlistusers', {
    })
    .then(res => {
      if(res.data.success){
        const friends = res.data.data.filter(user => user.id != this.state.id);
        console.log(friends);
        this.setState({friends});
      }
    })
    .catch(function(error){
      console.log(error.message);
    });
  }
  retrievetData = async () => {
    // retrieve local info ddddd
    await this.getLocalData();
    // retrieve people on chatkit server
    console.log(this.state);
    await this.getListUsers();
  }

  componentDidMount() {
    this.retrievetData();
  }

  createRoom(item, roomname) {
    // This will instantiate a `chatManager` object. This object can be used to subscribe to any number of rooms and users and corresponding messages.
    // For the purpose of this example we will use single room-user pair.
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: CHATKIT_INSTANCE_LOCATOR,
      userId: this.state.id,
      tokenProvider: tokenProvider
    });

    // In order to subscribe to the messages this user is receiving in this room, we need to `connect()` the `chatManager` and have a hook on `onNewMessage`. There are several other hooks that you can use for various scenarios. A comprehensive list can be found [here](https://docs.pusher.com/chatkit/reference/javascript#connection-hooks).
    chatManager.connect().then(currentUser => {
      currentUser.createRoom({
        name: roomname,
        private: true,
        addUserIds: [this.state.id, item.id]
      }).then(room => {
        console.log('ROOM ', room);
        this.goToChatScreen(room);
      })
        .catch(err => {
          console.log(`Error creating room ${err}`);
        })
    });
  }

  retrieveRooms(item) {
    // This will instantiate a `chatManager` object. This object can be used to subscribe to any number of rooms and users and corresponding messages.
    // For the purpose of this example we will use single room-user pair.
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: CHATKIT_INSTANCE_LOCATOR,
      userId: this.state.id,
      tokenProvider: tokenProvider
    });

    const roomname = item.id + '-' + this.state.id;
    console.log(roomname);
    chatManager.connect()
      .then(currentUser => {
        console.log(currentUser.rooms);
        var rooms = currentUser.rooms.filter(e => e.name == roomname);
        if (rooms.length != 0) { //roomname exist
          this.goToChatScreen(rooms[0]);
        } else {
          // check inver_roomname
          console.log('INVERT ROOM NAME');
          const invert_roomname = this.state.id + '-' + item.id;
          rooms = currentUser.rooms.filter(e => e.name == invert_roomname);
          console.log(rooms);
          if (rooms.length != 0) {
            this.goToChatScreen(rooms[0]);
          } else {
            console.log('Create room: ', roomname);
            this.createRoom(item, roomname);
          }
        }
      })
      .catch(err => {
        console.log('Error on connection', err)
      });
  }

  onChatOneToOne(item) {
    //1. check the room existing
    this.retrieveRooms(item.item);
  }

  goToChatScreen(room) {
    this.props.dispatch({ type: "GOTO_CHAT", data: { "id": this.state.id, "roomid": room.id } })
  }

  listItem(item) {
    return (
      <View style={styles.viewItem}>
        <TouchableOpacity onPress={() => this.onChatOneToOne(item)} style={styles.touchItem}>
          <Text>{item.item.name}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <View style={BottomScreenStyles.container}>
        {this.state.friends != [] ?
          <FlatList
            data={this.state.friends}
            renderItem={(item) => this.listItem(item)}
            keyExtractor={(item, index) => index.toString()}
          />
          :
          null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewItem: {
    width: '100%',
    height: 60,
    marginBottom: 2,
    backgroundColor: 'gray',
    marginBottom: 2
  },
  touchItem: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    paddingLeft: 20,
  },
  personname: {
    marginLeft: 5
  }
})

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(ActiveScreen);

