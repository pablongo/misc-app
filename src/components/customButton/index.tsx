import React from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';

const CustomButton = (props: any) => {
  const { loading, children, style } = props;

  if (loading) return (
    <TouchableOpacity disabled style={style}>
      <ActivityIndicator />
    </TouchableOpacity>
  );

  return (
    <TouchableOpacity {...props}>
      {children}
    </TouchableOpacity>
  );
}

export default CustomButton;