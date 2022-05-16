import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, ScrollView, BackHandler, StatusBar, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { IState } from '../../../../store';
import PaymentSlider from '../../../../components/paymentSilder/index'
import RestaurantSilder from '../../../../components/restaurantSilder';
import numbro from 'numbro';
import { getData, stopBackgroundTimer } from '../../../../utils';
import { playVideoGameLose, playVictorySound } from '../../../../controllers/sound';
import AnimationImage from '../../../../components/animationImage';

const Results: React.FC<{ navigation: any, handleAction: any }> = ({ navigation, handleAction }) => {
  const [iWin, setIwin]: any = useState(false)
  const [winnerName, setwinnerName] = useState('')
  const [panelState, setPanelState]: any = useState(false)
  const [restaurantState, setRestaurantState]: any = useState(false)
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isMusicEnabled, setIsMusicEnabled] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);

  let tie = false

  const userId = useSelector((state: IState) => {
    return state.triviooGame.userId
  })

  const restaurantInfo = useSelector((state: IState) => {
    const newBetSettings: any = state.triviooGame.gamematch.restaurantInfo
    return JSON.parse(newBetSettings)
  })

  const betSettings = useSelector((state: IState) => {
    const newBetSettings: any = state.triviooGame.gamematch.betSettings
    return JSON.parse(newBetSettings)
  })

  const gameResult: any = useSelector((state: IState) => {
    if (!Array.isArray(state.triviooGame.game.gameResult)) {
      return null
    }
    return state.triviooGame.game.gameResult
      .sort((a, b) => (a.userId > b.userId) ? 1 : ((b.userId > a.userId) ? -1 : 0))
  })

  let winner = gameResult
    .filter((user: any) => user.state === 1)
    .sort((a: any, b: any) => (a.correctAnswers > b.correctAnswers) ? 1 : ((b.correctAnswers > a.correctAnswers) ? -1 : 0))
    .reverse()

  if (winner[0]?.correctAnswers === winner[1]?.correctAnswers) {
    tie = true
    const newWinner = winner.filter((item: any) => item.correctAnswers === winner[0]?.correctAnswers)
    winner = newWinner.sort((a: any, b: any) => (a.totalResponseTime > b.totalResponseTime) ? 1 : ((b.totalResponseTime > a.totalResponseTime) ? -1 : 0))
  }

  const friends = useSelector((state: IState) => {
    const orderFriends = state.triviooGame.room.playerRooms
      .sort((a: any, b: any) => (a?.user?.id > b?.user?.id) ? 1 : ((b?.user?.id > a?.user?.id) ? -1 : 0))
      .map((item: any) => {
        return {
          ...item,
          correctAnswers: gameResult.filter((usersResul: any) => usersResul.userId === item?.user?.id)[0]?.correctAnswers,
          win: item?.user?.id === winner[0].userId ? (winner[0]?.correctAnswers === 0 ? false : true) : false
        }
      })
    return orderFriends
  })

  const triviooGame = useSelector((state: IState) => {
    return state.triviooGame
  })

  const earned = parseFloat(numbro(betSettings?.type === 'Economic' ? betSettings.value : 0).format({ trimMantissa: true, mantissa: 2 }))

  const rematchConfig = {
    betSettings: triviooGame.gamematch.betSettings,
    gameSettings: triviooGame.gamematch.gameSettings,
    creatorId: triviooGame.gamematch.creatorId,
    friends: triviooGame.room.playerRooms,
    type: triviooGame.gamematch.betSettings === undefined ? 1 : JSON.parse(triviooGame.gamematch.betSettings).id,
    rematch: true,
    color: 'blue',
    game: "trivoo"
  }

  const handleClickOrder = () => {
    setRestaurantState(true)
  }

  const backAction = () => {
    navigation.navigate('Dashboard')
    return true
  }

  const handleRematch = () => {
    navigation.navigate('SelectFriends', rematchConfig)
  }

  useEffect(() => {
    const newWinner = userId === winner[0].userId ? (winner[0]?.correctAnswers === 0 ? false : true) : false
    if (isSoundEnabled) {
      if (newWinner) {
        playVictorySound()
      } else {
        playVideoGameLose()
      }
    }
    setIwin(newWinner)
    const winnerName: any = friends.filter((item: any) => item.win)[0]
    setwinnerName(winnerName?.user?.name === "null null" ? winnerName?.user?.userName : winnerName?.user?.name)
  }, []);

  useEffect(() => {
    let timeOut = setTimeout(() => {
      setShowAnimation(false);
    }, 5000);

    return () => {
      clearTimeout(timeOut);
    }
  }, [showAnimation]);

  useEffect(() => {
    const myFunction = async () => {
      const userData = await getData('user')
      setIsSoundEnabled(userData.sound)
      setIsMusicEnabled(userData.music)
      stopBackgroundTimer()
    }
    myFunction()
  }, []);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  return (
    <SafeAreaView style={styles.resultView}>
      {Platform.OS === 'android' && <StatusBar backgroundColor={'#002F5E'} barStyle={'light-content'}></StatusBar>}

      {showAnimation ? (
        <View style={{ justifyContent: 'center', flex: 1 }}>
          <AnimationImage win={iWin} />
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.textHeader}>Trivoo</Text>
          </View>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={styles.contentView}>
              <View style={styles.textContainer}>
                <Text style={styles.contentTitle}>{iWin ? 'Victoria' : 'Derrota'}</Text>
                <Text style={[styles.contentSubtitle, { fontWeight: 'bold', fontSize: 16 }]}>{iWin ? 'Has ganado!' : 'Has perdido!'}</Text>
                {/* title */}
                {betSettings?.type === 'Economic' ? (
                  <Text style={styles.contentSubtitle}>{iWin ?
                    `Ya puedes pedir los ${parseFloat(numbro(betSettings.value).format({ trimMantissa: true, mantissa: 2 }))}€ apostados a todos ellos, ¡te pertenecen!` :
                    `Has perdido! Ya puedes pagar los ${parseFloat(numbro(betSettings.value).format({ trimMantissa: true, mantissa: 2 }))}€ apostados a ${winnerName}, ¡le pertenecen!`}
                  </Text>
                ) : null}
                {betSettings?.type === 'Otro' ? (
                  <Text style={styles.contentSubtitle}>{iWin ?
                    'Ya puedes pedir lo apostado a todos ellos, ¡te pertenecen!' :
                    `Ya puedes pagar lo apostado a ${winnerName}, ¡le pertenecen!`}
                  </Text>
                ) : null}
                {betSettings?.type === 'Comida' ? (
                  <Text style={styles.contentSubtitle}>{iWin ?
                    'Ya puedes pedir tu reserva a todos ellos!' :
                    `¡Has perdido! Te toca invitar a ${winnerName} al ${restaurantInfo.name}, ¡reserva ahora!`}
                  </Text>
                ) : null}
                <Text style={[styles.contentSubtitle, { marginTop: 35, }]}>Resultado final:</Text>
                <View style={styles.contentPlayers}>
                  {friends.map((result: any, key: any) => (
                    <View key={key}>
                      <View style={[styles.contentResult, { backgroundColor: result.win ? '#0CC482' : '#002F5D' }]}>
                        <Text style={[styles.textResult, { color: result.win ? '#00274E' : '#ffffff' }]}>{result?.user?.name.charAt(0).toUpperCase()}</Text>
                      </View>
                      <Text style={styles.textNameResult}>{result?.user?.userName}</Text>
                      {result?.status === 3 ? (
                        <Text style={{ ...styles.textResultCount, color: "#F8534B" }}>Retirado/a</Text>
                      ) : (
                        <Text style={styles.textResultCount}>{result?.correctAnswers}/10</Text>
                      )}
                    </View>
                  ))}
                </View>
                {tie ? (
                  <View style={styles.tie}>
                    <Text style={styles.textResultCount}>*En caso de empate, el jugador con respuestas más rápidas es el ganador.</Text>
                  </View>
                ) : null}
              </View>
              {/* Buttons */}
              <View style={styles.buttonContainer}>
                {betSettings?.type === 'Economic' ? (
                  <TouchableOpacity
                    style={[styles.buttonActions, { marginTop: tie ? 10 : 60 }]}
                    onPress={() => setPanelState(true)}
                  >
                    <Text style={styles.textButton}>{iWin ?
                      `Pedir ${parseFloat(numbro(betSettings.value * (friends.length - 1)).format({ trimMantissa: true, mantissa: 2 }))}€ a cada uno` :
                      `Pagar ${parseFloat(numbro(betSettings.value).format({ trimMantissa: true, mantissa: 2 }))}€ a ${winnerName}`}
                    </Text>
                  </TouchableOpacity>
                ) : null}
                {betSettings?.type === 'Comida' ? (
                  <TouchableOpacity
                    style={[styles.buttonActions, { marginTop: tie ? 10 : 60 }]}
                    onPress={() => handleClickOrder()}
                  >
                    <Text style={styles.textButton}>
                      {restaurantInfo.type === 'WITH_BOOKING_SISTEM' ?
                        `Reservar en ${restaurantInfo.name}` :
                        `Pedir en ${restaurantInfo.name}`
                      }
                    </Text>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                  style={[styles.buttonActions, { marginTop: 8 }]}
                  onPress={() => { handleRematch() }}
                >
                  <Text style={styles.textButton}>Retar de nuevo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.buttonActions, { marginTop: 8, backgroundColor: '#ffffff' }]}
                  onPress={() => { backAction() }}
                >
                  <Text style={styles.textButton}>Volver a laurel Gaming</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          <PaymentSlider setPanelState={setPanelState} panelState={panelState} iWin={iWin} earned={earned} />
          <RestaurantSilder setPanelState={setRestaurantState} panelState={restaurantState} restaurant={restaurantInfo} />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  resultView: {
    height: '100%',
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
    backgroundColor: 'rgba(0, 39, 78, 1)',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  contentTitle: {
    fontFamily: 'Laurel',
    fontStyle: 'normal',
    color: '#ffffff',
    fontSize: 60,
  },
  contentSubtitle: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 15,
    fontStyle: 'normal',
  },
  contentPlayers: {
    flexDirection: 'row',
    marginTop: 25,
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
    fontSize: 15,
    fontWeight: 'bold',
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
    textAlign: "center",
  },
  tie: {
    padding: 20,
    marginTop: 10
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