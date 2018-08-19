import React, { Component } from 'react';
import { View, Text, AsyncStorage, FlatList, StyleSheet, TouchableOpacity, SectionList } from 'react-native';
import { connect } from 'react-redux';
import Chatkit from "@pusher/chatkit";
import { SECRET_KEY, CHATKIT_TOKEN_PROVIDER_ENDPOINT, CHATKIT_INSTANCE_LOCATOR, NUMBER_OF_ROOMS } from '@config';
import axios from 'axios';


class MessagesScreen extends Component {
  state = {
    rooms: []
  }
  
  id = null;
  name = null;

  componentWillUnmount(){
    AsyncStorage.setItem('rooms', JSON.stringify(this.state.rooms));
  }

  //get username and avatar in AsyncStorage
  retrieveData = async () => {
    try {
      const id = await AsyncStorage.getItem('id');
      console.log(id);
      const name = await AsyncStorage.getItem('name');
      if (id != null && name != null) {
        this.id = id;
        this.name = name;
      }
      
    } catch (error) {
      console.log('Load data from Asyncstorage: ', error.message);
    }
  }

  retrieveRooms = () => {
    // This will create a `tokenProvider` object. This object will be later used to make a Chatkit Manager instance.
    const tokenProvider = new Chatkit.TokenProvider({
      url: CHATKIT_TOKEN_PROVIDER_ENDPOINT
    });

    // This will instantiate a `chatManager` object. This object can be used to subscribe to any number of rooms and users and corresponding messages.
    // For the purpose of this example we will use single room-user pair.
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: CHATKIT_INSTANCE_LOCATOR,
      userId: this.id,
      tokenProvider: tokenProvider
    })

    chatManager.connect()
      .then(currentUser => {
        var rooms = currentUser.rooms;
        rooms = rooms.map(room => {
          var count = 0;
          const r = {RoomIndex: count, ...room};
          count++;
          return r;
        })
        this.setState({ rooms });
      })
      .catch(err => {
        console.log('Error: ', err.message);
      })
  }

  onRetrieveRooms = async () => {
    await this.retrieveData();
    //get rooms on server and update it
    await this.retrieveRooms();
  }

  componentDidMount() {
    this.onRetrieveRooms();
  }

  onGoToChatScreen(room) {
    this.props.dispatch({ type: "GOTO_CHAT", data: { "id": this.id, "roomid": room.id } });
  }

  listItem(room) {
    const testid = "RoomIndex" + room.RoomIndex;
    return (
      <View testID={testid} style={styles.viewItem} >
        <TouchableOpacity onPress={() => this.onGoToChatScreen(room)} style={styles.touchItem}>
          <Text>{room.id}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <View testID="MessagesScreen" style={{ flex: 1 }}>
        <FlatList testID="FlatList"
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