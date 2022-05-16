import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, ScrollView, BackHandler, StatusBar, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { IState } from '../../../../store';
import { getData, stopBackgroundTimer } from '../../../../utils';
import { stopBackgroundMusic } from '../../../../controllers/sound';

const Results: React.FC<{ navigation: any, handleAction: any }> = ({ navigation, handleAction }) => {
  const [iWin, setIwin]: any = useState(false)
  const [winnerName, setwinnerName] = useState('')
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isMusicEnabled, setIsMusicEnabled] = useState(false);

  const userId = useSelector((state: IState) => {
    return state.triviooGame.userId
  })

  const gameResult: any = useSelector((state: IState) => {
    if (!Array.isArray(state.triviooGame.game.gameResult)) {
      return null
    }
    return state.triviooGame.game.gameResult
      .sort((a, b) => (a.userId > b.userId) ? 1 : ((b.userId > a.userId) ? -1 : 0))
  })

  const winner = gameResult
    .sort((a: any, b: any) => (a.correctAnswers > b.correctAnswers) ? 1 : ((b.correctAnswers > a.correctAnswers) ? -1 : 0))
    .reverse()[0]

  const friends = useSelector((state: IState) => {
    const orderFriends = state.triviooGame.room.playerRooms
      .sort((a: any, b: any) => (a?.user?.id > b?.user?.id) ? 1 : ((b?.user?.id > a?.user?.id) ? -1 : 0))
      .map((item: any, index: any) => {
        return {
          ...item,
          correctAnswers: gameResult[index]?.correctAnswers,
          win: item?.user?.id === winner.userId ? (winner.correctAnswers === 0 ? false : true) : false
        }
      })
    return orderFriends
  })

  const handleRematch = () => {
    navigation.navigate('Preguntados')
  }

  const backAction = () => {
    navigation.navigate('Dashboard')
    return true
  }

  useEffect(() => {
    const myFunction = async () => {
      stopBackgroundMusic()
      const userData = await getData('user')
      setIsSoundEnabled(userData.sound)
      setIsMusicEnabled(userData.music)
      stopBackgroundTimer()
    }
    myFunction()
  }, [])

  useEffect(() => {
    setIwin(userId === winner.userId ? (winner.correctAnswers === 0 ? false : true) : false)
    const winnerName: any = friends.filter((item: any) => item.win)[0]
    setwinnerName(winnerName?.user?.name || winnerName?.user?.userName)
  }, [])

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  return (
    <SafeAreaView style={styles.resultView}>
      {Platform.OS === 'android' && <StatusBar backgroundColor={'#002F5E'} barStyle={'light-content'}></StatusBar>}
      <View style={styles.header}>
        <Text style={styles.textHeader}>Trivoo</Text>
      </View>
      <View style={styles.contentView}>
        <View style={styles.textContainer}>
          <Text style={styles.contentTitle}>{friends[0].correctAnswers}</Text>
          <Text style={[styles.contentSubtitle, { marginTop: 10, }]}>
            ¡Respuestas correctas sobre 10!
          </Text>
          <View style={styles.contentPlayers}>
            {friends.map((result: any, key: any) => (
              <View key={key}>
                <Text style={styles.textNameResult}>
                  Este fué tu resultado del
                </Text>
                <Text style={styles.textNameResult}>
                  entrenamiento de hoy. Ahora toca
                </Text>
                <Text style={styles.textNameResult}>
                  salir a jugar, reta a ese amigo tuyo
                </Text>
                <Text style={styles.textNameResult}>
                  que más ganas le tengas.
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.buttonActions, { marginTop: 120 }]}
            onPress={() => { handleRematch() }}
          >
            <Text style={styles.textButton}>Retar a un amigo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonActions, { marginTop: 8, backgroundColor: '#ffffff' }]}
            onPress={() => { backAction() }}
          >
            <Text style={styles.textButton}>Volver a laurel Gaming</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  resultView: {
    flex: 1,
    backgroundColor: '#00274e',
  },
  header: {
    padding: 21,
    justifyContent: 'center',
    backgroundColor: '#002F5D',
  },
  textHeader: {
    fontFamily: 'Apercu Pro',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  contentView: {
    flex: 1,
    backgroundColor: 'rgba(0, 39, 78, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  contentTitle: {
    fontFamily: 'Laurel',
    fontStyle: 'normal',
    color: '#ffffff',
    fontSize: 120,
  },
  contentSubtitle: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 18,
    fontStyle: 'normal',
  },
  contentPlayers: {
    flexDirection: 'row',
    marginTop: 20,
  },
  contentResult: {
    borderRadius: 100,
    margin: 10,
    width: 72,
    height: 72,
    alignItems: 'center',
    backgroundColor: '#002F5D'
  },
  textResult: {
    fontFamily: 'Laurel',
    fontStyle: 'normal',
    fontSize: 45,
    color: '#ffffff',
  },
  textNameResult: {
    textAlign: 'center',
    fontFamily: 'Apercu Pro',
    fontSize: 18,
    fontWeight: 'normal',
    color: '#ffffff',
  },
  textResultCount: {
    textAlign: 'center',
    fontFamily: 'Apercu Pro',
    fontSize: 12,
    color: '#ffffff',
  },
  buttonActions: {
    backgroundColor: '#108BE3',
    width: 332,
    justifyContent: 'center',
    borderRadius: 100,
    alignItems: 'center',
    padding: 15,
  },
  textButton: {
    color: '#00274E',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Apercu Pro',
  },
  buttonContainer: {
    width: '100%',
    display: "flex",
    flexDirection: 'column',
    justifyContent: "center",
    alignContent: "center",
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    display: "flex",
    flexDirection: 'column',
    justifyContent: "center",
    alignContent: "center",
    alignItems: 'center',
  }
});

export default Results;