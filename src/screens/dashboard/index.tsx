import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImgControlActive from '../../assets/controlActive.svg'
import ImgControlInactive from '../../assets/controlInactive.svg'
import ImgFriendActive from '../../assets/friendActive.svg'
import ImgFriendInactive from '../../assets/friendInactive.svg'
import ImgShoppingcartActive from '../../assets/shoppingcartActive.svg'
import ImgShoppingcartInactive from '../../assets/shoppingcartInactive.svg'
import ImgAccountActive from '../../assets/accountActive.svg'
import ImgAccountInactive from '../../assets/accountInactive.svg'
import LaurelDashboard from '../../assets/laurel-dashboard.svg'
import ImgTrophy from '../../assets/trophy.svg'
import Modal from "react-native-modal";

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Games from './Games';
import Account from './Account';
import Store from './Store';
import Friends from './Friends';
import Record from '../../components/record';
import { logEvent } from '../../utils/Amplitude';
const Tab = createBottomTabNavigator();

const Dashboard = () => {
  const [openModal, setOpenModal] = useState(false)

  const handleClickTrophy = async () => {
    setOpenModal(true)
  }

  const TabBar = (tab: any) => {
    const { state, descriptors, navigation } = tab;
    return (
      <View style={{ backgroundColor: '#E9F6ED' }}>
        <View style={styles.line} />
        <View style={styles.tabView}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                if (route.name === 'Tienda') logEvent("STORE_EVENT");
                navigation.navigate({ name: route.name, merge: true });
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <TouchableOpacity
                key={index}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E9F6ED' }}
              >
                {index === 0 ?
                  isFocused ? (
                    <ImgControlActive width={16} height={16} />
                  ) : (
                    <ImgControlInactive width={16} height={16} />
                  )
                  : null}
                {index === 1 ?
                  isFocused ? (
                    <ImgFriendActive width={16} height={16} />
                  ) : (
                    <ImgFriendInactive width={16} height={16} />
                  )
                  : null}
                {index === 2 ?
                  isFocused ? (
                    <ImgShoppingcartActive width={16} height={16} />
                  ) : (
                    <ImgShoppingcartInactive width={16} height={16} />
                  )
                  : null}
                {index === 3 ?
                  isFocused ? (
                    <ImgAccountActive width={16} height={16} />
                  ) : (
                    <ImgAccountInactive width={16} height={16} />
                  )
                  : null}

                <Text style={{ color: isFocused ? '#0CC482' : '#00443B' }}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ ...styles.safeAreaView, backgroundColor: '#FFFFFF' }}>
      <View style={styles.viewAppTitle}>
        <LaurelDashboard />
        <TouchableOpacity style={styles.circleTrophy} onPress={() => handleClickTrophy()}>
          <ImgTrophy width={12} height={12} />
        </TouchableOpacity>
      </View>
      <View style={styles.line} />
      <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
        <Tab.Screen
          name="Juegos"
          options={{ headerShown: false }}
          component={Games}
        />
        <Tab.Screen
          name="Amigos"
          options={{ headerShown: false }}
          component={Friends}
        />
        <Tab.Screen
          name="Tienda"
          options={{ headerShown: false }}
          component={Store}
        />
        <Tab.Screen
          name="Cuenta"
          options={{ headerShown: false }}
          component={Account}
        />
      </Tab.Navigator>
      <Modal
        isVisible={openModal}
        style={{ margin: 0 }}
        onBackdropPress={() => setOpenModal(false)}
      >
        <Record setOpenModal={setOpenModal} />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  viewAppTitle: {
    flexDirection: 'row',
    padding: 21,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabView: {
    flexDirection: 'row',
    margin: 20
  },
  titleContainer: {
    fontSize: 12,
    color: '#00443B',
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
  },
  card: {
    width: 159,
    height: 179,
    borderRadius: 15,
    marginBottom: 10,
  },
  trophy: {
    width: 12,
    height: 12
  },
  iconTab: {
    width: 16,
    height: 16
  },
  iconGame: {
    width: 16.33,
    height: 11.9
  },
  circleTrophy: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: '#E9F6ED'
  },
  line: {
    width: '100%',
    height: 1.1,
    backgroundColor: '#EAEAEA',
  },
  appTitle: {
    fontSize: 15,
    color: '#00443B',
    fontFamily: 'Apercu Pro Medium',
    fontStyle: 'normal',
    fontWeight: '700',
  },
});

export default Dashboard;