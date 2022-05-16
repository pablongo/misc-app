import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Platform } from 'react-native';
import ImglaurelGaming from '../../../assets/laurel-gaming.svg'
import ImgArrowBack from '../../../assets/row-back.svg'

const LegalRequirements: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
  const { params } = route;
  const goTo = () => {
    if (params.screen === 'Manual') return "VerificationPhone";
    return params.screen;
  };
  return (
    <SafeAreaView style={styles.legalRequirementsView}>
      <TouchableOpacity style={styles.buttonBack} onPress={() => navigation.navigate('SignUp')}>
        <ImgArrowBack width={12} height={10} />
      </TouchableOpacity>
      <View style={styles.viewContent}>
        <View style={styles.logo}>
          <ImglaurelGaming width={190} height={69} />
        </View>
        <Text style={styles.textWarning}>
          La aplicación de Laurel tiene requerimientos
        </Text>
        <Text style={styles.textWarning}>
          legales de edad y debemos preguntarlo.
        </Text>
        <Text style={styles.textWarning}>
          ¿Eres mayor de 18 años?
        </Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity onPress={() => navigation.navigate('Restriction')} style={styles.buttonNotResponse}>
            <Text style={styles.notButtonText}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate(goTo(), { ...params })} style={styles.buttonResponse}>
            <Text style={styles.buttonText}>Sí</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logo: {
    marginTop: 100,
    marginBottom: 50,
  },
  buttonBack: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    marginLeft: Platform.OS === 'ios' ? 30 : 0
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 25,
  },
  textWarning: {
    fontFamily: 'Apercu Pro',
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  buttonNotResponse: {
    backgroundColor: '#00443B',
    borderRadius: 100,
    borderColor: '#0CC482',
    marginRight: 10,
    borderWidth: 1,
    padding: 10,
    width: 162,
    height: 51,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonResponse: {
    backgroundColor: '#0CC482',
    borderRadius: 100,
    padding: 10,
    width: 162,
    height: 51,
    marginBottom: 20,
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
  legalRequirementsView: {
    flex: 1,
    padding: 21,
    backgroundColor: '#00443B',
  },
});

export default LegalRequirements;