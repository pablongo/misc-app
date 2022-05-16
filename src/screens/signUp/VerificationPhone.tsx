import React, { useState } from 'react';
import { Keyboard, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import CustomButton from '../../components/customButton';
import CounterTimer from '../../components/counterTimer';
import InputPhone from '../../components/inputPhone';
import client from '../../../client';
import { phoneRegex } from '../../utils';
import ImglaurelGaming from '../../assets/laurel-gaming.svg'
import ImgArrowBack from '../../assets/row-back.svg'

const SignInWithPhone: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
  const { params } = route;
  const [confirm, setConfirm] = useState<any>(null);
  const [code, setCode] = useState('');
  const [phone, setPhone] = useState('');
  const [check, setCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCode, setLoadingCode] = useState(false);
  const [indicativePhone, setIndicativePhone] = useState('');
  const [msgError, setMsgError] = useState('');

  const checkPhoneAssociated = async (phoneNumber: string) => {
    try {
      setLoading(true);
      setMsgError('');
      await client.post('/api/auth/verifyPhoneAssociated', {
        phoneNumber
      });
      signInWithPhoneNumber(phoneNumber);
    } catch (error: any) {
      const { data } = error.response;
      if (data.msg && Array.isArray(data.msg)) {
        setMsgError(data.msg[0]);
      }
      setLoading(false);
    }
  };

  const signInWithPhoneNumber = async (phoneNumber: any) => {
    try {
      const confirmation: any = await auth().signInWithPhoneNumber(phoneNumber);
      setLoading(false);
      setConfirm(confirmation);
    } catch (error) {
      setLoading(false);
      setMsgError('Ha ocurrido un error, intentalo nuevamente.');
    }
  };

  const confirmCode = async () => {
    try {
      setLoadingCode(true);
      setMsgError('');
      await confirm.confirm(code);
      setLoadingCode(false);
      navigation.navigate(
        params.screen,
        {
          ...params,
          screen: params.screen,
          phone: indicativePhone + phone,
          indicative: indicativePhone
        }
      );
    } catch (error) {
      setLoadingCode(false);
      setMsgError('El código no es valido.');
    }
  };

  const disabled = () => {
    if (!phoneRegex.test(indicativePhone + phone)) return true;

    return false;
  }

  const handleOnBlur = () => {
    if (!phoneRegex.test(indicativePhone + phone))
      setMsgError('El número de teléfono no es valido.');
    else
      setMsgError('');
  }

  const handleIndicativePhone = (value: string) => {
    setIndicativePhone(value);
    if (!phoneRegex.test(value + phone))
      setMsgError('El número de teléfono no es valido.');
    else
      setMsgError('');
  }

  const handleInputText = (text: string) => {
    setCode(text);
    setCheck(text.trim().length === 6);
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.safeAreaView}>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <View style={styles.arrowBack}>
            <ImgArrowBack width={12} height={10} />
          </View>
        </TouchableOpacity>
        <View style={styles.verificationCodeView}>
          <View style={styles.logo}>
            <ImglaurelGaming width={190} height={69} />
          </View>
          {confirm ? (
            <>
              <Text style={styles.msg}>Hemos enviado un código de verificación</Text>
              <Text style={[styles.msg, { marginBottom: 20 }]}>al {indicativePhone + " " + phone}</Text>
              <TextInput
                placeholderTextColor='#FFFF'
                textContentType='oneTimeCode'
                placeholder='Ingresar código'
                keyboardType='numeric'
                maxLength={6}
                onChangeText={handleInputText}
                style={styles.inputCode} />
              <CustomButton
                loading={loadingCode}
                disabled={!check || loadingCode}
                onPress={confirmCode}
                style={check ? styles.verificationButton : styles.verificationButtonDisabled}>
                <Text style={styles.verificationButtonText}>Verificar teléfono</Text>
              </CustomButton>
              {msgError.length > 0 && (
                <Text style={styles.textMsgError}>
                  {msgError}
                </Text>
              )}
              <CounterTimer onPress={() => checkPhoneAssociated(indicativePhone + phone)} />
            </>
          ) : (
            <>
              <Text style={styles.msg}>Te enviaremos un código por mensaje SMS para</Text>
              <Text style={[styles.msg, { marginBottom: 20 }]}>confimar tu número de teléfono.</Text>
              <InputPhone
                phone={phone}
                onBlur={handleOnBlur}
                value={indicativePhone}
                onChangePhone={value => setPhone(value)}
                onSelected={handleIndicativePhone}
              />
              <CustomButton
                loading={loading}
                disabled={disabled() || loading}
                onPress={() => checkPhoneAssociated(indicativePhone + phone)}
                style={disabled() ? styles.verificationButtonDisabled : styles.verificationButton}>
                <Text style={styles.verificationButtonText}>Enviar código</Text>
              </CustomButton>
              {msgError.length > 0 && (
                <Text style={styles.textMsgError}>
                  {msgError}
                </Text>
              )}
            </>
          )}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    padding: 20,
    backgroundColor: '#00443B',
  },
  textMsgError: {
    color: '#F8534B',
    fontSize: 12,
    marginTop: 10,
    fontFamily: 'Apercu Pro',
  },
  verificationButton: {
    backgroundColor: '#0CC482',
    marginTop: 20,
    borderRadius: 100,
    padding: 10,
    width: 332,
    height: 51,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verificationButtonDisabled: {
    backgroundColor: '#00594D',
    marginTop: 20,
    borderRadius: 100,
    padding: 10,
    width: 332,
    height: 51,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verificationButtonText: {
    fontWeight: 'bold',
    fontFamily: 'Apercu Pro',
  },
  logo: {
    marginTop: 100,
    marginBottom: 50,
  },
  inputCode: {
    width: 332,
    textAlign: 'center',
    margin: 5,
    height: 51,
    borderColor: '#0CC482',
    fontWeight: 'bold',
    fontFamily: 'Apercu Pro',
    color: '#FFFF',
    borderWidth: 2,
    borderRadius: 100,
  },
  msg: {
    fontWeight: 'bold',
    fontFamily: 'Apercu Pro',
    color: '#FFFFFF',
    fontSize: 15
  },
  arrowBack: {
    marginTop: Platform.OS === 'ios' ? 20 : 10,
    marginLeft: Platform.OS === 'ios' ? 30 : 0,
  },
  verificationCodeView: {
    alignItems: 'center',
  }
});

export default SignInWithPhone;