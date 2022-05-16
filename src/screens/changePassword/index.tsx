import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar
} from 'react-native';
import { useAxiosMutation } from '../../../client';
import CustomButton from '../../components/customButton';
import InputPassword from '../../components/inputPassword';
import ImglaurelGaming from '../../assets/laurel-gaming.svg'
import ArrowBackWhite from '../../assets/arrow-back-white.svg';

const ChangePassword: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msgError, setMsgError] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');

  const onComplete = () => navigation.replace('Successfully', { screen: 'Dashboard' });
  const onError = (error: any) => {
    if (error.response) {
      const { data } = error.response;
      if (data.msg) setMsgError(data.msg);
    }
  }
  const [mutation, { loading }] = useAxiosMutation('/api/auth/updatePassword', {
    onComplete,
    onError
  });

  const handleChangePassword = async () => {
    setMsgError('');
    if (newPassword !== repeatNewPassword) {
      setMsgError('Las contraseñas no coinciden.');
      return;
    };

    mutation({
      oldPassword,
      newPassword
    });
  }
  const disabled = () => {
    if (!oldPassword.trim()) return true;
    if (!newPassword.trim()) return true;
    if (!repeatNewPassword.trim()) return true;
    return false;
  }
  return (
    <SafeAreaView style={styles.safeAreaView}>
      {Platform.OS === 'android' && <StatusBar backgroundColor={'#00443B'} barStyle={'dark-content'}></StatusBar>}
      <TouchableOpacity style={{ margin: Platform.OS === 'ios' ? 20 : 0, }} onPress={() => navigation.goBack()}>
        <ArrowBackWhite width={12} height={10} />
      </TouchableOpacity>
      <View style={styles.newPaswordView}>
      <View style={styles.logo}>
          <ImglaurelGaming width={190} height={69} />
        </View>
        <View style={styles.textExampleView}>
          <Text style={styles.textExample}>
            Escribe a continuatión su nueva
          </Text>
          <Text style={styles.textExample}>
            contraseña a actualizar
          </Text>
        </View>
        <InputPassword
          value={oldPassword}
          onChangeText={(value: any) => setOldPassword(value)}
          placeholder="Antigua contraseña"
        />
        <InputPassword
          value={newPassword}
          onChangeText={(value: any) => setNewPassword(value)}
          placeholder="Nueva contraseña"
        />
        <InputPassword
          value={repeatNewPassword}
          onChangeText={(value: any) => setRepeatNewPassword(value)}
          placeholder="Repetir nueva contraseña"
        />
        <CustomButton
          loading={loading}
          disabled={disabled()}
          onPress={handleChangePassword}
          style={disabled() ? styles.buttonDisabled : styles.button}>
          <Text style={styles.buttonText}>Actualizar contraseña</Text>
        </CustomButton>
        {msgError.length > 0 && (
          <Text style={styles.textMsgError}>
            {msgError}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    marginTop: 80,
    marginBottom: 50,
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
  arrowBack: {
    width: 15,
    height: 15,
    marginTop: 10,
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
  textExampleView: {
    marginBottom: 20
  },
  textExample: {
    textAlign: 'center',
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#FFF'
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
    padding: 21,
  },
  newPaswordView: {
    alignItems: 'center',
  },
});

export default ChangePassword;