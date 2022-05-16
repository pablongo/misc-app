import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import Thumb from '../../assets/thumb.svg';
import ThumbUp from '../../assets/thumb-up.svg';
import BackgroundThumb from '../../assets/background-thumb.svg';
import ThumbDown from '../../assets/thumb-down.svg';


const AnimationImage = ({ win = false }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const [img, setImg] = useState(0);
  useEffect(() => {
    setImg(0)
    Animated.timing(
      fadeAnim,
      {
        toValue: 0,
        duration: 800,
        useNativeDriver: true
      }
    ).start(() => {
      Animated.timing(
        fadeAnim,
        {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true
        }
      ).start(() => {
        setImg(1)
        Animated.timing(
          fadeAnim,
          {
            toValue: 1,
            duration: 190,
            useNativeDriver: true
          }
        ).start(() => {
          setImg(2)
        })
      })
    }
    )
  }, [fadeAnim]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={styles.container}>
        {img === 0 && <BackgroundThumb />}
        {img === 1 && <Thumb />}
        {(img === 2 && win) && <ThumbUp />}
        {(img === 2 && !win) && <ThumbDown />}
        {img === 2 && (
          <Text style={[styles.subtitle, { marginTop: win ? 0 : 50, }]}>{win ? "¡Victoria!" : "¡Derrota!"}</Text>
        )
        }
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    fontFamily: 'Apercu Pro',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
    color: '#FFFFFF',
    fontStyle: 'normal',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default AnimationImage;