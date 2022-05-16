import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useStore } from 'react-redux';
import { updateBeat, createBet } from '../../controllers/bet/actions';
import { updateOther } from '../../controllers/games/other';
import numbro from "numbro";
import ImgArrowBack from '../../assets/arrow-back-green.svg'
import client from '../../../client';

const EconomicBet: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const store = useStore()
  const otherStore = store.getState()?.otherGame
  const [amount, setAmount] = useState(0);
  const [friends, setFriends] = useState([]);
  const disabledDecrement = amount <= 0;

  const handleChallenge = async () => {
    switch (route?.params?.game) {
      case 'trivoo': {
        dispatch(updateBeat({
          betSettings: JSON.stringify({ value: amount, type: 'Economic', id: 1 }),
          restaurantInfo: {}
        }))
        dispatch(createBet(navigation));
        break;
      }
      case 'customChallenge': {
        dispatch(updateOther({
          betSettings: JSON.stringify({ value: amount, type: 'Economic', id: 1 })
        }))
        const { data } = await client.post('/api/games/challenge/customChallenge/create', { ...otherStore, betSettings: JSON.stringify({ value: amount, type: 'Economic', id: 1 }) })
        navigation.navigate('custom-challenge-page', { color: route?.params?.color, game: route?.params?.game, gameId: data.d.gameId })
        break;
      }
      default: {
        dispatch(updateBeat({
          betSettings: null
        }))
        dispatch(updateOther({
          betSettings: null
        }));
        navigation.navigate('Dashboard');
        break;
      }
    }
  };

  const handleAddAmount = () => setAmount(amount + 1);

  const handleDecrementAmount = () => {
    if (!disabledDecrement) setAmount(amount - 1);
  }

  const handleGoback = () => {
    dispatch(updateBeat({
      betSettings: null
    }))
    dispatch(updateOther({
      betSettings: null
    }))

    navigation.navigate('BET-TYPES', { color: route?.params?.color, game: route?.params?.game });
  }

  useEffect(() => {
    setAmount(0)
    switch (route?.params?.game) {
      case 'trivoo': {
        setFriends(store.getState().betCreation.friends)
        break;
      }
      case 'customChallenge': {
        setFriends(store.getState().otherGame.friends)
        break;
      }
      default: {
        setFriends([])
        break;
      }
    }
  }, [])
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.safeAreaView}>
        <TouchableOpacity onPress={() => handleGoback()}>
          <ImgArrowBack width={12} height={10} />
        </TouchableOpacity>
        <View style={styles.viewContainer}>
          <Text style={styles.title}>Selecciona la apuesta total</Text>
          <View style={styles.amountInput}>
            <TouchableOpacity
              style={disabledDecrement ? styles.controlInputAmountLeft : {
                ...styles.controlInputAmountRight,
                borderColor: route?.params?.color === 'blue' ? '#EAEAEA' : '#0CC482'
              }}
              disabled={disabledDecrement}
              onPress={handleDecrementAmount}>
              <Text style={styles.textControlInputAmount}>-</Text>
            </TouchableOpacity>
            <Text style={{ ...styles.amount, fontSize: amount >= 100 && amount < 1000 ? 70 : amount >= 1000 ? 50 : 90 }}>{amount} €</Text>
            <TouchableOpacity
              style={{
                ...styles.controlInputAmountRight,
                borderColor: route?.params?.color === 'blue' ? '#EAEAEA' : '#0CC482'
              }}
              onPress={handleAddAmount}>
              <Text style={styles.textControlInputAmount}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.entrada}>Bote total: {numbro((amount * friends.length)).format({ trimMantissa: true, mantissa: 2 })}€</Text>
          <Text style={styles.jugadores}>{friends.length} {friends.length > 1 ? 'jugadores' : 'jugador'}</Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity
            disabled={disabledDecrement}
            onPress={handleChallenge}
            style={disabledDecrement ? {
              ...styles.challengeButtonDisabled,
              backgroundColor: route?.params?.color === 'green' ? "#E9F6ED" : "#E2F4F8"
            } : {
              ...styles.challengeButton,
              backgroundColor: route?.params?.color === 'green' ? "#0CC482" : "#108BE3"
            }}>
            <Text style={styles.challengeTextButton}>Retar {!disabledDecrement ? `a ${amount}€` : null}</Text>
          </TouchableOpacity>
        </View>
      </View>

    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
    padding: 21,
    backgroundColor: '#FFFFFF',
  },
  containerTitle: {
    padding: 21,
  },
  viewContainer: {
    flex: 0.5,
    justifyContent: 'center',
    marginBottom: 200
  },
  challengeButton: {
    backgroundColor: '#108BE3',
    borderRadius: 100,
    width: 332,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  challengeButtonDisabled: {
    backgroundColor: '#E2F4F8',
    borderRadius: 100,
    width: 332,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  challengeTextButton: {
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#00443B',
  },
  textControlInputAmount: {
    fontFamily: 'Apercu Pro',
    color: '#00443B',
    fontSize: 20,
  },
  controlInputAmountLeft: {
    width: 44,
    height: 44,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    borderColor: '#EAEAEA',
  },
  controlInputAmountRight: {
    width: 44,
    height: 44,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    borderColor: '#108BE3',
  },
  amount: {
    fontFamily: 'Laurel',
    fontSize: 90,
    color: '#00443B',
  },
  arrowBack: {
    width: 12,
    height: 10,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    color: '#00443B',
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  entrada: {
    fontSize: 24,
    marginTop: 20,
    color: '#00443B',
    fontFamily: 'Apercu Pro',
    fontWeight: '500',
    textAlign: 'center',
  },
  jugadores: {
    fontSize: 12,
    marginTop: 20,
    color: '#00443B',
    fontFamily: 'Apercu Pro',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountInput: {
    margin: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    textAlign: 'right',
    width: 'fit-content',
  },
  sufix: {
    textAlignVertical: 'center',
    textAlign: 'left',
  },
});

export default EconomicBet