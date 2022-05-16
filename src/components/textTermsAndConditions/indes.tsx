import React from 'react';
import { StyleSheet, Text } from 'react-native';

const TextTermsAndConditions = () => (
  <>
    <Text style={styles.textTermsAndConditions}>
      Estoy de acuerdo con{" "}
      <Text style={styles.textTermsAndConditionsLine}>los términos y condiciones de la política de privacidad</Text>
    </Text>
  </>
);

const styles = StyleSheet.create({
  textTermsAndConditions: {
    color: '#FFFFFF',
  },
  textTermsAndConditionsLine: {
    textDecorationLine: 'underline',
  },
})

export default TextTermsAndConditions;