import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, Keyboard, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import TextInputWithTextUp from '../../components/textInputWithTextUp';
import client, { useAxios, useAxiosMutation } from '../../../client';
import CustomModal from '../../components/modal';
import InputPhone from '../../components/inputPhone';
import { getData, phoneRegex, storeData } from '../../utils';
import CustomButton from '../../components/customButton';
import CounterTimer from '../../components/counterTimer';
import auth from '@react-native-firebase/auth';
import UpdateEmail from './updateEmail';
import ImglaurelGaming from '../../assets/laurel-gaming.svg'
import ImgArrowBack from '../../assets/arrow-back-green.svg';
import ImgArrowBackWhite from '../../assets/arrow-back-white.svg';

const PersonalInformation: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [phone, setPhone] = useState('');
  const [indicativePhone, setIndicativePhone] = useState('');
  const [openModalPhone, setOpenModalPhone] = useState(false);
  const [msgError, setMsgError] = useState('');
  const [confirm, setConfirm] = useState<any>(null);
  const [check, setCheck] = useState(false);
  const [code, setCode] = useState('');
  const [loadingCode, setLoadingCode] = useState(false);
  const [loadingPhone, setLoadingPhone] = useState(false);
  const [onEdit, setOnEdit] = useState(true);
  const [openModalEmail, setOpenModalEmail] = useState(false);
  const handleIndicativePhone = (value: string) => {
    setIndicativePhone(value);
    if (!phoneRegex.test(value + phone))
      setMsgError('El número de teléfono no es valido.');
    else
      setMsgError('');
  };
  const signInWithPhoneNumber = async (phoneNumber: any) => {
    try {
      const confirmation: any = await auth().signInWithPhoneNumber(phoneNumber);
      setLoadingPhone(false);
      setConfirm(confirmation);
    } catch (error) {
      setLoadingPhone(false);
      setMsgError('Ha ocurrido un error, intentalo nuevamente.');
    }
  };
  const checkPhoneAssociated = async (phoneNumber: string) => {
    try {
      setLoadingPhone(true);
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
      setLoadingPhone(false);
    }
  };
  const handleOnBlur = () => {
    if (!phoneRegex.test(indicativePhone + phone))
      setMsgError('El número de teléfono no es valido.');
    else
      setMsgError('');
  };
  const disabled = () => {
    if (!phoneRegex.test(indicativePhone + phone)) return true;

    return false;
  };
  const handleCloseModal = () => {
    setConfirm(null);
    setIndicativePhone('');
    setPhone('');
    setOpenModalPhone(false);
  };

  const handleInputText = (text: string) => {
    setCode(text);
    setCheck(text.trim().length === 6);
  };

  const { loading: loadingMe, error, data, refetch } = useAxios('api/auth/me');
  const onComplete = async (response: any) => {
    const { data: { user } } = response;
    const me = await getData('user');
    await storeData({ ...me, ...user }, 'user');
    refetch();
    setOnEdit(true);
    if (openModalPhone) handleCloseModal();
  }
  const onError = (error: any) => {
    if (openModalPhone) handleCloseModal();
    if (error?.response) {
      const { data } = error?.response;
      setMsgError(data?.msg);
    }
  }
  const [mutation, { loading }] = useAxiosMutation('/api/auth/updateUser', { onError, onComplete });
  const handleMutation = () => {
    setMsgError('');
    const values = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      userName: userName.toLocaleLowerCase().trim(),
    };
    if (phoneNumber.trim() && indicativePhone.trim()) {
      Object.assign(values, {
        phoneNumber: indicativePhone.trim() + phone.trim(),
        indicative: indicativePhone.trim(),
      });
    }
    mutation(values);
  };
  const confirmCode = async () => {
    try {
      setLoadingCode(true);
      setMsgError('');
      await confirm.confirm(code);
      setLoadingCode(false);
      handleMutation();
    } catch (error) {
      setLoadingCode(false);
      setMsgError('El código no es valido.');
    }
  };

  if (loadingMe) return (
    <SafeAreaView style={styles.viewSafeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.circleBack}>
          <ImgArrowBack width={12} height={10} />
        </TouchableOpacity>
        <Text style={{ ...styles.textContainer, fontWeight: 'bold' }}>
          Datos personales
        </Text>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 200 }}>
        <ActivityIndicator color='#00443B' />
      </View>
    </SafeAreaView>
  );

  if (error) return (
    <SafeAreaView style={styles.viewSafeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.circleBack}>
          <ImgArrowBack width={15} height={21} />
        </TouchableOpacity>
        <Text style={{ ...styles.textContainer, fontWeight: 'bold' }}>
          Datos personales
        </Text>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 200 }}>
        <Text>
          Lo sentimos, ha ocurrido un error.
        </Text>
      </View>
    </SafeAreaView>
  );

  const {
    firstName: firstNameMe,
    lastName: lasteNameMe,
    email: emailMe,
    phoneNumber,
    loginType,
    userName: userNameMe
  }: any = data;

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.viewSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.circleBack}>
            <ImgArrowBack width={15} height={21} />
          </TouchableOpacity>
          <Text style={{ ...styles.textContainer, fontWeight: 'bold' }}>
            Datos personales
          </Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <TextInputWithTextUp
            onKeyPress={() => setOnEdit(false)}
            style={[styles.textInput, { marginTop: 30, }]}
            placeholder='Nombres'
            value={firstNameMe || firstName}
            onChange={(value) => setFirstName(value)}
          />
          <TextInputWithTextUp
            onKeyPress={() => setOnEdit(false)}
            style={styles.textInput}
            placeholder='Apellidos'
            value={lasteNameMe || lastName}
            onChange={(value) => setLastName(value)}
          />
          <TextInputWithTextUp
            onKeyPress={() => setOnEdit(false)}
            style={styles.textInput}
            placeholder='Nombre de usuario'
            value={userNameMe}
            onChange={(value) => setUserName(value)}
          />
          {loginType === 'manual' && (
            <>
              <TouchableOpacity onPress={() => setOpenModalEmail(true)}>
                <View style={[styles.boxText]}>
                  <Text style={styles.placeholderText}>
                    Email
                  </Text>
                  <View style={{ marginTop: 5 }}>
                    <Text style={styles.inputText}>
                      {emailMe}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <UpdateEmail
                open={openModalEmail}
                onClose={() => setOpenModalEmail(false)}
                refetch={refetch} />
            </>
          )}
          <TouchableOpacity onPress={() => setOpenModalPhone(true)}>
            <View style={[styles.boxText]}>
              <Text style={styles.placeholderText}>
                Teléfono
              </Text>
              <View style={{ marginTop: 5 }}>
                <Text style={styles.inputText}>
                  {phoneNumber}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          {msgError.length > 0 && (
            <Text style={styles.textMsgError}>
              {msgError}
            </Text>
          )}
          <CustomModal open={openModalPhone}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={{ flex: 1, backgroundColor: '#00443B', padding: 21 }}>
                {Platform.OS === 'android' && <StatusBar backgroundColor={'#00443B'} barStyle={'dark-content'}></StatusBar>}
                <TouchableOpacity style={{ marginTop: Platform.OS === 'ios' ? 40 : 30 }} onPress={handleCloseModal}>
                  <View style={styles.arrowBack}>
                    <ImgArrowBackWhite width={15} height={15} />
                  </View>
                </TouchableOpacity>
                <View style={{ alignItems: 'center' }}>
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
                        loading={loadingPhone}
                        disabled={disabled() || loadingPhone}
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
              </View>
            </TouchableWithoutFeedback>
          </CustomModal>
          <CustomButton
            disabled={onEdit}
            loading={loading}
            onPress={handleMutation}
            style={[styles.saveData, { backgroundColor: onEdit ? '#E9F6ED' : '#00443B' }]}>
            <Text style={[styles.saveDataText, { color: onEdit ? '#00443B' : '#fff' }]}>
              Guardar
            </Text>
          </CustomButton>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  viewSafeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  inputText: {
    fontSize: 15,
    color: '#00443B',
    fontFamily: 'Apercu Pro Medium',
    fontWeight: '700',
    height: 45,
    width: 332,
    textAlign: 'center',
    textAlignVertical: 'top',
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
  boxText: {
    width: 332,
    height: 51,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 100,
    borderColor: "#EAEAEA",
    marginBottom: 10,
  },
  placeholderText: {
    fontSize: 10,
    marginTop: 17,
    color: '#00443B',
    fontFamily: 'Apercu Pro Medium',
    fontWeight: '400',
  },
  textInput: {
    marginBottom: 10,
  },
  verificationButtonText: {
    fontWeight: 'bold',
    fontFamily: 'Apercu Pro',
  },
  saveData: {
    backgroundColor: '#00443B',
    marginTop: Dimensions.get('window').height - 520,
    width: 332,
    height: 51,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  saveDataText: {
    fontFamily: 'Apercu Pro',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff'
  },
  textMsgError: {
    color: '#F8534B',
    fontSize: 12,
    marginTop: 10,
    fontFamily: 'Apercu Pro',
  },
  verificationButton: {
    backgroundColor: '#0CC482',
    marginTop: 10,
    borderRadius: 100,
    padding: 10,
    width: 332,
    height: 51,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verificationButtonDisabled: {
    backgroundColor: '#00594D',
    marginTop: 10,
    borderRadius: 100,
    padding: 10,
    width: 332,
    height: 51,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowBack: {
    marginTop: 10,
  },
  logo: {
    marginTop: 100,
    marginBottom: 50,
  },
  msg: {
    fontWeight: 'bold',
    fontFamily: 'Apercu Pro',
    color: '#FFFFFF',
    fontSize: 15
  },
  header: {
    width: '100%',
    display: "flex",
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderColor: "#EAEAEA",
    borderBottomWidth: 1
  },
  textContainer: {
    fontFamily: 'Apercu Pro',
    fontWeight: 'normal',
    color: '#00443B',
    fontSize: 15,
  },
  circleBack: {
    width: 16,
    height: 30,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: '#FFFF'
  },
})

export default PersonalInformation;