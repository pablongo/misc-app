import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, Image, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import client, { useAxiosMutation } from '../../../client';
import ArrowBackGreen from '../../assets/arrow-back-green.svg';
import CustomButton from '../../components/customButton';
import { AuthContext } from '../../routes';
import { getData, storeData } from '../../utils';
import { logEvent } from '../../utils/Amplitude';
const IMG_DELETE_ACCOUNT = require('../../assets/delete-account-img.png');

const DeleteAccount: React.FC<{ navigation: any }> = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const { signOut } = useContext<any>(AuthContext);
  useEffect(() => {
    const getUserInfo = async () => {
      const me = await getData('user');
      if (me?.email) setEmail(me.email);
    }
    getUserInfo();
  }, []);

  const onComplete = async () => {
    try {
      await client.post('/api/auth/logout');
      await storeData(null, 'userToken');
      signOut();
    } catch (error) {
      await storeData(null, 'userToken');
      signOut();
    }
  };
  const onError = (error: any) => {
    console.log(error);
  }
  const [handleMutation, { loading }] = useAxiosMutation('/api/auth/deleteAccount', {
    onComplete,
    onError
  });

  const handleDeleteAccount = () => {
    handleMutation();
    logEvent("DELETE_ACCOUNT");
  };


  return (
    <SafeAreaView style={styles.sendMailPasswordView}>
      <TouchableOpacity style={{ margin: Platform.OS === 'ios' ? 20 : 0, }} onPress={() => navigation.goBack()}>
        <ArrowBackGreen width={15} height={15} />
      </TouchableOpacity>
      <View style={styles.content}>
        <Image style={{ width: 136, height: 136 }} source={IMG_DELETE_ACCOUNT} />
        <Text style={styles.textTitle}>
          ¿Desea eliminar cuenta?
        </Text>
        <Text style={[styles.textMsg, { marginTop: 15, }]}>
          ¡Está seguro que usted desea eliminar la
        </Text>
        <Text style={styles.textMsg}>
          cuenta asociada a {email}?
        </Text>
        <Text style={styles.textMsg}>
          Una vez borrada, ya no será posible recuperar
        </Text>
        <Text style={styles.textMsg}>
          todos sus datos. ¡Piénsalo bién!
        </Text>
        <View style={{ marginTop: Dimensions.get('window').height - 690, }}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.textButton}>No, me quedo</Text>
          </TouchableOpacity>
          <CustomButton loading={loading} style={styles.confirmButton} onPress={handleDeleteAccount}>
            <Text style={[styles.textButton, { color: '#4C0000' }]}>Eliminar cuenta</Text>
          </CustomButton>
          <TouchableOpacity
            style={styles.suggestion}
            onPress={() => navigation.navigate('SendComment')}>
            <Text style={styles.textSuggestion} >
              Sugerir mejoras
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sendMailPasswordView: {
    flex: 1,
    padding: 21,
    backgroundColor: '#fff'
  },
  suggestion: {
    marginTop: 40,
    marginLeft: 100,
    marginRight: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textSuggestion: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Apercu Pro',
    color: '#00443B',
    textDecorationLine: 'underline',
  },
  textButton: {
    fontSize: 15,
    color: '#00443B',
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
  },
  cancelButton: {
    width: 332,
    height: 51,
    borderColor: '00443B',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    marginBottom: 10,
  },
  confirmButton: {
    width: 332,
    height: 51,
    backgroundColor: '#F8534B',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  arrowBack: {
    width: 15,
    height: 15,
    marginTop: 10
  },
  content: {
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  circle: {
    width: 136,
    height: 136,
    borderRadius: 100,
    backgroundColor: '#ECECEC'
  },
  textTitle: {
    marginTop: 35,
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#00443B'
  },
  textMsg: {
    textAlign: 'center',
    fontFamily: 'Apercu Pro',
    fontWeight: 'normal',
    fontSize: 15,
    color: '#00443B'
  },
  textResendMail: {
    textAlign: 'center',
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#00443B',
    textDecorationLine: 'underline',
  }

});

export default DeleteAccount;