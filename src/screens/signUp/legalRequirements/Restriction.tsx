import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImglaurelGaming from '../../../assets/laurel-gaming.svg'
import ImgArrowBack from '../../../assets/row-back.svg'

const Restriction: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.restrictionView}>
      <TouchableOpacity onPress={() => navigation.navigate('LegalRequirements', { screen: 'Manual' })}>
        <ImgArrowBack width={12} height={10} />
      </TouchableOpacity>
      <View style={styles.viewContent}>
        <View style={styles.logo}>
          <ImglaurelGaming width={190} height={69} />
        </View>
        <Text style={styles.textWarning}>
          ¡Lo sentimos!
        </Text>
        <Text style={styles.textWarning}>
          No tienes la edad requerida para utilizar
        </Text>
        <Text style={styles.textWarning}>
          Laurel Gaming
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.buttonResponse}>
          <Text style={styles.buttonText}>Entendido</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    marginTop: 100,
    marginBottom: 50,
  },
  rowBack: {
    width: 15,
    height: 15
  },
  textWarning: {
    fontFamily: 'Apercu Pro',
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  buttonResponse: {
    backgroundColor: '#0CC482',
    borderRadius: 100,
    padding: 10,
    width: 332,
    height: 51,
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notButtonText: {
    fontWeight: 'bold',
    fontFamily: 'Apercu Pro',
    fontSize: 14,
    fontStyle: 'normal',
    color: '#0CC482'
  },
  buttonText: {
    fontWeight: 'bold',
    fontFamily: 'Apercu Pro',
    fontSize: 14,
    fontStyle: 'normal',
    color: '#00443B'
  },
  viewContent: {
    backgroundColor: '#00443B',
    alignItems: 'center',
  },
  restrictionView: {
    flex: 1,
    padding: 21,
    backgroundColor: '#00443B',
  },
});

export default Restriction;