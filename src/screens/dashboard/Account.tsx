import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import client from '../../../client';
import { AuthContext } from '../../routes';
import { getData, storeData } from '../../utils';
import PersonalInformation from '../../assets/personal_information.svg';
import MusicAndNotifications from '../../assets/music_and_notifications.svg';
import InviteFriend from '../../assets/invite_friend.svg';
import Help from '../../assets/help.svg';
import Legal from '../../assets/legal.svg';
import Logout from '../../assets/logout.svg';
import ArrowRight from '../../assets/arrow_right.svg';
import ArrowRightRed from '../../assets/arrow_right_red.svg';
import DeleteAccount from '../../assets/delete_account.svg';
import ChangePassword from '../../assets/change-password.svg';
import SuggestImprovement from '../../assets/suggest-improvement.svg';
import CustomModal from '../../components/modal';
import WebView from 'react-native-webview';

const Account: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { signOut } = useContext<any>(AuthContext);
  const [openModal, setOpenModal] = useState(false);
  const [type, setType] = useState('');

  useEffect(() => {
    const getMe = async () => {
      const user = await getData('user');
      const { loginType }: any = user;
      setType(loginType);
    };
    getMe();
  }, []);

  const items = [
    {
      name: 'Datos personales',
      icon: <PersonalInformation width={16} height={16} />,
      action: () => navigation.navigate('PersonalInformation')
    },
    {
      name: 'Musica & Notificaciones',
      icon: <MusicAndNotifications width={14} height={17} />,
      action: () => navigation.navigate('MusicAndNotifications')
    },
    {
      name: 'Invita a un amigo',
      icon: <InviteFriend width={16} height={16} />,
      action: () => navigation.navigate('AppShare')
    },
    {
      name: 'Cambiar contraseña',
      icon: <ChangePassword width={16} height={16} />,
      action: () => navigation.navigate('ChangePassword'),
      hide: type !== 'manual',
    },
    {
      name: 'Ayuda',
      icon: <Help width={16} height={16} />,
      action: () => navigation.navigate('Help'),
    },
    {
      name: 'Sugerir mejora',
      icon: <SuggestImprovement />,
      action: () => navigation.navigate('SendComment'),
    },
    {
      name: 'Legal',
      icon: <Legal width={16} height={16} />,
      action: () => setOpenModal(true)
    },
    {
      name: 'Cerrar sesión',
      icon: <Logout width={16} height={16} />,
      action: async () => {
        try {
          await client.post('/api/auth/logout');
          await storeData(null, 'userToken');
          signOut();
        } catch (error) {
          await storeData(null, 'userToken');
          signOut();
        }
      }
    },
    {
      color: '#FE5B4A',
      name: 'Borrar cuenta',
      icon: <DeleteAccount width={16} height={16} />,
      action: () => navigation.navigate('DeleteAccount')
    }
  ];
  return (
    <View style={styles.viewContent}>
      <ScrollView>
        <View style={styles.viewContainer}>
          <Text style={styles.titleContainer}>
            Gestiona
          </Text>
          <Text style={styles.titleTextAccount}>
            Tu cuenta
          </Text>
          <View style={styles.viewItemsContent}>
            {items
              .filter(item => !item.hide)
              .map((item: any, key: number) => (
                <TouchableOpacity onPress={item.action} key={key} style={styles.item}>
                  <View style={{ marginRight: 10 }}>
                    {item.icon}
                  </View>
                  <Text style={[styles.textItem, { color: item.color || '#00443B' }]}>{item.name}</Text>
                  <View style={{ marginLeft: 'auto' }}>
                    {item.name === 'Borrar cuenta' ? <ArrowRightRed width={8} height={8} /> : <ArrowRight width={8} height={8} />}
                  </View>
                </TouchableOpacity>
              ))}
          </View>
          <CustomModal open={openModal}>
            <SafeAreaView style={[{ backgroundColor: '#00594D', flex: 1 }]}>
              <View style={{ flex: 1 }} >
                <View style={{ flexDirection: 'row', justifyContent: "flex-end" }}>
                  <TouchableOpacity onPress={() => setOpenModal(false)}>
                    <Text style={{ fontSize: 35, marginRight: 12, fontWeight: 'bold' }}>
                      x
                    </Text>
                  </TouchableOpacity>
                </View>
                <WebView
                  startInLoadingState={true}
                  renderLoading={() => (
                    <View style={{ flex: 1 }}>
                      <ActivityIndicator size="large" />
                    </View>
                  )}
                  source={{ uri: 'https://www.laurelgaming.com/legal' }}
                />

              </View>
            </SafeAreaView>
          </CustomModal>
          <Text style={styles.textVersion}>Versión 1.01</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  viewContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  viewItemsContent: {
    marginTop: 40,
  },
  item: {
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textVersion: {
    marginTop: 30,
    fontSize: 10,
    color: '#00443B',
    fontFamily: 'Apercu Pro',
  },
  textItem: {
    fontSize: 15,
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
  },
  iconItem: {
    width: 16,
    height: 16,
    marginRight: 10,
  },
  arrowRight: {
    width: 5,
    height: 8,

  },
  viewContainer: {
    padding: 21,
  },
  titleContainer: {
    fontSize: 12,
    color: '#00443B',
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    marginBottom: Platform.OS === 'ios' ? 7 : 0
  },
  titleTextAccount: {
    fontSize: 20,
    color: '#00443B',
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
  },
});

export default Account;