import React, { useContext, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Animated } from 'react-native';
import { AuthContext } from '../../routes';
const IMG_SPLASH = require('../../assets/icon_splash.png')


const Splash: React.FC<{ navigation?: any }> = ({ }) => {
  const rotateAnimation = new Animated.Value(0);
  const { splash } =  useContext<any>(AuthContext);
  useEffect(() => {
    Animated.timing(rotateAnimation, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true
    }).start(() => {
      rotateAnimation.setValue(0);
      splash();
    });
  }, []);

  const interpolateRotating = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  const animatedStyle = {
    width: 128,
    height: 128,
    transform: [
      {
        rotate: interpolateRotating,
      },
    ],
  };
  return (
    <SafeAreaView style={styles.splashView}>
      <Animated.Image style={animatedStyle} source={IMG_SPLASH} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  splashView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0CC482'
  },
});

export default Splash;