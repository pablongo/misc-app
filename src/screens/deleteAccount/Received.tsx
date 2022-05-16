import React from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ReceivedImg from '../../assets/received.svg'

const Received: React.FC<{ navigation: any }> = ({ navigation }) => {

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 200 }}>
        <ReceivedImg />
        <Text style={styles.title}>
          ¡Recibido!
        </Text>
        <Text style={styles.textContent}>
          Gracias por su mensaje. Nos ayudará a
        </Text>
        <Text style={styles.textContent}>
          mejorar y seguir creciendo.
        </Text>
        <TouchableOpacity onPress={() => navigation.replace('Dashboard')} style={styles.button}>
          <Text style={styles.textButton}>Volver a Laurel Gaming</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
    fontFamily: 'Apercu Pro',
    color: '#00443B'
  },
  textContent: {
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'Apercu Pro',
    color: '#00443B'
  },
  button: {
    backgroundColor: '#00443B',
    borderRadius: 100,
    marginTop: Dimensions.get('window').height - 600,
    width: 332,
    height: 51,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  textButton: {
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#FFFFFF',
  },
});

export default Received;