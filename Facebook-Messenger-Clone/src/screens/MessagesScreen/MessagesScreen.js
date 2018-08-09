import React, { Component } from 'react';
import { View, Text, AsyncStorage, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Chatkit from "@pusher/chatkit";
import { SECRET_KEY, CHATKIT_TOKEN_PROVIDER_ENDPOINT, CHATKIT_INSTANCE_LOCATOR } from '@config/chatConfig';
import axios from 'axios';


class MessagesScreen extends Component {
  state = {
    name: '',
    id: '',
    rooms: []
  }

  //get username and avatar in AsyncStorage
  retrieveData = async () => {
    try {
      const id = await AsyncStorage.getItem('id');
      const name = await AsyncStorage.getItem('name');
      if (id != null && name != null) {
        // We have data!!
        this.setState({ name, id });
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  retrieveRooms() {
    // This will create a `tokenProvider` object. This object will be later used to make a Chatkit Manager instance.
    const tokenProvider = new Chatkit.TokenProvider({
      url: CHATKIT_TOKEN_PROVIDER_ENDPOINT
    });

    // This will instantiate a `chatManager` object. This object can be used to subscribe to any number of rooms and users and corresponding messages.
    // For the purpose of this example we will use single room-user pair.
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: CHATKIT_INSTANCE_LOCATOR,
      userId: this.state.id,
      tokenProvider: tokenProvider
    })

    chatManager.connect()
      .then(currentUser => {
        const rooms = currentUser.rooms;
        if (rooms.length != 0){
          this.setState({ rooms });
        }
      })
      .catch(err => {
        console.log('Error on connection');
      })
  }

  onRetrieveRooms = async () => {
    await this.retrieveData();
    // console.log(this.state);
    await this.retrieveRooms();
  }

  componentDidMount() {
    this.onRetrieveRooms();
  }

  onGoToChatScreen(room) {
    this.props.dispatch({ type: "GOTO_CHAT", data: { "id": this.state.id, "roomid": room.id } });
  }

  listItem(room) {
    return (
      <View style={styles.viewItem}>
        <TouchableOpacity onPress={() => this.onGoToChatScreen(room)} style={styles.touchItem}>
          <Text>{room.id}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.state.rooms}
          renderItem={(item) => this.listItem(item.item)}
          keyExtractor={(item, index) => index.toString()}
        />
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

export default connect()(MessagesScreen);