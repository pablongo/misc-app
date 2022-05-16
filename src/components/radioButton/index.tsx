import React, { useEffect, useState } from 'react';
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const RadioButton: React.FC<{
  style?: any,
  content?: string | React.ReactNode,
  checked?: boolean,
  onChange?: ((checked: boolean) => void),
  onPressText?: ((event: GestureResponderEvent) => void)
}> = ({ style, onChange, checked, onPressText, content = '' }) => {
  const [checkedValue, setCheckedValue] = useState(false);
  useEffect(() => setCheckedValue(checked || false), [checked]);
  const handleChecked = () => {
    const defaultValueCheck = typeof checked !== 'boolean';
    if (defaultValueCheck) setCheckedValue(!checkedValue);
    if (onChange) onChange(defaultValueCheck ? !checkedValue : checkedValue);
  };
  return (
    <View style={[styles.radioButton, style]}>
      <TouchableOpacity
        onPress={handleChecked}
        style={styles.radioCircle}>
        {checkedValue && <View style={styles.selectedRb} />}
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressText} disabled={!onPressText}>
        {content}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  radioButton: {
    flexDirection: 'row',
  },
  radioCircle: {
    height: 19,
    width: 19,
    marginTop: 2,
    marginRight: 10,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRb: {
    width: 8,
    height: 8,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
  },
  iconRadioButton: {
    width: 16,
    height: 17,
    marginRight: 5,
  }
})

export default RadioButton;