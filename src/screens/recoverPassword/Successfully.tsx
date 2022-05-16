import React from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import CustomButton from '../../components/customButton';
import ImglaurelGaming from '../../assets/laurel-gaming.svg'

const Succesfully: React.FC<{
  navigation: any,
  route: any
}> = ({ navigation, route }) => {
  const { params } = route;
  const handleGoRoute = () => navigation.replace(params?.screen || 'Login');
  return (
    <SafeAreaView style={styles.safeAreaView}>
      {Platform.OS === 'android' && <StatusBar backgroundColor={'#00443B'} barStyle={'dark-content'}></StatusBar>}
      <View style={styles.logo}>
        <ImglaurelGaming width={190} height={69} />
      </View>
      <Text style={styles.textMsg} >¡Enhorabuena!</Text>
      <Text style={styles.textMsg}>Tu contraseña ha sido actualizada</Text>
      <Text style={styles.textMsg}>correctamente.</Text>
      <CustomButton
        onPress={handleGoRoute}
        style={styles.button}>
        <Text style={styles.buttonText}>Volver a Laurel</Text>
      </CustomButton>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    marginTop: 100,
    marginBottom: 50,
  },
  textMsg: {
    textAlign: 'center',
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#FFF'
  },
  buttonText: {
    fontWeight: 'bold',
    fontFamily: 'Apercu Pro',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#0CC482',
    borderRadius: 100,
    padding: 10,
    width: 332,
    height: 51,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeAreaView: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#00443B',
    padding: 21,
  },
})

export default Succesfully;