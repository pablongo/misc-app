import React, { useContext, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Dimensions,
  View,
  ScrollView,
  Platform
} from 'react-native';
import client from '../../../client';
import CustomButton from '../../components/customButton';
import { AuthContext } from '../../routes';
import { saveTokenPhonebyUser, storeData } from '../../utils';
import messaging from '@react-native-firebase/messaging';
import ImglaurelGaming from '../../assets/laurel-gaming.svg'
import ImgArrowBack from '../../assets/row-back.svg'
import { setUserData } from '../../utils/Amplitude';
const PLACEHOLDER_TEXT_COLOR = '#FFFFFF';
const windowHeight = Dimensions.get('window').height;
const heightQuestion = windowHeight - 590;

const LoginManual: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [emailOrUserName, setEmailOrUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msgError, setMsgError] = useState('');
  const { signIn } = useContext<any>(AuthContext);
  const disabled = () => {
    if (!emailOrUserName.trim()) {
      return true;
    }
    if (!password.trim()) {
      return true;
    }
    if (loading) {
      return true;
    }

    return false;
  };
  const handleLogin = async () => {
    try {
      setLoading(true);
      setMsgError('');
      const { data } = await client.post('/api/auth/login', {
        emailOrUserName: emailOrUserName.toLocaleLowerCase(),
        password
      });
      await storeData(data.authToken, 'userToken');
      const user: any = await client.get('/api/auth/me', {
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
      if (error.response) {
        const { data } = error.response;
        if (data.msg && Array.isArray(data.msg)) {
          setMsgError(data.msg[0]);
        }
      }
      setLoading(false);
    }
  }
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <View style={styles.arrowBack}>
            <ImgArrowBack width={12} height={10} />
          </View>
        </TouchableOpacity>
        <View style={styles.loginView}>
          <View style={styles.logo}>
            <ImglaurelGaming width={190} height={69} />
          </View>
          <TextInput
            value={emailOrUserName}
            style={styles.input}
            onChangeText={value => setEmailOrUserName(value)}
            placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
            placeholder="Tu email o usuario"
          />
          <TextInput
            value={password}
            style={styles.input}
            onChangeText={value => setPassword(value)}
            placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
            secureTextEntry={true}
            placeholder="Contraseña"
          />
          <TouchableOpacity onPress={() => navigation.navigate('RecoverPassword')}>
            <Text style={styles.recoverPasswordText}>
              ¿Ha olvidado su contraseña?
            </Text>
          </TouchableOpacity>
          <CustomButton
            loading={loading}
            disabled={disabled()}
            onPress={handleLogin}
            style={disabled() ? styles.loginButtonDisabled : styles.loginButton}>
            <Text style={styles.loginButtonText}>Acceder</Text>
          </CustomButton>
          {msgError.length > 0 && (
            <Text style={styles.textMsgError}>
              {msgError}
            </Text>
          )}
          <Text style={styles.noAccountText}>
            ¿No tiene una cuenta? <Text onPress={() => navigation.navigate('SignUp')} style={styles.signUpText}>Regístrese</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
  loginButton: {
    backgroundColor: '#0CC482',
    borderRadius: 100,
    padding: 10,
    width: 332,
    height: 51,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowBack: {
    margin: Platform.OS === 'ios' ? 20 : 10,
  },
  loginButtonDisabled: {
    backgroundColor: '#00594D',
    borderRadius: 100,
    padding: 10,
    width: 332,
    height: 51,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
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
  noAccountText: {
    fontFamily: 'Apercu Pro',
    marginTop: heightQuestion,
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
  safeAreaView: {
    flex: 1,
    backgroundColor: '#00443B',
    padding: 10,
  },
  loginView: {
    alignItems: 'center',
  },
});

export default LoginManual;