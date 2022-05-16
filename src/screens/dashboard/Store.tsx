import React from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import ComingSoon from '../../assets/coming-soon.svg';


const Store = () => {
  return (
    <SafeAreaView style={styles.sendMailPasswordView}>
      <View style={styles.content}>
        <ComingSoon />
        <Text style={styles.textTitle}>
          Coming soon
        </Text>
        <Text style={[styles.textMsg, { marginTop: 15, }]}>
          Estamos trabajando sin parar para que puedas
        </Text>
        <Text style={[styles.textMsg, { marginTop: Platform.OS === 'ios' ? 6 : 0 }]}>
          adquirir lo mejor en nuestra tienda.
        </Text>
        <Text style={[styles.textMsg, { marginTop: Platform.OS === 'ios' ? 6 : 0 }]}>
          Roma no se construyó en un día
        </Text>
        <Text style={[styles.textMsg, { marginTop: Platform.OS === 'ios' ? 6 : 0 }]}>
          Lo bueno se hace esperar.
        </Text>
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

export default Store;