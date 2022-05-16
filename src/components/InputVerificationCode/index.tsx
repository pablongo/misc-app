import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const InputVerificationCode: React.FC<{
  onChange?: ((value: string) => void),
  isComplete?: ((result: boolean) => void),
  style?: any,
  placeholder?: string
  placeholderTextColor?: string
}> = ({
  onChange,
  isComplete,
  style,
  placeholder = '-',
  placeholderTextColor = '#ffffff'
}) => {

    const refs: any = useRef([]);
    const [values, setValues] = useState<string[]>([]);

    useEffect(() => {
      const complete = values.filter((v => v)).length === 6;
      if (typeof isComplete === 'function') isComplete(complete);
      if (typeof onChange === 'function') onChange(values.join(''));
    }, [values]);


    const handleChangeText = (i: number) => (text: string) => {
      if (text.trim().length > 0) {
        const currentValues: any = [...values];
        currentValues[i] = text;
        setValues(currentValues);
        if (refs.current[i + 1]) refs.current[i + 1].focus();
      }
    };

    const handleOnKeyPress = (i: number) => (e: any) => {
      const { nativeEvent } = e;
      if (nativeEvent.key === 'Backspace') {
        const currentValues: any = [...values];
        currentValues[i] = '';
        setValues(currentValues);
        if (refs.current[i - 1]) refs.current[i - 1].focus();
      }
    };

    return (
      <View style={styles.container}>
        {[...Array(6)].map((_, i) => (
          <TextInput
            ref={(element) => { refs.current[i] = element; }}
            key={i}
            maxLength={1}
            placeholderTextColor={placeholderTextColor}
            placeholder={placeholder}
            onKeyPress={handleOnKeyPress(i)}
            returnKeyType='next'
            keyboardType='numeric'
            onChangeText={handleChangeText(i)}
            style={[styles.input, style]} />
        ))}
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  input: {
    borderRadius: 100,
    width: 51,
    color: '#fff',
    textAlign: 'center',
    height: 51,
    borderColor: '#0CC482',
    borderWidth: 1,
    margin: 2,
  }
})

export default InputVerificationCode;