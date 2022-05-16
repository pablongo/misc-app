import React, { useState } from "react";
import { Alert, Dimensions, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import client from "../../../client";
import CustomButton from "../../components/customButton";
const windowHeight = Dimensions.get('window').height;
const heightTextQuestion = windowHeight - 550;
import ImgArrowBack from '../../assets/arrow-back-green.svg'
import EmailImg from '../../assets/email-img.svg';
const SendMailPassword: React.FC<{
  navigation: any,
  route: any,
}> = ({ navigation, route }) => {
  const { params } = route;
  const [loading, setLoading] = useState(false);
  const handleChangeResendEmail = async () => {
    try {
      setLoading(true);
      const email = params?.email || '';
      const msg = `Hemos reenviado un correo electrónico a ${email}, por favor revisa tu bandeja de entrada.`;
      await client.post('/api/auth/recoverPassword', { email });
      Alert.alert(
        "Reenvío exitoso",
        msg,
        [
          { text: "Aceptar" }
        ]
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert(
        "Ops...",
        "Lo sentimos, ha ocurrido un error inesperado.",
        [
          { text: "Aceptar" }
        ]
      );
    }
  }
  return (
    <SafeAreaView style={styles.sendMailPasswordView}>
      {Platform.OS === 'android' && <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'}></StatusBar>}
      <TouchableOpacity onPress={() => navigation.navigate('RecoverPassword')}>
        <View style={styles.arrowBack}>
          <ImgArrowBack width={12} height={10} />
        </View>
      </TouchableOpacity>
      <View style={styles.content}>
        <EmailImg />
        <Text style={styles.textTitle}>
          Comprueba tu email
        </Text>
        <Text style={styles.textMsg}>
          Hemos enviado un correo electrónico a {params?.email} con las instrucciones sobre cómo restablecer su contraseña.
        </Text>
        <Text style={styles.textQuestion}>
          ¿Problemas para recibir el email?
        </Text>
        <CustomButton
          loading={loading}
          disabled={loading}
          onPress={handleChangeResendEmail}>
          <Text style={styles.textResendMail}>
            Pedir uno de nuevo
          </Text>
        </CustomButton>
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
  arrowBack: {
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
    marginTop: 15,
    textAlign: 'center',
    fontFamily: 'Apercu Pro',
    fontWeight: 'normal',
    fontSize: 15,
    color: '#00443B'
  },
  textQuestion: {
    marginTop: heightTextQuestion,
    textAlign: 'center',
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
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

export default SendMailPassword;