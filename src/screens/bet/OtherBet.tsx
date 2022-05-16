import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useDispatch, useStore } from 'react-redux';
import { createBet, updateBeat } from '../../controllers/bet/actions';
import { updateOther } from '../../controllers/games/other';
import ImgArrowBack from '../../assets/arrow-back-green.svg'
import client, { useAxios } from '../../../client';
import Suggestion from '../../components/suggestion';
import { getData, storeData } from '../../utils';
import uuid from 'react-uuid';

const OtherBet: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
  const store = useStore()
  const [val, setVal] = useState("");
  const otherStore = store.getState()?.otherGame
  const [saveSuggestion, setSaveSuggestion] = useState(false);
  const [suggestionsOthersLocal, setSuggestionsOthersLocal] = useState<any>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const getSuggestions = async () => {
      const suggestionsOthers = await getData('suggestionsOthers');
      setSuggestionsOthersLocal(suggestionsOthers || []);
    };
    getSuggestions();
  }, []);

  const { loading, data, refetch } = useAxios('/api/suggestion/getSuggestions?type=others');

  const handleChallenge = async () => {
    if (saveSuggestion) {
      const suggestions = [...suggestionsOthersLocal];
      
      suggestions.unshift({ id: uuid(), text: val, type: 'others' });
      await storeData(suggestions, 'suggestionsOthers');
    };

    switch (route?.params?.game) {
      case 'trivoo': {
        dispatch(updateBeat({
          betSettings: JSON.stringify({ value: val, type: 'Otro', id: 2 }),
          restaurantInfo: {}
        }));
        dispatch(createBet(navigation));
        break;
      }
      case 'customChallenge': {
        dispatch(updateOther({
          betSettings: JSON.stringify({ value: val, type: 'Otro', id: 2 })
        }));
        const { data } = await client.post('/api/games/challenge/customChallenge/create', { ...otherStore, betSettings: JSON.stringify({ value: val, type: 'Otro', id: 2 }) })
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
  const handleTextChange = (text: string) => {
    setVal(text);
    setSaveSuggestion(true);
  };

  const handleTextChangeWithSuggestion = (text: string) => {
    setVal(text);
    setSaveSuggestion(false);
  };

  const handleGoback = () => {
    dispatch(updateBeat({
      betSettings: null
    }))
    dispatch(updateOther({
      betSettings: null
    }))
    navigation.navigate('BET-TYPES', { color: route?.params?.color, game: route?.params?.game });
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={{ padding: Platform.OS === 'ios' ? 20 : 0 }}>
          <View style={styles.containerTitle}>
            <TouchableOpacity style={{
              borderRadius: 100,
              height: 40,
              width: 40,
              justifyContent: 'center',
            }} onPress={() => handleGoback()}>
              <ImgArrowBack width={12} height={10} />
            </TouchableOpacity>
            <Text style={styles.title}>Escribe tu apuesta</Text>
          </View>
          <View style={[styles.boxText, { margin: Platform.OS === 'ios' ? 21 : 0, }]}>
            <Text style={styles.betText}>Tu apuesta</Text>
            <TextInput
              style={styles.inputText}
              value={val}
              maxLength={80}
              onChangeText={handleTextChange}
              multiline
            />
          </View>
          <Suggestion
            data={suggestionsOthersLocal?.concat(data)}
            refetch={refetch}
            loading={loading}
            borderColor='#108BE3'
            onChangeText={handleTextChangeWithSuggestion} />
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity
            disabled={!val.trim()}
            onPress={handleChallenge}
            style={!val.trim() ? {
              ...styles.challengeButtonDisabled,
              backgroundColor: route?.params?.color === 'green' ? "#E9F6ED" : "#E2F4F8"
            } : {
              ...styles.challengeButton,
              backgroundColor: route?.params?.color === 'green' ? "#0CC482" : "#108BE3"
            }}>
            <Text style={styles.challengeTextButton}>Retar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  containerTitle: {
    padding: Platform.OS === 'ios' ? 21 : 0,
    paddingBottom: 0,
    paddingTop: 0,
    backgroundColor: '#FFFFFF',
  },
  arrowBack: {
    width: 12,
    height: 10,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    marginTop: 10,
    color: '#00443B',
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
  },
  challengeButton: {
    backgroundColor: '#108BE3',
    borderRadius: 100,
    width: 332,
    height: 51,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  challengeButtonDisabled: {
    backgroundColor: '#E2F4F8',
    borderRadius: 100,
    width: 332,
    height: 51,
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
  boxText: {
    height: 190,
    padding: 21,
    marginTop: 21,
    borderWidth: 2,
    borderRadius: 25,
    borderColor: "#EAEAEA",
    marginVertical: 20
  },
  betText: {
    fontSize: 10,
    color: '#00443B',
    fontFamily: 'Apercu Pro',
    fontWeight: 'normal',
  },
  inputText: {
    fontSize: 15,
    color: '#00443B',
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    height: 160,
    textAlignVertical: 'top',
  }
});

export default OtherBet;