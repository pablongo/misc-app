import React, { useContext, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Alert,
  Dimensions,
  View,
} from 'react-native';
import Divider from '../../components/divider';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import ImglaurelGaming from '../../assets/laurel-gaming.svg'
import ImgFB from '../../assets/fb.svg'
import ImgGoogle from '../../assets/google.svg'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import client from '../../../client';
import CustomButton from '../../components/customButton';
import { saveTokenPhonebyUser, storeData } from '../../utils';
import { AuthContext } from '../../routes';
import messaging from '@react-native-firebase/messaging';
import { setUserData } from '../../utils/Amplitude';
const windowHeight = Dimensions.get('window').height;
const heightQuestion = windowHeight - 580;

const Login: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
  const [disabled, setDisabled] = useState(false);
  const [loadingFb, setLoadingFb] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const { signIn } = useContext<any>(AuthContext);

  const googleSignIn = async () => {
    try {
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      // Sign-in the user with the credential
      return await auth().signInWithCredential(googleCredential);
    } catch (error) {
      setDisabled(false);
      setLoadingGoogle(false);
    }
  };

  const onGoogleButtonPress = async () => {
    try {
      setDisabled(true);
      setLoadingGoogle(true);
      const response: any = await googleSignIn();
      const { data: { authToken } } = await client.post('/api/auth/loginSocial', {
        uid: response.user.uid,
      });
      await storeData(authToken, 'userToken');
      const user = await client.get('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      await storeData(user.data, 'user');
      setUserData(user.data);
      messaging()
        .getToken()
        .then(tokenPhone => saveTokenPhonebyUser(tokenPhone));
      setDisabled(false);
      setLoadingGoogle(false);
      signIn({ isLogged: true, loading: true, loginType: 'google' });
    } catch (error: any) {
      if (error?.response) {
        const { data } = error?.response;
        if (data?.msg && Array.isArray(data?.msg)) {
          Alert.alert(
            "Ops...",
            JSON.stringify(data.msg[0]),
            [
              { text: "Aceptar" }
            ]
          );
        }
      }
      setDisabled(false);
      setLoadingGoogle(false);
    }
  };

  const onFacebookButtonPress = async () => {
    try {
      setDisabled(true);
      setLoadingFb(true);
      // Attempt login with permissions
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

      if (result.isCancelled) {
        setDisabled(false);
        setLoadingFb(false);
        throw 'User cancelled the login process';
      }

      // Once signed in, get the users AccesToken
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        setDisabled(false);
        setLoadingFb(false);
        throw 'Something went wrong obtaining access token';
      }

      // Create a Firebase credential with the AccessToken
      const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

      // Sign-in the user with the credential
      const response: any = await auth().signInWithCredential(facebookCredential);
      const { data: { authToken } } = await client.post('/api/auth/loginSocial', {
        uid: response.user.uid,
      });
      await storeData(authToken, 'userToken');
      const user = await client.get('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      await storeData(user.data, 'user');
      setUserData(user.data);
      messaging()
        .getToken()
        .then(tokenPhone => saveTokenPhonebyUser(tokenPhone));
      setDisabled(false);
      setLoadingFb(false);
      signIn({ isLogged: true, loading: true, loginType: 'facebook' });
    } catch (error: any) {
      const { data } = error.response;
      if (data.msg && Array.isArray(data.msg)) {
        Alert.alert(
          "Ops...",
          JSON.stringify(data.msg[0]),
          [
            { text: "Aceptar" }
          ]
        );
      }
      setDisabled(false);
      setLoadingFb(false);
    }
  };

  const onManualButtonPress = () => {
    navigation.navigate(
      'LoginManual',
    );
  };

  return (
    <SafeAreaView style={styles.signUpView}>
      <View style={styles.logo}>
        <ImglaurelGaming width={190} height={69} />
      </View>
      <CustomButton
        disabled={disabled}
        onPress={onManualButtonPress}
        style={styles.signUpButton}>
        <Text style={styles.signUpButtonText}>Iniciar sesión con email</Text>
      </CustomButton>
      <Divider style={styles.divider} text='o' backgroundColor='#0CC482' />
      <CustomButton
        loading={loadingGoogle}
        disabled={disabled}
        onPress={onGoogleButtonPress}
        style={styles.signUpButtonSocial}>
        <View style={styles.google}>
          <ImgGoogle width={16} height={17} />
        </View>
        <Text style={styles.signUpButtonText}>Iniciar sesión con Google</Text>
      </CustomButton>
      <CustomButton
        loading={loadingFb}
        disabled={disabled}
        onPress={onFacebookButtonPress}
        style={styles.signUpButtonSocial}>
        <View style={styles.fb}>
          <ImgFB width={19} height={19} />
        </View>
        <Text style={styles.signUpButtonText}>Iniciar sesión con Facebook</Text>
      </CustomButton>
      <Text style={styles.noAccountText}>
        ¿No tiene una cuenta? <Text onPress={() => navigation.navigate('SignUp')} style={styles.signUpText}>Regístrese</Text>
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    marginTop: 100,
    marginBottom: 50,
  },
  fb: {
    marginRight: 5,
  },
  google: {
    marginRight: 5,
  },
  divider: {
    marginBottom: 20,
  },
  signUpButton: {
    backgroundColor: '#0CC482',
    borderRadius: 100,
    padding: 10,
    width: 332,
    height: 51,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpButtonSocial: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderRadius: 100,
    padding: 10,
    width: 332,
    height: 51,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpButtonText: {
    fontWeight: 'bold',
    fontFamily: 'Apercu Pro',
    fontSize: 14,
    fontStyle: 'normal',
    color: '#00443B'
  },
  recoverPasswordText: {
    fontFamily: 'Apercu Pro',
    marginTop: 6,
    marginBottom: 20,
    fontSize: 12,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  loginText: {
    fontFamily: 'Apercu Pro',
    marginTop: 6,
    marginBottom: 20,
    fontSize: 15,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  noAccountText: {
    fontFamily: 'Apercu Pro',
    marginTop: heightQuestion,
    fontSize: 15,
    color: '#FFFFFF',
  },
  signUpText: {
    fontFamily: 'Apercu Pro',
    marginTop: 6,
    marginBottom: 20,
    fontSize: 15,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  signUpView: {
    flex: 1,
    padding: 21,
    backgroundColor: '#00443B',
    alignItems: 'center',
  },
});

export default Login;
