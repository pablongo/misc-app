import { useEffect, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import Contacts from 'react-native-contacts';
import { getContacts } from "../../services/Contacts";
import { removeSpacePhoneNumber } from "../../utils";

export const useLoadContacts = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState([]);
  const [error, setError]: any = useState(null);
  const getAllContacts = async (activeLoading = true) => {
    try {
      if (activeLoading) {
        setLoading(true);
        setData([]);
      }
      setError(null);
      const numbers: string[] = [];
      const contacts = await Contacts.getAll();
      contacts.forEach((item: any) => {
        const { phoneNumbers } = item;
        phoneNumbers.forEach((phoneNumber: any) => {
          let number = removeSpacePhoneNumber(phoneNumber.number);
          numbers.push(number);
        });
      });

      getContacts(numbers)
        .then((response: any) => setData(response.data))
        .catch((error: any) => setError(error))
        .finally(() => setLoading(false));

    } catch (e: any) {
      setError(e);
      setLoading(false);
    }
  };

  const requestWithPermissions = async (activeLoading = true) => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
        .then(granted => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getAllContacts(activeLoading);
          } else {
            setLoading(false);
            setError({ message: 'denied' });
          }
        });
    } else {
      getAllContacts(activeLoading);
    }
  };

  useEffect(() => {
    requestWithPermissions();
  }, []);

  return { data, error, loading, refetch: requestWithPermissions };
};