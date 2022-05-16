import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  StatusBar
} from 'react-native';
import CustomButton from '../../components/customButton';
import ImgArrowBack from '../../assets/arrow-back-green.svg'
import client from '../../../client';
const PLACEHOLDER_TEXT_COLOR = '#00443B';
const windowHeight = Dimensions.get('window').height;
const heightButtonChangePassword = windowHeight - 375;

const RecoverPassword: React.FC<{
  navigation: any
}> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [msgError, setMsgError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleChangeSendEmail = async () => {
    try {
      setLoading(true);
      setMsgError('');
      const emailUser = email.trim().toLocaleLowerCase();
      await client.post('/api/auth/recoverPassword', { email: emailUser });
      setLoading(false);
      navigation.replace('SendMailPassword', { email: emailUser });
    } catch (error: any) {
      setLoading(false);
      if (error.response) {
        const { data } = error.response;
        if (data.msg && Array.isArray(data.msg)) {
          setMsgError(data.msg[0]);
        } else {
          Alert.alert(
            "Ops...",
            "Lo sentimos, ha ocurrido un error inesperado.",
            [
              { text: "Aceptar" }
            ]
          );
        }
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
       {Platform.OS === 'android' && <StatusBar backgroundColor={'#FFFFFF'} barStyle={'dark-content'}></StatusBar>}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <View style={styles.arrowBack}>
          <ImgArrowBack width={12} height={10} />
        </View>
      </TouchableOpacity>
      <View style={{ padding: Platform.OS === 'ios' ? 30 : 10 }}>
        <Text style={styles.textQuestion}>
          ¿Ha olvidado su contraseña?
        </Text>
        <Text style={styles.textMsg}>
          Escriba el correo electrónico donde desea recibir
        </Text>
        <Text style={styles.textMsg}>
          las instrucciones para restablecer la contraseña.
        </Text>
      </View>
      <View style={styles.recoverPasswordView}>
        <TextInput
          value={email}
          style={styles.input}
          onChangeText={value => setEmail(value)}
          placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
          placeholder="Tu email"
        />
        {msgError.length > 0 && (
          <Text style={styles.textMsgError}>{msgError}</Text>
        )}
        <CustomButton
          loading={loading}
          disabled={!email.trim() || loading}
          onPress={handleChangeSendEmail}
          style={styles.buttonChangePassword}>
          <Text style={!email.trim() ? styles.textChangePasswordDisabled : styles.textChangePassword}>
            Cambiar contraseña
          </Text>
        </CustomButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 22
  },
  recoverPasswordView: {
    alignItems: 'center',
  },
  arrowBack: {
    marginTop: 20,
    marginLeft: Platform.OS === 'ios' ? 30 : 10,
  },
  textQuestion: {
    marginTop: 20,
    marginBottom: 10,
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#00443B'
  },
  textMsg: {
    fontFamily: 'Apercu Pro',
    fontWeight: 'normal',
    fontSize: 15,
    color: '#00443B'
  },
  textMsgError: {
    marginTop: 15,
    textAlign: 'center',
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    fontSize: 12,
    color: '#F8534B'
  },
  input: {
    width: 332,
    marginTop: 20,
    textAlign: 'center',
    height: 51,
    borderColor: '#ccc',
    fontWeight: 'bold',
    fontFamily: 'Apercu Pro',
    color: '#00443B',
    borderWidth: 1,
    borderRadius: 100,
  },
  buttonChangePassword: {
    marginTop: heightButtonChangePassword,
    backgroundColor: '#00443B',
    height: 51,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 100,
    width: 332,
  },
  textChangePassword: {
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Apercu Pro',
  },
  textChangePasswordDisabled: {
    fontWeight: 'bold',
    color: '#cccc',
    fontFamily: 'Apercu Pro',
  }
});

export default RecoverPassword;