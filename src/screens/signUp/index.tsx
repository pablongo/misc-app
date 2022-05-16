import React, { useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Dimensions,
} from 'react-native';
import Divider from '../../components/divider';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import ImglaurelGaming from '../../assets/laurel-gaming.svg'
import ImgFB from '../../assets/fb.svg'
import ImgGoogle from '../../assets/google.svg'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
const windowHeight = Dimensions.get('window').height;
const heightQuestion = windowHeight - 580;

const SignUp: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
  const { params } = route;
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const handleSignUpGoogle = async () => {
      try {
        setDisabled(true);
        // Get the users ID token
        const { idToken } = await GoogleSignin.signIn();

        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

        // Sign-in the user with the credential
        const response: any = await auth().signInWithCredential(googleCredential);
        const googleData = {
          data: {
            user: JSON.stringify({
              info: response.user,
              firstName: response.additionalUserInfo.profile.given_name,
              lastName: response.additionalUserInfo.profile.family_name
            }),
            loginType: 'google',
          },
          screen: 'Social'
        };
        setDisabled(false);
        navigation.navigate({
          name: 'VerificationPhone',
          params: googleData,
        });
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
      }
    }

    const handleSignUpFacebook = async () => {
      try {
        setDisabled(true);
        // Attempt login with permissions
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

        if (result.isCancelled) {
          throw 'User cancelled the login process';
        }

        // Once signed in, get the users AccesToken
        const data = await AccessToken.getCurrentAccessToken();

        if (!data) {
          throw 'Something went wrong obtaining access token';
        }

        // Create a Firebase credential with the AccessToken
        const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

        // Sign-in the user with the credential
        const response: any = await auth().signInWithCredential(facebookCredential);
        const fbData = {
          data: {
            user: JSON.stringify({
              info: response.user,
              firstName: response.additionalUserInfo.profile.first_name,
              lastName: response.additionalUserInfo.profile.last_name,
            }),
            loginType: 'facebook',
          },
          screen: 'Social'
        };
        setDisabled(false);
        navigation.navigate({
          name: 'VerificationPhone',
          params: fbData,
        });
      } catch (error) {
        console.log(error)
        setDisabled(false);
      }
    }
    if (params && params.loginType === 'facebook') handleSignUpFacebook();
    if (params && params.loginType === 'google') handleSignUpGoogle();
  }, [params]);

  const onGoogleButtonPress = () => {
    navigation.navigate(
      'LegalRequirements',
      {
        screen: 'SignUp',
        loginType: 'google'
      }
    );
  };

  const onFacebookButtonPress = () => {
    navigation.navigate(
      'LegalRequirements',
      {
        screen: 'SignUp',
        loginType: 'facebook'
      }
    );
  };

  const onManualButtonPress = () => {
    navigation.navigate(
      'LegalRequirements',
      {
        screen: 'Manual'
      }
    );
  };

  return (
    <SafeAreaView style={styles.signUpView}>
      <View style={styles.logo}>
        <ImglaurelGaming width={190} height={69} />
      </View>
      <TouchableOpacity
        disabled={disabled}
        onPress={onManualButtonPress}
        style={styles.signUpButton}>
        <Text style={styles.signUpButtonText}>Registrarse con email</Text>
      </TouchableOpacity>
      <Divider style={styles.divider} text='o' backgroundColor='#0CC482' />
      <TouchableOpacity
        disabled={disabled}
        onPress={onGoogleButtonPress}
        style={styles.signUpButtonSocial}>
        <View style={styles.google}>
          <ImgGoogle width={16} height={17} />
        </View>
        <Text style={styles.signUpButtonText}>Registrarse con Google</Text>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={disabled}
        onPress={onFacebookButtonPress}
        style={styles.signUpButtonSocial}>
        <View style={styles.fb}>
          <ImgFB width={19} height={19} />
        </View>
        <Text style={styles.signUpButtonText}>Registrarse con Facebook</Text>
      </TouchableOpacity>
      <Text style={styles.accountText}>
        ¿Ya tienes una cuenta? <Text onPress={() => navigation.navigate('Login')} style={styles.loginText}>Acceder</Text>
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
  accountText: {
    fontFamily: 'Apercu Pro',
    marginTop: heightQuestion,
    fontSize: 15,
    color: '#FFFFFF',
  },
  signUpView: {
    flex: 1,
    padding: 21,
    backgroundColor: '#00443B',
    alignItems: 'center',
  },
});

export default SignUp;
