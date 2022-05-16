import React from "react";
import { StyleSheet, Text, View } from "react-native";
import IconScreen from '../../../../../assets/screen-two.svg'

const ScreenTwo = () => (
  <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 150, marginBottom: 150 }}>
    <IconScreen />
    <Text style={[styles.textMsg, { marginTop: 30 }]}>
      Una vez seleccionada
    </Text>
    <Text style={styles.textMsg}>
      una opción no se podrá
    </Text>
    <Text style={styles.textMsg}>
      cambiar.
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

export default ScreenTwo;