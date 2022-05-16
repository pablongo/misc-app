import React, { useContext, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import WebView from 'react-native-webview';
import client from '../../../client';
import CustomButton from '../../components/customButton';
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

const Social: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
  const { params } = route;
  const { signIn } = useContext<any>(AuthContext);
  const [userName, setUserName] = useState('');
  const [termsAndConditions, setTermsAndConditions] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msgError, setMsgError] = useState('');
  const [msgErrorGlobal, setMsgErrorGlobal] = useState('');
  const disabled = () => {
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
  const handleSignUpSocial = async () => {
    try {
      const { data } = params;
      setLoading(true);
      setMsgError('');
      setMsgErrorGlobal('');
      const user = JSON.parse(data.user);
      const response = await client.post('/api/auth/signUpSocial', {
        email: user.info.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: userName.toLocaleLowerCase(),
        phoneNumber: params.phone,
        indicative: params.indicative,
        uid: user.info.uid,
        loginType: data.loginType,
        termsAndConditions,
      });
      await storeData(response.data.authToken, 'userToken');
      const newUser = await client.get('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${response.data.authToken}` }
      });
      await storeData(newUser, 'user');
      setUserData(newUser);
      messaging()
        .getToken()
        .then(tokenPhone => saveTokenPhonebyUser(tokenPhone));
      setLoading(false);
      signIn({ isLogged: true, loading: true, loginType: data.loginType });
    } catch (error: any) {
      const { data } = error.response;
      if (data.msg && Array.isArray(data.msg)) {
        if (data.msg[0].isUserName) {
          setMsgError(data.msg[0].isUserName);
        } else {
          const typeError = typeof data.msg[0] === 'string'
          setMsgErrorGlobal(typeError ? data.msg[0] : JSON.stringify(data.msg[0]));
        }
      }
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <TouchableOpacity onPress={() => navigation.replace('SignUp')}>
        <ImgArrowBack width={12} height={10} />
      </TouchableOpacity>
      <View style={[styles.manualView, !openModal && { alignItems: 'center', }]}>
        <View style={styles.logo}>
          <ImglaurelGaming width={190} height={69} />
        </View>
        <TextInput
          value={userName}
          style={styles.input}
          onChangeText={value => setUserName(value.trim())}
          placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
          placeholder="Nombre de usuario"
        />
        {msgError.length > 0 && (
          <Text style={styles.textMsgError}>
            {msgError}
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
        <CustomButton
          loading={loading}
          disabled={disabled()}
          onPress={handleSignUpSocial}
          style={disabled() ? styles.signUpButtonDisabled : styles.signUpButton}>
          <Text style={styles.signUpButtonText}>Crear cuenta</Text>
        </CustomButton>
        {msgErrorGlobal.length > 0 && (
          <Text style={styles.textMsgError}>
            {msgErrorGlobal}
          </Text>
        )}
        <Text style={styles.accountText}>
          ¿Ya tienes una cuenta? <Text onPress={() => navigation.navigate('Login')} style={styles.loginText}>Acceder</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  logo: {
    marginTop: 100,
    marginBottom: 50,
  },
  textMsgError: {
    color: '#F8534B',
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'Apercu Pro',
  },
  radioButton: {
    margin: 20
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
  accountText: {
    fontFamily: 'Apercu Pro',
    marginBottom: 20,
    marginTop: 150,
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

export default Social;