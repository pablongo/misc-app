import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Divider: React.FC<{ style?: any, backgroundColor?: string, text: string }> = ({
  style,
  text = '',
  backgroundColor = 'black',
}) => (
  <View style={[styles.divider, style]}>
    <View style={[styles.line, { backgroundColor }]} />
    <View>
      <Text style={styles.text}>{text}</Text>
    </View>
    <View style={[styles.line, { backgroundColor }]} />
  </View>
);

const styles = StyleSheet.create({
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    width: 30,
    color: 'white',
    textAlign: 'center'
  },
  line: {
    width: 147,
    height: 1.1
  }
});

export default Divider;
