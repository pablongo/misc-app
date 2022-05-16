import React, { useState } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import client from '../../../client';
import CustomButton from '../../components/customButton';
import InputPassword from '../../components/inputPassword';
import ImglaurelGaming from '../../assets/laurel-gaming.svg'
import ImgArrowBack from '../../assets/row-back.svg'

const NewPassword: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
  const { params } = route;
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [msgError, setMsgError] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');
  const handleChangePassword = async () => {
    try {
      setMsgError('');
      setLoading(true);
      if (newPassword !== repeatNewPassword) {
        setLoading(false);
        setMsgError('Las contraseñas no coinciden');
        return;
      }

      await client.post('/api/auth/updatePasswordWithToken', {
        newPassword,
        validateToken: params.token
      });
      setLoading(false);
      navigation.replace('Successfully');
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
  const disabled = () => {
    if (!newPassword.trim()) return true;
    if (!repeatNewPassword.trim()) return true;
    return false;
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
       {Platform.OS === 'android' && <StatusBar backgroundColor={'#00443B'} barStyle={'dark-content'}></StatusBar>}
      <TouchableOpacity onPress={() => navigation.replace('Login')}>
        <View style={styles.arrowBack}>
          <ImgArrowBack width={12} height={10} />
        </View>
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
}

const styles = StyleSheet.create({
  logo: {
    marginTop: 100,
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

export default NewPassword;