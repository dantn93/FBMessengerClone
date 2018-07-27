import React, { Component } from 'react';
import { View, TextInput, AsyncStorage, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { connect } from 'react-redux';
import { users } from '@assets/fake_data';
import { SECRET_KEY, CHATKIT_TOKEN_PROVIDER_ENDPOINT, CHATKIT_INSTANCE_LOCATOR } from '@config/chatConfig';
import axios from 'axios';
import styles from './styles';


class SplashScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { username: '', uuid: ''};
      }

    componentDidMount(){
        console.log(users.results.slice(0, 2));
    }
    onPress = () => {
        if(this.getUUID()){
            const { navigation } = this.props;
            navigation.navigate('MainScreen');
        }
        
    }
    goToChat = () => {
        const { navigation } = this.props;
        navigation.navigate('ChatScreen');
    }

    getUUID(){
        try{
            const uuid = users.results.slice(0, 2).filter(user => user.login.username == this.state.username)[0].login.uuid;
            if(uuid != null){
                this._storeData();
                return true;
            }
            return false;
        }catch(e){

        }
    }
    _storeData = async () => {
    try {
        await AsyncStorage.setItem('username', this.state.username);
    } catch (error) {
        // Error saving data
    }
    }

    onCreateUser = () => {
        axios.post('http://localhost:4000/create/user', {
            "name": this.state.username,"id": this.state.username
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={{width: 200, height: 40, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(username) => this.setState({username})}
                    value={this.state.text}
                    placeholder={'username'}
                    autoCapitalize = 'none'
                />
                <Button raised color="#0084ff" onPress={this.onPress}>
                    <Text>CONTINUE AS USER</Text>
                </Button>
                <Button raised color="#0084ff" onPress={this.onCreateUser}>
                    <Text>CREATE USER</Text>
                </Button>

                {/* <Button raised color="red" onPress={() => {this.props.dispatch({type: "TEST"})}}>
                    GO TO CHAT SCREEN
                </Button> */}
            </View>
        );
    }
}


const mapStateToProps = state => ({
    nav: state.nav,
  });
  
  export default connect(mapStateToProps)(SplashScreen)