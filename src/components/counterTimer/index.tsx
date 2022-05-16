import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const windowHeight = Dimensions.get('window').height;
const heightQuestion = windowHeight - 570;

const CounterTimer: React.FC<{
  onPress?: Function,
  initialMinute?: number,
  initialSeconds?: number,
}> = ({ onPress, initialMinute = 0, initialSeconds = 30 }) => {
  const [minutes, setMinutes] = useState(initialMinute);
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval)
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);

    return () => {
      clearInterval(myInterval);
    };
  });

  const handleStartTimer = () => {
    setSeconds(initialSeconds);
    if (onPress && typeof onPress === 'function') onPress();
  }

  return (
    <View>
      {minutes === 0 && seconds === 0
        ? (
          <>
            <Text style={styles.textTimer}>
              ¿Problemas para pedir el código?
            </Text>
            <TouchableOpacity
              onPress={handleStartTimer}>
              <Text style={styles.resendCode}>
                Pedir uno de nuevo
              </Text>
            </TouchableOpacity>
          </>
        )
        : <Text style={styles.textTimer}>Volver a enviar en {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</Text>
      }
    </View>
  )

}

const styles = StyleSheet.create({
  textTimer: {
    fontFamily: 'Apercu Pro',
    color: '#FFFFFF',
    marginTop: heightQuestion,
    fontSize: 15
  },
  resendCode: {
    fontFamily: 'Apercu Pro',
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 15,
    textDecorationLine: 'underline',
  }
});

export default CounterTimer;