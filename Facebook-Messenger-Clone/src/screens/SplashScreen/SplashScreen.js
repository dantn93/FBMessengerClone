import React, { Component } from 'react';
import { View, TextInput, AsyncStorage, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { connect } from 'react-redux';
import { SECRET_KEY, CHATKIT_TOKEN_PROVIDER_ENDPOINT, CHATKIT_INSTANCE_LOCATOR } from '@config';
import axios from 'axios';
import RNAccountKit, { LoginButton, Color, StatusBarStyle } from 'react-native-facebook-account-kit';
import { SERVER_URL, ACCOUNT_KIT } from '@config';
import Config from 'react-native-config';

class SplashScreen extends Component {    
    state = {
        authToken: null,
        loggedAccount: null
    }

    componentDidMount() {
        this.configureAccountKit()

        RNAccountKit.getCurrentAccessToken()
            .then(token => {
                if (token) {
                    RNAccountKit.getCurrentAccount().then(account => {
                        const flag = this.postCreateUser(account);
                        if (flag) {
                            this.setState({
                                authToken: token,
                                loggedAccount: account,
                            })
                        }
                    })
                } else {
                    console.log('No user account logged')
                }
            })
            .catch(e => console.log('Failed to get current access token', e))
    }

    //initial account kit configuration
    configureAccountKit() {
        const {INITIAL_EMAIL, INITIAL_PHONE_COUNTRY, INITIAL_PHONE_NUMBER} = ACCOUNT_KIT;
        RNAccountKit.configure({
            initialEmail: INITIAL_EMAIL,
            initialPhoneCountryPrefix: INITIAL_PHONE_COUNTRY,
            initialPhoneNumber: INITIAL_PHONE_NUMBER,
        })
    }

    //phone number has a country code
    getPhoneNumber(phoneNumber){
        return phoneNumber.countryCode + '-' + phoneNumber.number
    }

    //store data into asyncstorage
    storeData = async (user) => {
        const name = user.phoneNumber ? this.getPhoneNumber(user.phoneNumber) : user.email;
        try {
            await AsyncStorage.setItem('name', name);
            await AsyncStorage.setItem('id', user.id);
            return true;
        } catch (error) {
            return false;
        }
    }

    goToMainScreen() {
        const { navigation } = this.props;
        navigation.navigate('MainScreen');
    }

    //send request to create user
    postCreateUser = async (user) => {
        const name = user.phoneNumber ? this.getPhoneNumber(user.phoneNumber) : user.email
        var flag = false;
        await axios.post(SERVER_URL + 'chats/createuser', {
            "name": name, "id": user.id
        })
        .then(function (response) {
            if (response.data.success) {
                flag = true
            }
        })
        .catch(function (error) {
            console.log('Cant create user: ', error.message);
        });
        //save email and id into AsyncStore
        if (flag) {
            return await this.storeData(user);
        }
    }

    onLogin(token) {
        if (!token) {
            console.log('User canceled login')
            this.setState({})
        } else {
            RNAccountKit.getCurrentAccount().then(account => {
                //1. send request to loopback and create user
                const flag = this.postCreateUser(account);
                if (flag) {
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
                console.log(token);
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
            <View >
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
            <View >
                <LoginButton
                    style={styles.button}
                    type="phone"
                    onLogin={token => this.onLogin(token)}
                    onError={e => this.onLogin(e)}
                >
                    <Text style={styles.buttonText}>SMS</Text>
                </LoginButton>

                <TouchableOpacity testID="EmailTap" style={styles.button} onPress={() => this.onEmailLoginPressed()}>
                    <Text style={styles.buttonText}>Email</Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderMain() {
        return (
            <View testID="Splash">
                <TouchableOpacity testID="GoToMain" onPress={() => this.goToMainScreen()}>
                    <Text style={{ backgroundColor: 'red' }}>Go to Main Screen</Text>
                </TouchableOpacity>
                <TouchableOpacity testID="LogOut" onPress={() => this.onLogoutPressed()} style={{ marginTop: 30 }}>
                    <Text style={{ backgroundColor: 'blue' }}>Log out</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <View testID="LoginView"  style={styles.container}>{this.state.loggedAccount ? this.renderMain() : this.renderLogin()}</View>
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