/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Routes from './src/routes';
import { Provider } from "react-redux"
import getStore from './src/store';
import { init } from './src/utils/Amplitude';
import messaging from '@react-native-firebase/messaging';
import { LogBox } from 'react-native';


const store = getStore()

GoogleSignin.configure({
  // scopes: ["https://www.googleapis.com/auth/userinfo.profile"],
  webClientId: '366128151659-kl0d9ctmme4had9aoee3tum7rn6pjdjq.apps.googleusercontent.com',
  iosClientId: '366128151659-bpmoeedkdbvcbauj3e9v2h4f41umgk1o.apps.googleusercontent.com'
});

const App = () => {
  LogBox.ignoreLogs(['new NativeEventEmitter']);
  useEffect(() => {
    const requestUserPermission = async () => {
      await messaging().requestPermission();
    }

    requestUserPermission();
    init();
  }, []);

  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  )
};

export default App;
