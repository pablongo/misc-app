import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { updateBeat } from '../../controllers/bet/actions';
import { updateOther } from '../../controllers/games/other';
import ImgArrowBack from '../../assets/arrow-back-green.svg'
import ImgEeconomyBlue from '../../assets/economyBlue.svg'
import ImgEconomyGreen from '../../assets/economyGreen.svg'
import ImgOtherGreen from '../../assets/otherGreen.svg'
import ImgOtherBlue from '../../assets/otherBlue.svg'
import ImgFoodGreen from '../../assets/foodGreen.svg'
import ImgFoodBlue from '../../assets/foodBlue.svg'
import { logEvent } from '../../utils/Amplitude';

const types = [{
  id: 1,
  name: "Económica",
  pathName: 'BET-ECONOMIC-TYPE'
},
{
  id: 2,
  name: "Otros",
  pathName: 'BET-OTHER-TYPE'
},
{
  id: 3,
  name: "Comida",
  pathName: 'BET-RESTAURANT-TYPE'
}
]

const BetTypes: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
  const dispatch = useDispatch()

  const handleSelectType = (typeItem: any) => {
    logEvent("TYPE_BET_EVENT", { type: typeItem?.name, game: route?.params?.game });
    switch (route?.params?.game) {
      case 'trivoo': {
        if (route?.params?.rematch) {
          dispatch(updateBeat({
            ...route.params
          }))
          navigation.navigate(typeItem.pathName, { color: route?.params?.color, game: route?.params?.game })
        } else {
          dispatch(updateBeat({
            type: typeItem.id
          }))
          navigation.navigate(typeItem.pathName, { color: route?.params?.color, game: route?.params?.game })
        }
        break;
      }
      case 'customChallenge': {
        dispatch(updateBeat({
          type: typeItem.id
        }))
        navigation.navigate(typeItem.pathName, { color: route?.params?.color, game: route?.params?.game })
        break;
      }
      default: {
        dispatch(updateBeat({
          type: null
        }))
        dispatch(updateOther({
          type: null
        }));
        navigation.navigate('Dashboard');
        break;
      }
    }
  }

  const handleGoback = () => {
    switch (route?.params?.game) {
      case 'trivoo': {
        dispatch(updateBeat({
          type: null
        }))
        navigation.navigate('SelectFriends', { color: route?.params?.color, game: route?.params?.game })
        break;
      }
      case 'customChallenge': {
        dispatch(updateBeat({
          type: null
        }))
        navigation.navigate('SelectFriends', { color: route?.params?.color, game: route?.params?.game })
        break;
      }
      default: {
        dispatch(updateBeat({
          type: null
        }))
        dispatch(updateOther({
          type: null
        }));
        navigation.navigate('Dashboard');
        break;
      }
    }
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.containerTitle}>
        <TouchableOpacity onPress={() => handleGoback()}>
          <ImgArrowBack width={12} height={10} />
        </TouchableOpacity>
        <Text style={styles.title}>
          Selecciona el tipo de apuesta
        </Text>
      </View>
      <ScrollView>
        <View style={styles.categoryContainer}>
          {types.filter((type) => {
            if (type.name === 'Comida' && route?.params?.game === 'customChallenge') {
              return false
            }
            return true
          }).map((type) => (
            <TouchableOpacity
              key={type.id}
              style={styles.card}
              onPress={() => { handleSelectType(type) }}
            >
              {/* Económica */}
              {type.name === 'Económica' ? (
                <View style={styles.cardContent}>
                  {route?.params?.color === 'green' ? (
                    <ImgEconomyGreen width={68} height={68} />
                  ) : null}
                  {route?.params?.color === 'blue' ? (
                    <ImgEeconomyBlue width={68} height={68} />
                  ) : null}
                  <Text style={styles.categoryName}>{type.name}</Text>
                </View>
              ) : null}
              {/* Comida */}
              {type.name === 'Comida' ? (
                <View style={styles.cardContent}>
                  {route?.params?.color === 'green' ? (
                    <ImgFoodGreen width={68} height={68} />
                  ) : null}
                  {route?.params?.color === 'blue' ? (
                    <ImgFoodBlue width={68} height={68} />
                  ) : null}
                  <Text style={styles.categoryName}>{type.name}</Text>
                </View>
              ) : null}
              {/* Otros */}
              {type.name === 'Otros' ? (
                <View style={styles.cardContent}>
                  {route?.params?.color === 'green' ? (
                    <ImgOtherGreen width={68} height={68} />
                  ) : null}
                  {route?.params?.color === 'blue' ? (
                    <ImgOtherBlue width={68} height={68} />
                  ) : null}
                  <Text style={styles.categoryName}>{type.name}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    adding: 21,
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  containerTitle: {
    padding: 21,
  },
  loadingOrError: {
    marginTop: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowBack: {
    width: 12,
    height: 10,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    marginTop: 20,
    color: '#00443B',
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
  },
  categoryContainer: {
    margin: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    width: '48%',
    backgroundColor: '#E2F4F8',
    height: 179,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 68,
    height: 68,
    marginTop: 30,
  },
  categoryName: {
    marginTop: 20,
    color: '#00443B',
    fontSize: 15,
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
  },
})

export default BetTypes; 