import React, { useState } from "react";
import { Dimensions, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Community from '../../assets/community.svg';
import ArrowBackGreen from '../../assets/arrow-back-green.svg';
import ThumbStep from '../../assets/thumb-step.svg';
import { storeData } from "../../utils";
const StepOfWelcome: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [page, setPage] = useState(0);


  const handleSkip = async () => {
    await storeData(true, 'stepOfWelcome');
    navigation.replace('Dashboard');
  }

  const handleBackPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  }

  const handleNextPage = () => {
    if (page === 2) {
      handleSkip();
    } else {
      setPage(page + 1);
    }
  };

  return (
    <SafeAreaView style={styles.stepContainer}>
      {Platform.OS === 'android' && <StatusBar backgroundColor={'#0CC482'} barStyle={'dark-content'}></StatusBar>}
      {page !== 0 && (
        <TouchableOpacity onPress={handleBackPage} style={styles.buttonBack}>
          <ArrowBackGreen />
        </TouchableOpacity>
      )}
      <View style={[styles.stepContent, { marginTop: page === 0 ? 55 : 20 }]}>
        {page === 0 && <CommunityComponent />}
        {page === 1 && <ChallengeAndWin />}
        {page === 2 && <AppConstruction />}
        <View style={styles.containerButtons}>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.stepSkip}>
              Saltar intro
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextPage} style={styles.stepButton}>
            <Text style={styles.stepTextButton}>
              {page === 2 ? "Empezar" : "Continuar"}
            </Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
            <View style={[styles.stepPosition, { backgroundColor: page === 0 ? '#00443B' : '#FFFFFF' }]} />
            <View style={[styles.stepPosition, { backgroundColor: page === 1 ? '#00443B' : '#FFFFFF' }]} />
            <View style={[styles.stepPosition, { backgroundColor: page === 2 ? '#00443B' : '#FFFFFF' }]} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
};

const CommunityComponent = () => (
  <>
    <Community />
    <Text style={styles.stepTitle}>Nuestra comunidad</Text>
    <Text style={[styles.stepSubtitle, { marginTop: 25, }]}>¡Bienvenido a Laurel Gaming!</Text>
  </>
);

const ChallengeAndWin = () => (
  <>
    <ThumbStep />
    <Text style={styles.stepTitle}>Reta, juega y ¡gana!</Text>
    <Text style={[styles.stepSubtitle, { marginTop: 25, }]}>Prepárate para retar, jugar y competir con tus</Text>
    <Text style={styles.stepSubtitle}>amigos por las mejores recompensas.</Text>
    <Text style={styles.stepSubtitle}>Por el momento disfruta de nuestro Trivoo y de</Text>
    <Text style={styles.stepSubtitle}>cualquier reto personalizado que puedas</Text>
    <Text style={styles.stepSubtitle}>imaginar.</Text>
  </>
);

const AppConstruction = () => (
  <>
    <Community />
    <Text style={styles.stepTitle}>App en construcción</Text>
    <Text style={[styles.stepSubtitle, { marginTop: 25, }]}>Os informamos que esta es la primera versión</Text>
    <Text style={styles.stepSubtitle}>de la app. Estamos trabajando ya en las</Text>
    <Text style={styles.stepSubtitle}>siguientes versiones, donde podréis encontrar</Text>
    <Text style={styles.stepSubtitle}>más juegos, más recompensas y muchas más</Text>
    <Text style={styles.stepSubtitle}>posibilidades de diversión.</Text>
  </>
);

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    backgroundColor: '#0CC482'
  },
  stepContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonBack: {
    marginTop: 15,
    marginLeft: 20,
    borderRadius: 100,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepTitle: {
    marginTop: 25,
    color: '#00443B',
    fontFamily: 'Apercu Pro Medium',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 20,
  },
  stepSubtitle: {
    color: '#00443B',
    fontFamily: 'Apercu Pro',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 20
  },
  containerButtons: {
    top: Dimensions.get('window').height - 250,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepSkip: {
    color: '#00443B',
    fontFamily: 'Apercu Pro',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  stepTextButton: {
    color: '#FFFFFF',
    fontFamily: 'Apercu Pro',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 15,
  },
  stepButton: {
    marginTop: 15,
    width: 332,
    height: 51,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00443B',
    borderRadius: 100,
  },
  stepPosition: {
    borderRadius: 100,
    width: 6,
    height: 6,
    marginRight: 10
  }
});

export default StepOfWelcome;