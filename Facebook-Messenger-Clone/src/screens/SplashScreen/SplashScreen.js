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
        this.state = { username: 'heavycat176', avatar: '', continue: false };
      }

    componentDidMount(){
        console.log(users.results.slice(0, 10));
    }
    goToMainScreen(){
        const { navigation } = this.props;
        navigation.navigate('MainScreen');
    }
    onCreateUser = async () => {
        try{
            const user = users.results.slice(0, 10).filter(user => user.login.username == this.state.username)[0];
            if(user != null){
                //create this user in pusher server
                console.log('Have user');
                const flag = await this.postCreateUser(user);
                if(await this.storeData(user)){
                    this.setState({continue: true});
                }
            }
            return false;
        }catch(e){
            return false;
            console.log(e);
        }
    }
    storeData = async (user) => {
        try {
            await AsyncStorage.setItem('username', this.state.username);
            await AsyncStorage.setItem('avatar', user.picture.thumbnail);
            return true;
        } catch (error) {
            console.log('Cannot save user into AsyncStorage');
            return false;
        }
    }

    postCreateUser = (user) => {
        axios.post('http://localhost:4000/create/user', {
            "name": this.state.username,"id": this.state.username, "avatar": user.picture.thumbnail
            })
            .then(function (response) {
                if(response.status == 200){
                    console.log('Create user successfully');
                }
            })
            .catch(function (error) {
                console.log('Cant create user');
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={{width: 200, height: 40, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(username) => this.setState({username})}
                    value={this.state.username}
                    placeholder={'username'}
                    autoCapitalize = 'none'
                />
                {this.state.continue == true ? <Button raised color="#0084ff" onPress={() => this.goToMainScreen()}>
                    <Text>CONTINUE AS USER</Text>
                </Button> : <View></View>}
                {this.state.continue == false ? <Button raised color="#0084ff" onPress={this.onCreateUser}>
                    <Text>CREATE USER</Text>
                </Button> : <View></View>}
            </View>
        );
    }
}


const mapStateToProps = state => ({
    nav: state.nav,
  });
  
  export default connect(mapStateToProps)(SplashScreen)