import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Show from '../../assets/show.svg';
import Hide from '../../assets/hide.svg';

const InputPassword = (props: any) => {
  const [showPassword, setShowPassword] = useState(true);

  return (
    <View style={styles.inputView}>
      <TextInput
        {...props}
        style={styles.input}
        placeholderTextColor="#ffff"
        secureTextEntry={showPassword}
      />
      <TouchableOpacity style={styles.eye} onPress={() => setShowPassword(!showPassword)}>
        {showPassword ? <Show width={15} height={15} /> : <Hide width={15} height={15} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  eye: {
    left: 15,
    borderRadius: 100,
    padding: 10,
  },
  inputView: {
    width: 332,
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    borderColor: '#0CC482',
    height: 51,
    borderWidth: 1,
    borderRadius: 100,
  },
  input: {
    textAlign: 'center',
    width: 240,
    left: 14,
    margin: 5,
    height: 51,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'Apercu Pro',
  },
});

export default InputPassword;