import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";
import client from '../../client';
import BackgroundTimer from 'react-native-background-timer';
import { ACTIONS } from '../controllers/games/questions/settings';
import { Restaurant } from '../types';

export const storeData = async (value: any, name: string) => {
  try {
    await AsyncStorage.setItem(name, JSON.stringify(value));
  } catch (error) {

  }
}

export const removeItemOfStore = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
};

export const saveTokenPhonebyUser = async (tokenPhone: string) => {
  try {
    const result = await client.post('/api/auth/saveTokenPhonebyUser', {
      tokenPhone
    });

    if (result.data.success) {
      await storeData(tokenPhone, 'tokenPhone');
    }
  } catch (error) {
    console.log(error)
  }
};

export const refreshTokenPhone = async (refreshTokenPhone: string) => {
  try {
    const tokenPhone = await getData('tokenPhone');
    if (tokenPhone !== refreshTokenPhone) {
      const result = await client.post('/api/auth/refreshTokenPhone', {
        tokenPhone,
        refreshTokenPhone
      });
      if (result.data.success) {
        await storeData(refreshTokenPhone, 'tokenPhone');
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export function extractJWT(token: string): any {
  return jwt_decode(token)
}

export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(e)
  }
}

export const removeSpacePhoneNumber = (str: any) => {
  str = str
    .replace('(', '')
    .replace(')', '')
    .replace(/\s/g, '')
    .replace(/\-/g, '');
  return str;
};

export const phoneRegex = /^\+[1-9]\d{10,14}$/;

export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const sleep = (milliseconds: any) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export const gameBoxColors = (status: number) => {
  let boxColor = ''
  let textColor = ''
  let text = 'Pendiente'
  switch (status) {
    case 1: {
      boxColor = "#E2F4F8"
      textColor = "#108BE3"
      text = '¡Listo!'
      break
    }
    case 2: {
      boxColor = "#FAF3ED"
      textColor = "#F6A442"
      text = 'Pendiente'
      break
    }
    case 3: {
      boxColor = "#FAF0F0"
      textColor = "#FE5B4A"
      text = '¡Retirado!'
      break
    }
    default: {
      boxColor = "#FAF3ED"
      textColor = "#F6A442"
      text = 'Pendiente'
      break
    }
  }
  return {
    boxColor,
    textColor,
    text
  }
}

export const runBackgroundTimer = async (setRemainingTime: any) => {
  let time = 10
  BackgroundTimer.runBackgroundTimer(() => {
    setRemainingTime(time)
    time -= 1
  }, 1000);
}

export const stopBackgroundTimer = () => {
  BackgroundTimer.stopBackgroundTimer()
}

export const backgroundTaks = async (gamematchId: any, token: any, betSettings: any, setQuestionNumber: any, handleAction: any) => {
  let questionNumber = 0
  await sleep(2000)
  handleAction({
    type: ACTIONS.READY_FOR_NEXT_RAUND,
    params: {
      token,
      gamematchId: gamematchId,
      betSettings
    }
  })
  if (questionNumber < 10) {
    const newQuestionNumber = questionNumber
    setQuestionNumber(newQuestionNumber + 1)
  }
}

export const getCoupons = (restaurant: Restaurant, friends: number) => {
  // const type = restaurant.generalCoupon ? 'general' : restaurant.uniqueCoupon ? 'unico' : false
  // switch (type) {
  //   case 'general': {
  //     const coupons = restaurant.coupons
  //     if (!coupons.length) {
  //       return false
  //     }
  //     return coupons[0]
  //   }
  //   case 'unico': {
  //     const coupons = restaurant.coupons
  //     // Check if coupons is bigger than 0 and equal to friends length
  //     if (!coupons.length || coupons.length >= friends) {
  //       // if general copuon is not bigger than 0 return false else return general coupon
  //       if (!coupons.length) {
  //         return false
  //       }
  //       return coupons[0]
  //     }
  //     return coupons[0]
  //   }
  //   default: {
  //     return false
  //   }
  // }
}