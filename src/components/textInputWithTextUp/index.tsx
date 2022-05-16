import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';


const TextInputWithTextUp: React.FC<{
  value?: string | undefined
  defaultValue?: string | undefined
  placeholder?: string | undefined
  onChange?: (text: string) => void
  onFocus?: () => void
  multiline?: boolean | undefined
  onKeyPress?: () => void
  style?: any
}> = ({
  value,
  defaultValue,
  placeholder,
  onChange,
  style,
  onFocus,
  onKeyPress,
  multiline,
}) => {
    const [text, setText] = useState(value || '');
    const handleText = (text: string) => {
      if (defaultValue && defaultValue.length > 0) return;

      setText(text);
      if (onChange) onChange(text);
    };

    useEffect(() => {
      if (value && value?.length > 0) {
        setText(value);
        if (onChange) onChange(value);
      }
    }, [value]);
    return (
      <View style={[styles.boxText, style]}>
        <Text style={styles.placeholderText}>
          {placeholder || 'example'}
        </Text>
        <TextInput
          onKeyPress={onKeyPress}
          onFocus={onFocus}
          style={styles.inputText}
          value={defaultValue || text}
          onChangeText={handleText}
          multiline={multiline}
        />
      </View>
    );
  };


const styles = StyleSheet.create({
  inputText: {
    fontSize: 15,
    color: '#00443B',
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    height: 39,
    width: 332,
    textAlign: 'center',
    textAlignVertical: 'top',
  },
  boxText: {
    width: 332,
    height: 51,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 100,
    borderColor: "#EAEAEA",
  },
  placeholderText: {
    fontSize: 10,
    marginTop: 10,
    color: '#00443B',
    fontFamily: 'Apercu Pro',
    fontWeight: 'normal',
  },
})

export default TextInputWithTextUp;