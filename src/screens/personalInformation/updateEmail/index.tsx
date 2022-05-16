import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CustomModal from '../../../components/modal';
import ArrowBackWhite from '../../../assets/arrow-back-white.svg';
import InputPassword from '../../../components/inputPassword';
import CustomButton from '../../../components/customButton';
import { useAxiosMutation } from '../../../../client';
import { emailRegex } from '../../../utils';
import ImglaurelGaming from '../../../assets/laurel-gaming.svg'

const UpdateEmail: React.FC<{
  open: boolean,
  onClose?: () => (void)
  refetch: () => (void)
}> = ({ open, onClose, refetch }) => {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [msgError, setMsgError] = useState('');
  const onComplete = () => {
    setEmail('');
    setCurrentPassword('');
    if (refetch) refetch();
    if (onClose) onClose();
  }
  const onError = (error: any) => {
    if (error.response) {
      const { data } = error.response;
      if (data.msg) {
        setMsgError(data.msg);
      }
    }
  }
  const [mutation, { loading }] = useAxiosMutation('/api/auth/updateEmail', { onError, onComplete });
  const handleChangeEmail = () => {
    setMsgError('');
    mutation({
      password: currentPassword,
      email,
    });
  }
  const disabled = () => {
    if (!emailRegex.test(email)) return true;
    if (!currentPassword.trim()) return true;

    return false;
  }

  return (
    <CustomModal open={open}>
      {Platform.OS === 'android' && <StatusBar backgroundColor={'#00443B'} barStyle={'dark-content'}></StatusBar>}
      <View style={{ flex: 1, backgroundColor: '#00443B', padding: 21 }}>
        <TouchableOpacity style={{ marginTop: Platform.OS === 'ios' ? 40 : 20 }} onPress={onClose}>
          <ArrowBackWhite width={12} height={10} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <View style={styles.logo}>
            <ImglaurelGaming width={190} height={69} />
          </View>
          <Text style={styles.msg}>Para actualizar tú correo debes</Text>
          <Text style={[styles.msg, { marginBottom: 20 }]}>proporcionar tu contraseña por seguridad.</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={value => setEmail(value)}
              placeholder="Nuevo email"
              placeholderTextColor="#ffff"
            />
          </View>
          <InputPassword
            value={currentPassword}
            onChangeText={(value: any) => setCurrentPassword(value)}
            placeholder="Contraseña"
          />
          <CustomButton
            loading={loading}
            disabled={disabled()}
            onPress={handleChangeEmail}
            style={disabled() ? styles.buttonDisabled : styles.button}>
            <Text style={styles.buttonText}>Actualizar email</Text>
          </CustomButton>
          {msgError.length > 0 && (
            <Text style={styles.textMsgError}>
              {msgError}
            </Text>
          )}
        </View>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  logo: {
    marginTop: 90,
    marginBottom: 30,
  },
  msg: {
    fontWeight: 'bold',
    fontFamily: 'Apercu Pro',
    color: '#FFFFFF',
    fontSize: 15
  },
  inputView: {
    width: 332,
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    borderColor: '#0CC482',
    height: 51,
    borderWidth: 1,
    borderRadius: 100,
  },
  input: {
    textAlign: 'center',
    width: 240,
    margin: 5,
    height: 51,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'Apercu Pro',
  },
  button: {
    backgroundColor: '#0CC482',
    borderRadius: 100,
    padding: 10,
    width: 332,
    height: 51,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#00594D',
    borderRadius: 100,
    padding: 10,
    width: 332,
    height: 51,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontFamily: 'Apercu Pro',
  },
  textMsgError: {
    marginTop: 15,
    textAlign: 'center',
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    fontSize: 12,
    color: '#F8534B'
  },
});

export default UpdateEmail;