import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, ImageBackground, Platform, BackHandler, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, StatusBar } from 'react-native';
import { useDispatch } from 'react-redux';
import CustomButton from '../../../components/customButton';
import { updateBeat, createBet } from '../../../controllers/bet/actions';
import { CATEGORIES_COMPONENT_MODES } from "./Categories"
import { getData } from '../../../utils/index'
import { playBackgroundMusic, stopBackgroundMusic } from '../../../controllers/sound';
const IMG_PREGUNTADOS = require('../../../assets/preguntados-background.png');
import ImgArrowBack from '../../../assets/arrow-back-green.svg';
import ImgPreguntados1 from '../../../assets/preguntados-1.svg';
import ImgPreguntados2 from '../../../assets/preguntados-2.svg';
import ImgPreguntados3 from '../../../assets/preguntados-3.svg';
import ImgPreguntados4 from '../../../assets/preguntados-4.svg';
import { logEvent } from '../../../utils/Amplitude';
import ImageView from "react-native-image-viewing";

const Preguntados: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch();
  const [idItem, setIdItem] = useState(1);
  const [visible, setIsVisible] = useState(false);
  const imageExample: any = [
    {
      id: 0,
      props: {
        source: require('../../../assets/preguntados-1.png'),
        svg: <ImgPreguntados1 width={150} height={194} />,
      },
      freeHeight: true
    },
    {
      id: 1,
      props: {
        source: require('../../../assets/preguntados-2.png'),
        svg: <ImgPreguntados2 width={150} height={194} />,
      }
    },
    {
      id: 2,
      props: {
        source: require('../../../assets/preguntados-3.png'),
        svg: <ImgPreguntados3 width={159} height={194} />,
      }
    },
    {
      id: 3,
      props: {
        source: require('../../../assets/preguntados-4.png'),
        svg: <ImgPreguntados4 width={159} height={194} />,
      }
    }
  ];

  const images = [
    {
      uri: 'https://firebasestorage.googleapis.com/v0/b/laurelgaming-testing.appspot.com/o/carrusel%2FGroup%20930%20(2).png?alt=media&token=d5d8c3cd-1521-441e-8565-3e3c1027eb4f',
    },
    {
      uri: "https://firebasestorage.googleapis.com/v0/b/laurelgaming-testing.appspot.com/o/carrusel%2FGroup%20935.png?alt=media&token=d53d5c57-039a-4642-8737-07cbdb57e00d",
    },
    {
      uri: "https://firebasestorage.googleapis.com/v0/b/laurelgaming-testing.appspot.com/o/carrusel%2FGroup%20936.png?alt=media&token=228657b4-f4c1-44db-be70-c2906bcd7711",
    },
    {
      uri: "https://firebasestorage.googleapis.com/v0/b/laurelgaming-testing.appspot.com/o/carrusel%2FGroup%20937.png?alt=media&token=5d968826-da27-4746-9626-21199309538e"
    }
  ];

  const handleOpenModal = (id: number) => {
    setIdItem(id);
    setIsVisible(true);
  };

  const renderItem = (img: any) => {
    const { item } = img;
    return (
      <TouchableOpacity onPress={() => handleOpenModal(item.id)}>
        <View style={styles.imageExample}>
          {item.props.svg}
        </View>
      </TouchableOpacity>
    );
  };

  const handleCollageTriviooWithFriends = () => {
    dispatch(updateBeat({
      gameId: 1,
      type: null,
      creatorId: null,
      betSettings: null,
      gameSettings: null,
      friends: []
    }));
    logEvent("TRIVOO_MATCH_EVENT");
    navigation.navigate('Preguntados-Categories', {
      mode: CATEGORIES_COMPONENT_MODES.CHALLENGE,
      game: "trivoo"
    });
  }

  const handleTraining = async () => {
    const user = await getData('user')
    const createGame = {
      gameId: 1,
      type: 2,
      creatorId: null,
      betSettings: JSON.stringify({ value: 'training', type: 'Otro' }),
      gameSettings: JSON.stringify({ category: { "id": 1, "image": "https://storage.googleapis.com/laurelgaming-testing.appspot.com/categories/1643896479542.png", "name": "Classic", "state": 1 } }),
      friends: [{
        id: 1,
        status: 1,
        user: {
          id: user.id,
          name: user.userName
        }
      }]
    }
    dispatch(updateBeat(createGame));
    logEvent("TRIVOO_TRAINING_EVENT");
    dispatch(createBet(navigation, 'training'));
  }

  const backAction = () => {
    const myFunction = async () => {
      const userData = await getData('user')
      if (userData.music) {
        stopBackgroundMusic()
      }
    }
    myFunction()
    navigation.navigate('Dashboard')
    return true
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

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);


  console.log(visible, idItem)

  return (
    <>
      {Platform.OS === 'android' && <StatusBar hidden={true}></StatusBar>}
      <ImageBackground source={IMG_PREGUNTADOS} resizeMode="cover" style={styles.image}>
        <TouchableOpacity onPress={() => backAction()} style={styles.circleBack}>
          <ImgArrowBack width={12} height={10} />
        </TouchableOpacity>
        <ImageView
          images={images}
          imageIndex={idItem}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
        />
        <ScrollView>
          <View style={styles.content}>
            <Text style={styles.titleGame}>Trivoo</Text>
            <Text style={styles.textContent}>
              {`El coliseo de las preguntas, los Juegos Olímpicos del saber. 4 modalidades: Clásica, cine y series, fútbol y “fun & random facts”.`}
            </Text>
            <Text style={{ ...styles.textContent, marginTop: 0 }}>
              {`El saber no ocupa lugar, humillar a tu amigo tampoco.`}
            </Text>
            <View style={styles.contentLabel}>
              <View style={styles.label}>
                <Text style={styles.textLabel}>Preguntas</Text>
              </View>
              <View style={styles.label}>
                <Text style={styles.textLabel}>Conocimientos</Text>
              </View>
            </View>
            <FlatList
              renderItem={renderItem}
              data={imageExample}
              keyExtractor={(item: any) => item.id}
              horizontal={true}
            />
            <View style={{ alignItems: 'center', }}>
              <CustomButton
                onPress={handleTraining}
                style={styles.toTrainButton}>
                <Text style={styles.toTrainText}>Tutorial</Text>
              </CustomButton>
              <CustomButton
                onPress={handleCollageTriviooWithFriends}
                style={styles.challengeButton}>
                <Text style={styles.challengeText}>Retar a un amigo</Text>
              </CustomButton>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </>
  );

}

const styles = StyleSheet.create({
  label: {
    alignSelf: 'flex-start',
    paddingTop: 4,
    paddingBottom: 4,
    marginRight: 4,
    paddingLeft: 9,
    paddingRight: 9,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentLabel: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 15,
  },
  textLabel: {
    fontSize: 12,
    color: '#00443B',
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
  },
  imageExample: {
    borderRadius: 15,
    margin: 5,
  },
  toTrainButton: {
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#108BE3',
    padding: 10,
    width: 332,
    height: 51,
    marginTop: 20,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toTrainText: {
    fontWeight: 'bold',
    fontFamily: 'Apercu Pro',
    fontSize: 14,
    color: '#00274E'
  },
  challengeButton: {
    borderRadius: 100,
    backgroundColor: '#108BE3',
    padding: 10,
    width: 332,
    height: 51,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeText: {
    fontWeight: 'bold',
    fontFamily: 'Apercu Pro',
    fontSize: 14,
    color: '#00274E'
  },
  content: {
    padding: 21,
    marginTop: Dimensions.get('window').height - 640,
    backgroundColor: '#FFFF',
    borderRadius: 20,
  },
  titleGame: {
    fontSize: 20,
    color: '#00443B',
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
  },
  textContent: {
    fontSize: 15,
    marginTop: 10,
    color: '#00443B',
    fontFamily: 'Apercu Pro',
  },
  image: {
    flex: 1
  },
  circleBack: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 21,
    marginTop: Platform.OS === 'ios' ? 50 : 35,
    borderRadius: 100,
    backgroundColor: '#FFFF'
  },
  arrowBack: {
    width: 12,
    height: 10,
  },
});

export default Preguntados;