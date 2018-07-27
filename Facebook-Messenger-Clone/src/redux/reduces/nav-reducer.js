// Don't forget to check the complete code here ---> https://github.com/shubhnik/redux-react-navigation/tree/authFlow
import { NavigationActions } from "react-navigation";
// AppNavigator is the one defined in the start of PART-2 of this blog --> https://medium.com/@shubhnik/a-comprehensive-guide-for-integrating-react-navigation-with-redux-including-authentication-flow-cb7b90611adf
import { MessengerApp } from '../../navigation/MessengerApp';
const SplashAction = MessengerApp.router.getActionForPathAndParams("SplashScreen");

const initialNavState = MessengerApp.router.getStateForAction(
    SplashAction
  );

const navigationReducer = (state = initialNavState, action) => {
    let nextState;
    switch (action.type) {
        case 'GOTO_CHAT':
            nextState = MessengerApp.router.getStateForAction(
            NavigationActions.navigate({routeName: 'ChatScreen', params: {
                "username": action.data.username,
                "roomid": action.data.roomid
            }}),
            state );
            break;
        case 'GO_BACK':
            nextState = MessengerApp.router.getStateForAction(
            NavigationActions.back(),
            state );
            break;
        default:
            nextState = MessengerApp.router.getStateForAction(action, state);
    }
    return nextState || state;
};

export default navigationReducer;