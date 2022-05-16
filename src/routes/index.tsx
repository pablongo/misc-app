import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { Platform, StatusBar } from 'react-native';
import Login from '../screens/login';
import SignUp from '../screens/signUp';
import SignUpManual from '../screens/signUp/Manual';
import LoginManual from '../screens/login/Manual';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LegalRequirements from '../screens/signUp/legalRequirements';
import Restriction from '../screens/signUp/legalRequirements/Restriction';
import Splash from '../screens/splash';
import Social from '../screens/signUp/Social';
import RecoverPassword from '../screens/recoverPassword';
import SendMailPassword from '../screens/recoverPassword/SendMailPassword';
import NewPassword from '../screens/recoverPassword/NewPassword';
import Succesfully from '../screens/recoverPassword/Successfully';
import VerificationPhone from '../screens/signUp/VerificationPhone';
import client from '../../client';
import Dashboard from '../screens/dashboard';
import { getData, storeData, refreshTokenPhone, saveTokenPhonebyUser, } from '../utils';
import Preguntados from '../screens/games/preguntados';
import Categories from '../screens/games/preguntados/Categories';
import QuestionsGame from '../screens/games/preguntados/game';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import ContactsList from '../screens/contacts';
import AppShare from '../screens/appShare';
import BetTypes from '../screens/bet/BetTypes';
import EconomicBet from '../screens/bet/EconomicBet';
import OtherBet from '../screens/bet/OtherBet';
import RestaurantBet from '../screens/bet/RestaurantBet';
import LoadGamematch from '../screens/games/preguntados/LoadGamematch';
import SelectFriends from '../screens/games/SelectFriends';
import Victory from '../screens/games/transversal/Victory';
import messaging from '@react-native-firebase/messaging';
import ModalPushNotification from '../components/modalPushNotification';
import notifee, { EventType } from '@notifee/react-native';
import FriendDetails from '../components/friendDetails/index';
import GamesBox from '../components/gamesBox/index';
import CustomChallenge from '../components/customChallenge/index'
import DeleteAccount from '../screens/deleteAccount';
import PersonalInformation from '../screens/personalInformation';
import CustomChallengePage from '../screens/games/customChallenge';
import ChangePassword from '../screens/changePassword';
import HelpComponent from '../screens/helpComponent';
import MusicAndNotifications from '../screens/musicAndNotifications'
import { setUserData } from '../utils/Amplitude';
import SendComment from '../screens/deleteAccount/SendComment';
import Received from '../screens/deleteAccount/Received';
import StepOfWelcome from '../screens/stepOfWelcome';

const Stack = createNativeStackNavigator();

const config = {
  screens: {
    NewPassword: {
      path: 'recoverPassword/:token',
    },
    LoadGamematch: {
      path: 'loadGamematch/:gamematchId'
    }
  }
}




const linking: any = {
  prefixes: ['http://www.laurelgaming.com/game', 'laurelgaming://'],
  config,
}

export const AuthContext = React.createContext('protectedRoute');

const Routes = () => {
  const [data, setData] = useState({});
  const [playerState, setPlayerState] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [stepOfWelcome, setStepOfWelcome] = useState(true);
  const navigationRef: any = useNavigationContainerRef();
  const [state, dispatch] = React.useReducer(
    (prevState: any, action: any) => {
      switch (action.type) {
        case 'SPLASH':
          return {
            ...prevState,
            loading: false,
          };
        case 'VERIFY_AUTH':
          return {
            ...prevState,
            isLogged: action.isLogged,
            loading: action.loading,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isLogged: action.isLogged,
            loading: action.loading,
            loginType: action.loginType,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isLogged: false,
            loginType: null,
          };
      }
    },
    {
      loading: true,
      isLogged: false,
      loginType: null,
    }
  );

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const _stepOfWelcome = await getData('stepOfWelcome');
        setStepOfWelcome(!Boolean(_stepOfWelcome));
        const token = await getData('userToken');
        const user = await client.get('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        await storeData(user.data, 'user');
        setUserData(user.data);
        //save token phone of push notifications by user
        messaging()
          .getToken()
          .then(tokenPhone => saveTokenPhonebyUser(tokenPhone));

        messaging().onNotificationOpenedApp(remoteMessage => {
          if (remoteMessage && remoteMessage.data) {
            const receivedFriendRequest = remoteMessage?.data?.type === "SEND_FRIEND_REQUEST";
            const acceptFriendRequest = remoteMessage?.data?.type === "ACCEPT_FRIEND_REQUEST";
            if (remoteMessage?.data?.type === "ROOM_NOTIFICATION") {
              setOpenModal(true);
              setData(remoteMessage.data);
            }
            if (receivedFriendRequest || acceptFriendRequest) {
              navigationRef.navigate('Amigos', {
                receivedFriendRequest,
                acceptFriendRequest
              });
            }
          }
        });

        messaging()
          .getInitialNotification()
          .then(remoteMessage => {
            if (remoteMessage && remoteMessage.data) {
              const receivedFriendRequest = remoteMessage?.data?.type === "SEND_FRIEND_REQUEST";
              const acceptFriendRequest = remoteMessage?.data?.type === "ACCEPT_FRIEND_REQUEST";
              if (remoteMessage?.data?.type === "ROOM_NOTIFICATION") {
                setOpenModal(true);
                setData(remoteMessage.data);
              }
              if (receivedFriendRequest || acceptFriendRequest) {
                if (navigationRef.isReady()) {
                  navigationRef.navigate('Amigos', {
                    receivedFriendRequest,
                    acceptFriendRequest
                  });
                }
              }
            }
          });

        dispatch({
          type: 'VERIFY_AUTH',
          isLogged: true,
          loading: true
        });

      } catch (error: any) {
        dispatch({
          type: 'VERIFY_AUTH',
          isLogged: false,
          loading: true
        });
      }
    };
    verifyAuth();
    const foregroundSubscriber = messaging().onMessage(async (remoteMessage) => {
      console.log("foregroundSubscriber: ", remoteMessage)
      if (remoteMessage.data) notifee.displayNotification(JSON.parse(remoteMessage?.data?.notifee));
      if (remoteMessage?.data?.type === "ROOM_NOTIFICATION") {
        setOpenModal(true);
        setData(remoteMessage.data);
      }
    });

    const notifeeForeground = notifee.onForegroundEvent(({ type, detail }) => {
      const receivedFriendRequest = detail.notification?.data?.type === "SEND_FRIEND_REQUEST";
      const acceptFriendRequest = detail.notification?.data?.type === "ACCEPT_FRIEND_REQUEST";
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          if (receivedFriendRequest || acceptFriendRequest) {
            navigationRef.navigate('Amigos', {
              receivedFriendRequest,
              acceptFriendRequest
            });
          }
          break;
      }
    });

    return () => {
      // onTokenRefresh
      messaging().onTokenRefresh(token => {
        refreshTokenPhone(token);
      });
      foregroundSubscriber();
      notifeeForeground();
    }
  }, []);

  const authContext = useMemo<any>(
    () => ({
      signIn: async (data: any) => {
        dispatch({
          type: 'SIGN_IN',
          token: data.token,
          loading: true,
          loginType: data.loginType || null,
          isLogged: data.isLogged || false
        });
      },
      signOut: async () => {
        const user = await getData('user');
        if (user.loginType === 'google') {
          try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            dispatch({ type: 'SIGN_OUT' });
          } catch (error) {
            console.error(error);
          }
        } else {
          dispatch({ type: 'SIGN_OUT' });
        }
      },
      splash: () => dispatch({ type: 'SPLASH' })
    }),
    []
  );


  if (state && state.loading) return (
    <AuthContext.Provider value={authContext}>
      {Platform.OS === 'android' && <StatusBar backgroundColor={'#0CC482'} barStyle={'dark-content'}></StatusBar>}
      <Splash />
    </AuthContext.Provider>
  );

  if (state && state.isLogged) return (
    <AuthContext.Provider value={authContext}>
      {Platform.OS === 'android' && <StatusBar backgroundColor={'#FFFFFF'} barStyle={'dark-content'}></StatusBar>}
      <NavigationContainer ref={navigationRef} linking={linking}>
        <Stack.Navigator>
          {stepOfWelcome && (
            <Stack.Screen
              name="StepOfWelcome"
              options={{ headerShown: false }}
              component={StepOfWelcome}
            />
          )}
          <Stack.Screen
            name="Dashboard"
            options={{ headerShown: false }}
            component={Dashboard}
          />
          <Stack.Screen
            name="SendComment"
            options={{ headerShown: false }}
            component={SendComment}
          />
          <Stack.Screen
            name="Received"
            options={{ headerShown: false }}
            component={Received}
          />
          <Stack.Screen
            name="friendDetails"
            options={{ headerShown: false }}
            component={FriendDetails}
          />
          <Stack.Screen
            name="ChangePassword"
            options={{ headerShown: false }}
            component={ChangePassword}
          />
          <Stack.Screen
            name="Successfully"
            options={{ headerShown: false }}
            component={Succesfully}
          />
          <Stack.Screen
            name="custom-challenge"
            options={{ headerShown: false }}
            component={CustomChallenge}
          />
          <Stack.Screen
            name="custom-challenge-page"
            options={{ headerShown: false }}
            component={CustomChallengePage}
          />
          <Stack.Screen
            name="challengeFriend"
            options={{ headerShown: false }}
            component={GamesBox}
          />
          <Stack.Screen
            name="LoadGamematch"
            options={{ headerShown: false }}
            component={LoadGamematch}
          />
          <Stack.Screen
            name="Contacts"
            options={{ headerShown: false }}
            component={ContactsList}
          />
          <Stack.Screen
            name="Help"
            options={{ headerShown: false }}
            component={HelpComponent}
          />
          <Stack.Screen
            name="AppShare"
            options={{ headerShown: false }}
            component={AppShare}
          />
          <Stack.Screen
            name="Preguntados"
            options={{ headerShown: false, gestureEnabled: false }}
            component={Preguntados}
          />
          <Stack.Screen
            name="Preguntados-Categories"
            options={{ headerShown: false }}
            component={Categories}
          />
          <Stack.Screen
            name="Preguntados-Game"
            options={{ headerShown: false, gestureEnabled: false }}
            component={QuestionsGame}
          />
          <Stack.Screen
            name="Screen-Victory"
            options={{ headerShown: false }}
            component={Victory}
          />
          <Stack.Screen
            name="BET-TYPES"
            options={{ headerShown: false }}
            component={BetTypes}
          />
          <Stack.Screen
            name="BET-ECONOMIC-TYPE"
            options={{ headerShown: false }}
            component={EconomicBet}
          />
          <Stack.Screen
            name="BET-OTHER-TYPE"
            options={{ headerShown: false }}
            component={OtherBet}
          />
          <Stack.Screen
            name="BET-RESTAURANT-TYPE"
            options={{ headerShown: false }}
            component={RestaurantBet}
          />
          <Stack.Screen
            name="SelectFriends"
            options={{ headerShown: false }}
            component={SelectFriends}
          />
          <Stack.Screen
            name="PersonalInformation"
            options={{ headerShown: false }}
            component={PersonalInformation} />
          <Stack.Screen
            name="DeleteAccount"
            options={{ headerShown: false }}
            component={DeleteAccount} />
          <Stack.Screen
            name="MusicAndNotifications"
            options={{ headerShown: false }}
            component={MusicAndNotifications} />
        </Stack.Navigator>
      </NavigationContainer>
      {openModal && <ModalPushNotification
        data={data}
        setOpenModal={setOpenModal}
        navigation={navigationRef} />}
    </AuthContext.Provider>
  );

  return (
    <AuthContext.Provider value={authContext}>
      {Platform.OS === 'android' && <StatusBar backgroundColor={'#00443B'} barStyle={'dark-content'}></StatusBar>}
      <NavigationContainer linking={linking}>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
            component={Login}
          />
          <Stack.Screen
            name="Splash"
            options={{ headerShown: false }}
            component={Splash}
          />
          <Stack.Screen
            name="VerificationPhone"
            options={{ headerShown: false }}
            component={VerificationPhone}
          />
          <Stack.Screen
            name="NewPassword"
            options={{ headerShown: false }}
            component={NewPassword}
          />
          <Stack.Screen
            name="Successfully"
            options={{ headerShown: false }}
            component={Succesfully}
          />
          <Stack.Screen
            name="LoginManual"
            options={{ headerShown: false }}
            component={LoginManual}
          />
          <Stack.Screen
            name="RecoverPassword"
            options={{ headerShown: false }}
            component={RecoverPassword}
          />
          <Stack.Screen
            name="SendMailPassword"
            options={{ headerShown: false }}
            component={SendMailPassword}
          />
          <Stack.Screen
            name="SignUp"
            options={{ headerShown: false }}
            component={SignUp}
          />
          <Stack.Screen
            name="LegalRequirements"
            options={{ headerShown: false }}
            component={LegalRequirements}
          />
          <Stack.Screen
            name="Restriction"
            options={{ headerShown: false }}
            component={Restriction}
          />
          <Stack.Screen
            name="Manual"
            options={{ headerShown: false }}
            component={SignUpManual}
          />
          <Stack.Screen
            name="Social"
            options={{ headerShown: false }}
            component={Social}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default Routes;