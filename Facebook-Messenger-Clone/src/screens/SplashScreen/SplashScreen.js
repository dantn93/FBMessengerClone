import React, { Component } from 'react';
import { View, TextInput, AsyncStorage, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { connect } from 'react-redux';
import { users } from '@assets/fake_data';
import { SECRET_KEY, CHATKIT_TOKEN_PROVIDER_ENDPOINT, CHATKIT_INSTANCE_LOCATOR } from '@config/chatConfig';
import axios from 'axios';
import RNAccountKit, { LoginButton, Color, StatusBarStyle } from 'react-native-facebook-account-kit';

class SplashScreen extends Component {
    state = {
        authToken: null,
        loggedAccount: null,
    }
    componentWillMount() {
        this.configureAccountKit()

        RNAccountKit.getCurrentAccessToken()
            .then(token => {
                if (token) {
                    RNAccountKit.getCurrentAccount().then(account => {
                        this.setState({
                            authToken: token,
                            loggedAccount: account,
                        })
                    })
                } else {
                    console.log('No user account logged')
                }
            })
            .catch(e => console.log('Failed to get current access token', e))
    }

    configureAccountKit() {
        RNAccountKit.configure({
            theme: {
                //backgroundColor:       Color.rgba(0,120,0,0.1),
                //buttonBackgroundColor: Color.rgba(0, 153, 0, 1.00),
                //buttonDisabledBackgroundColor: Color.rgba(100, 153, 0, 0.5),
                //buttonBorderColor:     Color.rgba(0,255,0,1),
                //buttonTextColor:       Color.rgba(0,255,0,1),
                //headerBackgroundColor: Color.rgba(0, 153, 0, 1.00),
                //headerTextColor:       Color.rgba(0,255,0,1),
                //headerButtonTextColor: Color.rgba(0,255,0,1),
                //iconColor:             Color.rgba(0,255,0,1),
                //inputBackgroundColor:  Color.rgba(0,255,0,1),
                //inputBorderColor:      Color.hex('#ccc'),
                //inputTextColor:        Color.hex('#0f0'),
                //textColor:             Color.hex('#0f0'),
                //titleColor:            Color.hex('#0f0'),
                //backgroundImage:       "background.png",
                //statusBarStyle:        StatusBarStyle.LightContent,
            },
            //countryWhitelist: [ "AR", "BR", "US" ],
            //countryBlacklist: [ "BR" ],
            //defaultCountry: "AR"
            initialEmail: 'mocnhantrang@gmail.com',
            initialPhoneCountryPrefix: '+84',
            initialPhoneNumber: '1292849917',
        })
    }

    storeData = async (user) => {
        try {
            await AsyncStorage.setItem('email', user.email);
            await AsyncStorage.setItem('id', user.id);
            return true;
        } catch (error) {
            return false;
        }
    }

    goToMainScreen(){
        const { navigation } = this.props;
        navigation.navigate('MainScreen');
    }

    postCreateUser = async (user) => {
        const flag = false;
        await axios.post('http://localhost:5000/api/chats/createuser', {
            "email": user.email, "id": user.id
        })
            .then(function (response) {
                if (response.data.success) {
                    flag = true
                }
            })
            .catch(function (error) {
                console.log('Cant create user');
            });
        //save email and id into AsyncStore
        if(flag){
            return await this.storeData(user);
        }
    }

    onLogin(token) {
        if (!token) {
            console.warn('User canceled login')
            this.setState({})
        } else {
            RNAccountKit.getCurrentAccount().then(account => {
                //1. send request to loopback and create user
                console.log('//== ACCOUNT ==//')
                const flag = this.postCreateUser(account);
                if(flag){
                    this.setState({
                        authToken: token,
                        loggedAccount: account,
                    })
                }
                //2. if chatkit has this user, go to main screen
                // if not, create user and go to main screen
            })
        }
    }

    onLoginError(e) {
        console.log('Failed to login', e)
    }

    onEmailLoginPressed() {
        RNAccountKit.loginWithEmail()
            .then(token => {
                this.onLogin(token)
            })
            .catch(e => this.onLoginError(e))
    }

    onLogoutPressed() {
        RNAccountKit.logout()
            .then(() => {
                this.setState({
                    authToken: null,
                    loggedAccount: null,
                })
            })
            .catch(e => console.log('Failed to logout'))
    }

    renderUserLogged() {
        const { id, email, phoneNumber } = this.state.loggedAccount

        return (
            <View>
                <TouchableOpacity style={styles.button} onPress={() => this.onLogoutPressed()}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>

                <Text style={styles.label}>Account Kit Id</Text>
                <Text style={styles.text}>{id}</Text>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.text}>{email}</Text>
                <Text style={styles.label}>Phone Number</Text>
                <Text style={styles.text}>{phoneNumber ? `${phoneNumber.countryCode} ${phoneNumber.number}` : ''}</Text>
            </View>
        )
    }

    renderLogin() {
        return (
            <View>
                <LoginButton
                    style={styles.button}
                    type="phone"
                    onLogin={token => this.onLogin(token)}
                    onError={e => this.onLogin(e)}
                >
                    <Text style={styles.buttonText}>SMS</Text>
                </LoginButton>

                <TouchableOpacity style={styles.button} onPress={() => this.onEmailLoginPressed()}>
                    <Text style={styles.buttonText}>Email</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>{this.state.loggedAccount ? this.goToMainScreen() : this.renderLogin()}</View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    button: {
        height: 50,
        width: 300,
        backgroundColor: 'aqua',
        marginBottom: 10,
    },
    buttonText: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    label: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 20,
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
})


const mapStateToProps = state => ({
    nav: state.nav,
});

export default connect(mapStateToProps)(SplashScreen)