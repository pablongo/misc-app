import React from "react";
import { StyleSheet, Text, View } from "react-native";
import IconScreen from '../../../../../assets/screen-three.svg'

const ScreenThree = () => (
  <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 150, marginBottom: 150 }}>
    <IconScreen />
    <Text style={[styles.textMsg, { marginTop: 30 }]}>
      Si seleccionas salir de la
    </Text>
    <Text style={styles.textMsg}>
      partida, pierdes
    </Text>
    <Text style={styles.textMsg}>
      automáticamente.
    </Text>
  </View>
);

const styles = StyleSheet.create({
  textMsg: {
    fontFamily: 'Apercu Pro',
    fontSize: 20,
    fontWeight: '400',
    fontStyle: 'normal',
    lineHeight: 25,
    color: '#FFFFFF'
  }
});

export default ScreenThree;