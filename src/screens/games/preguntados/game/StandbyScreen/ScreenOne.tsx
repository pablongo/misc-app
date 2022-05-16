import React from "react";
import { StyleSheet, View, Text } from "react-native";
import IconScreen from '../../../../../assets/screen-one.svg'

const ScreenOne = () => (
  <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 150, marginBottom: 150 }}>
    <IconScreen />
    <Text style={[styles.textMsg, { marginTop: 30 }]}>
      En caso de empate gana
    </Text>
    <Text style={styles.textMsg}>
      la persona que más rápido
    </Text>
    <Text style={styles.textMsg}>
      haya contestado.
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

export default ScreenOne;