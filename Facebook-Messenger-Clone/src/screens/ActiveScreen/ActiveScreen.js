import React, { Component } from 'react';
import {View, Text, FlatList, Image, TouchableOpacity, StyleSheet, AsyncStorage} from 'react-native';
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
    }

    _retrieveData = async () => {
        try {
          const value = await AsyncStorage.getItem('username');
          if (value != null) {
            // We have data!!
            await this.setState({username: value});
          }
         } catch (error) {
           // Error retrieving data
         }
      }
    getFakeData = async () => {
        await this._retrieveData();
        const friends = users.results.slice(0, 2).filter(user => user.login.username != this.state.username);
        await this.setState({people: friends});
    }
    componentDidMount(){
        this.getFakeData();
    }

    createRoom(item){
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
            name: this.state.username + '-' + item.item.login.username,
            private: true,
            addUserIds: [this.state.username, item.item.login.username]
          }).then(room => {
            console.log(`Created room called ${room.name}`)
            this.onGoToChatScreen(item, room);
          })
          .catch(err => {
            console.log(`Error creating room ${err}`)
          })
      });
    }

    onGoToChatScreen(item, room){
        const username = this.state.username;
        this.props.dispatch({type: "GOTO_CHAT", data: {"username": this.state.username, "roomid": room.id}});
    }

    listItem(item){
        return (
            <View style={styles.viewItem}>
                <TouchableOpacity onPress={()=>this.createRoom(item)} style={styles.touchItem}>
                    <Image source={{uri: item.item.picture.thumbnail}} style={styles.avatar}/>
                    <Text style={styles.personname}>{item.item.name.first}</Text>
                    <Image source={require('@assets/images/wave.png')} style={styles.wave}/>
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
        // backgroundColor: 'gray',
        
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

