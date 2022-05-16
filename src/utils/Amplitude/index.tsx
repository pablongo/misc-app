import { Amplitude } from '@amplitude/react-native';
import { AMPLITUDE_KEY } from '../../utils/Constants';

const ampInstance = Amplitude.getInstance();

export const init = () => {
  ampInstance.init(AMPLITUDE_KEY.production);
  enable(true);
};

export const setUserData = ({
  id,
  firstName,
  lastName,
  userName,
  phoneNumber,
  email,
  loginType
}: any) => {
  ampInstance.setUserId(id);
  const userProperties = {
    id,
    firstName,
    lastName,
    userName,
    phoneNumber,
    email,
    loginType
  };
  ampInstance.setUserProperties(userProperties);
};

export const clearUserData = () => ampInstance.clearUserProperties();


export const logEvent = async (name: any, params?: any) => ampInstance.logEvent(name, params);


export const enable = (enable: boolean) => ampInstance.setOptOut(!enable);