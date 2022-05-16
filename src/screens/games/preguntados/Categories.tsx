import React, { useEffect } from 'react';
import {
  ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet,
  Text, TouchableOpacity, View
} from 'react-native';
import { useAxios } from '../../../../client';
import { useDispatch } from 'react-redux';
import { updateBeat } from '../../../controllers/bet/actions';
import ImgArrowBack from '../../../assets/arrow-back-green.svg';
import { getData } from '../../../utils/index';
import { playBackgroundMusic } from '../../../controllers/sound';
import { logEvent } from '../../../utils/Amplitude';


interface AxiosHook {
  data: any,
  error: any,
  loading: boolean,
  refetch?: Function
}

export enum CATEGORIES_COMPONENT_MODES {
  TRAIN = 'train',
  CHALLENGE = 'challenge'
}

const Categories: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
  const mode = route?.params?.mode ? route.params.mode : CATEGORIES_COMPONENT_MODES.TRAIN
  const dispatch = useDispatch()
  const { loading, error, data }: AxiosHook = useAxios('/api/games/questions/getCategories');

  const handleSelectCategory = (category: any) => {
    if (mode === CATEGORIES_COMPONENT_MODES.CHALLENGE) {
      const bet = {
        gameSettings: JSON.stringify({ category })
      }
      logEvent("TYPE_CATEGORY_EVENT", { type: category });
      dispatch(updateBeat(bet))
      navigation.navigate('SelectFriends', { color: 'blue', game: route?.params?.game, friends: route?.params?.friends?.length ? route?.params?.friends : [] })
    }
  }

  useEffect(() => {
    const myFunction = async () => {
      const user = await getData('user')
      if (user.music) {
        playBackgroundMusic()
      }
    }
    myFunction()
  }, [])

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.containerTitle}>
        <TouchableOpacity onPress={() => navigation.navigate('Preguntados', { game: 'trivoo' })}>
          <View style={styles.arrowBack}>
            <ImgArrowBack width={12} height={10} />
          </View>
        </TouchableOpacity>
        <Text style={styles.title}>
          Seleccionar la categoría
        </Text>
      </View>
      <ScrollView>
        {loading && (
          <View style={styles.loadingOrError}>
            <ActivityIndicator size="large" color="#108BE3" />
          </View>
        )}
        {Boolean(error) && (
          <View style={styles.loadingOrError}>
            <Text>Lo sentimos, ha ocurrido un error.</Text>
          </View>
        )}
        {data && (
          <View style={styles.categoryContainer}>
            {data.categories.map((category: any) => (
              <TouchableOpacity
                key={category.id}
                style={styles.card}
                onPress={() => { handleSelectCategory(category) }}
              >
                <View style={styles.cardContent}>
                  <Image source={{ uri: category.image }} style={styles.categoryIcon} />
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
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

export default Categories;