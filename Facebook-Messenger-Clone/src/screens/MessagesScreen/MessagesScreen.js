import React, { Component } from 'react';
import {View, Text, AsyncStorage, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import Chatkit from "@pusher/chatkit";
import { SECRET_KEY, CHATKIT_TOKEN_PROVIDER_ENDPOINT, CHATKIT_INSTANCE_LOCATOR } from '@config/chatConfig';

class MessagesScreen extends Component {
    state = { 
        username: '',
        rooms: []
     }

    _retrieveData = async () => {
    try {
        const value = await AsyncStorage.getItem('username');
        if (value != null) {
            // We have data!!
            await this.setState({username: value});
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    _retrieveRooms(){
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
        chatManager.connect()
        .then(currentUser => {
            this.setState({rooms: currentUser.rooms});
        })
        .catch(err => {
            console.log('Error on connection', err)
        })
    }

    onRetrieveRooms = async() => {
        await this._retrieveData();
        await this._retrieveRooms();
    }

    componentDidMount(){
        this.onRetrieveRooms();
    }

    onGoToChatScreen(room){
        this.props.dispatch({type: "GOTO_CHAT", data: {"username": this.state.username, "roomid": room}});
    }

    listItem(item){
        roomid = item.item.id;
        return (
            <View style={styles.viewItem}>
                <TouchableOpacity onPress={() => this.onGoToChatScreen(roomid)} style={styles.touchItem}>
                    <Text style={styles.personname}>{'RoomName: ' + item.item.name}</Text>
                    <Text style={styles.personname}>{'RoomID: ' + item.item.id}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <FlatList
                    data={this.state.rooms}
                    renderItem={(item) => this.listItem(item)}
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

export default connect()(MessagesScreen);