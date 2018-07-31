import React, { Component } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, AsyncStorage } from 'react-native';
import { BottomScreenStyles } from '@config/styles';
import { users } from '@assets/fake_data';
import { connect } from 'react-redux';
import Chatkit from "@pusher/chatkit";
import { SECRET_KEY, CHATKIT_TOKEN_PROVIDER_ENDPOINT, CHATKIT_INSTANCE_LOCATOR } from '@config/chatConfig';
import axios from 'axios';

class ActiveScreen extends Component {
  state = {
    people: [],
    username: '',
    roomid: 0
  }

  retrieveData = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      const avatar = await AsyncStorage.getItem('avatar');
      if (username != null) {
        // We have data!!
        await this.setState({ username });
      }
    } catch (error) {
      // Error retrieving data
      console.log('Retrieve data from AsyncStore');
    }
  }
  getFakeData = async () => {
    await this.retrieveData();
    const friends = await users.results.slice(0, 10).filter(user => user.login.username != this.state.username);
    await this.setState({ people: friends });
  }
  componentDidMount() {
    this.getFakeData();
  }

  componentWillUnmount(){
    console.log('UNMOUNT');
  }

  createRoom(item, roomname) {
    // This will create a `tokenProvider` object. This object will be later used to make a Chatkit Manager instance.
    const tokenProvider = new Chatkit.TokenProvider({
      url: CHATKIT_TOKEN_PROVIDER_ENDPOINT
    });

    // This will instantiate a `chatManager` object. This object can be used to subscribe to any number of rooms and users and corresponding messages.
    // For the purpose of this example we will use single room-user pair.
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: CHATKIT_INSTANCE_LOCATOR,
      userId: this.state.username,
      tokenProvider: tokenProvider
    });

    // In order to subscribe to the messages this user is receiving in this room, we need to `connect()` the `chatManager` and have a hook on `onNewMessage`. There are several other hooks that you can use for various scenarios. A comprehensive list can be found [here](https://docs.pusher.com/chatkit/reference/javascript#connection-hooks).
    chatManager.connect().then(currentUser => {
      currentUser.createRoom({
        name: roomname,
        private: true,
        addUserIds: [this.state.username, item.item.login.username]
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
    console.log('BEGIN RETRIEVE ROOMS');
    // This will create a `tokenProvider` object. This object will be later used to make a Chatkit Manager instance.
    const tokenProvider = new Chatkit.TokenProvider({
      url: CHATKIT_TOKEN_PROVIDER_ENDPOINT
    });

    // This will instantiate a `chatManager` object. This object can be used to subscribe to any number of rooms and users and corresponding messages.
    // For the purpose of this example we will use single room-user pair.
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: CHATKIT_INSTANCE_LOCATOR,
      userId: this.state.username,
      tokenProvider: tokenProvider
    });

    const roomname = item.item.login.username + '-' + this.state.username;
    console.log(roomname);
    chatManager.connect()
      .then(currentUser => {
        var rooms = currentUser.rooms.filter(e => e.name == roomname);
        if (rooms.length != 0) { //exist roomname
          this.goToChatScreen(rooms[0]);
        } else {
          // check inver_roomname
          console.log('INVERT ROOM NAME');
          const invert_roomname = this.state.username + '-' + item.item.login.username;
          rooms = currentUser.rooms.filter(e => e.name == invert_roomname);
          console.log(rooms);
          if (rooms.length != 0) {
            this.goToChatScreen(rooms[0]);
          } else {
            console.log('Create room: ', invert_roomname);
            this.createRoom(item, invert_roomname);
          }
        }
      })
      .catch(err => {
        console.log('Error on connection', err)
      });
  }

  onChatOneToOne(item) {
    const retrieveRooms = () => this.retrieveRooms(item);
    //1. check the friend existing
    const code = 0;
    axios.post('http://localhost:4000/check/user', {
      "name": item.item.login.username,
      "id": item.item.login.username,
      "avatar": item.item.picture.thumbnail
    })
      .then(function (response) {
        //2. check the room existing
        if (response.status == 200) {
          console.log(response.status);
          retrieveRooms();
        } else {
          console.log('Friend dont exist');
        }
      })
      .catch(function (error) {
        console.log('Cant check friend existing');
      });
  }

  goToChatScreen(room) {

    this.props.dispatch({ type: "GOTO_CHAT", data: { "username": this.state.username, "roomid": room.id } })
  }

  listItem(item) {
    return (
      <View style={styles.viewItem}>
        <TouchableOpacity onPress={() => this.onChatOneToOne(item)} style={styles.touchItem}>
          <Image source={{ uri: item.item.picture.thumbnail }} style={styles.avatar} />
          <Text style={styles.personname}>{item.item.name.first}</Text>
          <Image source={require('@assets/images/wave.png')} style={styles.wave} />
        </TouchableOpacity>

      </View>
    )
  }

  render() {
    return (
      <View style={BottomScreenStyles.container}>
        {this.state.people != [] ?
          <FlatList
            data={this.state.people}
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

  },
  touchItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 10
  },
  personname: {
    marginLeft: 5
  },
  wave: {
    width: 40,
    height: 40,
    position: 'absolute',
    right: 10
  }
})

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(ActiveScreen);

