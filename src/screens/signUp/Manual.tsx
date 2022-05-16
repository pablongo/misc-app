import React, { useContext, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  ScrollView,
  Platform,
} from 'react-native';
import WebView from 'react-native-webview';
import client from '../../../client';
import CustomTextInput from '../../components/customButton';
import CustomModal from '../../components/modal';
import RadioButton from '../../components/radioButton';
import TextTermsAndConditions from '../../components/textTermsAndConditions/indes';
import { AuthContext } from '../../routes';
import { saveTokenPhonebyUser, storeData } from '../../utils';
import messaging from '@react-native-firebase/messaging';
import ImglaurelGaming from '../../assets/laurel-gaming.svg'
import ImgArrowBack from '../../assets/row-back.svg'
import { setUserData } from '../../utils/Amplitude';
const PLACEHOLDER_TEXT_COLOR = '#FFFFFF';

const Manual: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
  const { params } = route;
  const { signIn } = useContext<any>(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [termsAndConditions, setTermsAndConditions] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msgError, setMsgError] = useState({
    isEmail: '',
    isUserName: '',
    isPassword: '',
  });

  const disabled = () => {
    if (!email.trim()) {
      return true;
    }
    if (!password.trim()) {
      return true;
    }
    if (!password.trim()) {
      return true;
    }
    if (!repeatPassword.trim()) {
      return true;
    }
    if (!userName.trim()) {
      return true;
    }
    if (!termsAndConditions) {
      return true;
    }
    if (loading) {
      return true;
    }
    return false;
  };
  const handleSignUp = async () => {
    try {
      setMsgError({ isEmail: '', isUserName: '', isPassword: '' });
      if (password.trim() !== repeatPassword.trim()) {
        setMsgError({ ...msgError, isPassword: 'Las contraseñas no coinciden' });
        return;
      }
      setLoading(true);
      const { data } = await client
        .post('/api/auth/signUp', {
          email: email.toLocaleLowerCase(),
          password,
          userName: userName.toLocaleLowerCase(),
          phoneNumber: params.phone,
          indicative: params.indicative,
          termsAndConditions
        });
      await storeData(data.authToken, 'userToken');
      const user = await client.get('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${data.authToken}` }
      });
      await storeData(user.data, 'user');
      setUserData(user.data);
      messaging()
        .getToken()
        .then(tokenPhone => saveTokenPhonebyUser(tokenPhone));
      setLoading(false);
      signIn({ isLogged: true, loading: true, loginType: 'manual' });
    } catch (error: any) {
      const { data } = error.response;
      if (data.msg && Array.isArray(data.msg)) {
        data.msg.forEach((e: any) => {
          setMsgError((prevState: any) => ({
            ...prevState,
            ...e
          }));
        });
      }
      setLoading(false);
    }
  }
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <TouchableOpacity onPress={() => navigation.replace('SignUp')}>
        <View style={styles.rowBack}>
          <ImgArrowBack width={12} height={10} />
        </View>
      </TouchableOpacity>
      <ScrollView>
        <View style={[styles.manualView, !openModal && { alignItems: 'center', }]}>
          <View style={styles.logo}>
            <ImglaurelGaming width={190} height={69} />
          </View>
          <TextInput
            value={email}
            style={styles.input}
            onChangeText={value => setEmail(value)}
            placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
            placeholder="Tu email"
          />
          {msgError.isEmail.length > 0 && (
            <Text style={styles.textMsgError}>
              {msgError.isEmail}
            </Text>
          )}
          <TextInput
            value={userName}
            style={styles.input}
            onChangeText={value => setUserName(value.trim())}
            placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
            placeholder="Nombre de usuario"
          />
          {msgError.isUserName.length > 0 && (
            <Text style={styles.textMsgError}>
              {msgError.isUserName}
            </Text>
          )}
          <TextInput
            value={password}
            style={styles.input}
            onChangeText={value => setPassword(value)}
            placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
            secureTextEntry={true}
            placeholder="Contraseña"
          />
          {msgError.isPassword.length > 0 && (
            <Text style={styles.textMsgError}>
              {msgError.isPassword}
            </Text>
          )}
          <TextInput
            value={repeatPassword}
            style={styles.input}
            onChangeText={value => setRepeatPassword(value)}
            placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
            secureTextEntry={true}
            placeholder="Repetir contraseña"
          />
          {msgError.isPassword.length > 0 && (
            <Text style={styles.textMsgError}>
              {msgError.isPassword}
            </Text>
          )}
          <RadioButton
            style={styles.radioButton}
            checked={termsAndConditions}
            onChange={checked => setTermsAndConditions(!checked)}
            onPressText={() => setOpenModal(!openModal)}
            content={<TextTermsAndConditions />}
          />
          <CustomModal open={openModal}>
            <View style={[{ backgroundColor: '#00594D', flex: 1, borderRadius: 10 }]}>
              <View style={{ flex: 1 }} >
                <View style={{ flexDirection: 'row', justifyContent: "flex-end", marginTop: Platform.OS === 'ios' ? 35 : 0 }}>
                  <TouchableOpacity onPress={() => setOpenModal(false)}>
                    <Text style={{ fontSize: 35, marginRight: 12, fontWeight: 'bold' }}>
                      x
                    </Text>
                  </TouchableOpacity>
                </View>
                <WebView
                  source={{ uri: 'https://www.laurelgaming.com/legal' }}
                />
              </View>
            </View>
          </CustomModal>
          <CustomTextInput
            loading={loading}
            disabled={disabled()}
            onPress={handleSignUp}
            style={disabled() ? styles.signUpButtonDisabled : styles.signUpButton}>
            <Text style={styles.signUpButtonText}>Crear cuenta</Text>
          </CustomTextInput>
          <Text style={styles.accountText}>
            ¿Ya tienes una cuenta? <Text onPress={() => navigation.navigate('Login')} style={styles.loginText}>Acceder</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logo: {
    marginTop: 60,
    marginBottom: 50,
  },
  textMsgError: {
    color: '#F8534B',
    fontSize: 12,
    marginTop: 6,
    marginBottom: 6,
    textAlign: 'center',
    fontFamily: 'Apercu Pro',
  },
  radioButton: {
    margin: 20
  },
  rowBack: {
    marginLeft: 17,
  },
  signUpButton: {
    backgroundColor: '#0CC482',
    borderRadius: 100,
    padding: 10,
    width: 332,
    height: 51,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpButtonDisabled: {
    backgroundColor: '#00594D',
    borderRadius: 100,
    padding: 10,
    width: 332,
    height: 51,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpButtonText: {
    fontWeight: 'bold',
    fontFamily: 'Apercu Pro',
  },
  recoverPasswordText: {
    fontFamily: 'Apercu Pro',
    marginTop: 6,
    marginBottom: 20,
    fontSize: 12,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  signUpText: {
    fontFamily: 'Apercu Pro',
    marginTop: 6,
    marginBottom: 20,
    fontSize: 15,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  accountText: {
    fontFamily: 'Apercu Pro',
    marginBottom: 20,
    marginTop: 50,
    fontSize: 15,
    color: '#FFFFFF',
  },
  input: {
    width: 332,
    textAlign: 'center',
    margin: 5,
    height: 51,
    borderColor: '#0CC482',
    fontWeight: 'bold',
    fontFamily: 'Apercu Pro',
    color: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 100,
  },
  loginText: {
    fontFamily: 'Apercu Pro',
    marginTop: 6,
    marginBottom: 20,
    fontSize: 15,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  safeAreaView: {
    backgroundColor: '#00443B',
    flex: 1,
    padding: 21,
  },
  manualView: {
    backgroundColor: '#00443B',
  },
});

export default Manual;