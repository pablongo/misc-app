import React, { useState, useEffect } from 'react';
import { SafeAreaView, Platform, StyleSheet, View, BackHandler, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { ACTIONS } from "../../../controllers/games/questions/settings"
import { IState } from '../../../store';
import { getData } from '../../../utils';
import { stopBackgroundMusic } from '../../../controllers/sound';
import GamersBox from '../../../components/gamersBox/index'

const Room: React.FC<{ handleAction: any, navigation: any }> = ({ handleAction, navigation }) => {
  const gamematch = useSelector((state: IState) => {
    return state.triviooGame.gamematch
  })
  const userId = useSelector((state: IState) => {
    return state.triviooGame.userId
  })

  const room = useSelector((state: IState) => {
    return state.triviooGame.room
  })

  const betSettings = useSelector((state: IState) => {
    let newBetSettings: any = state.triviooGame.gamematch.betSettings
    return newBetSettings === undefined ? undefined : JSON.parse(newBetSettings)
  })

  const userGame = gamematch.gamers.filter((gamer) => gamer.userId === userId)
  const playerMe = room?.playerRooms?.filter((gamer: any) => gamer?.user?.id === userId)

  const withdrawn = room?.playerRooms?.filter((gamer: any) => gamer?.status === 3)

  const handleLeave = () => {
    const myFunction = async () => {
      const token = await getData("userToken")
      handleAction({
        type: ACTIONS.CHANGE_GAMER_STATE,
        params: {
          token,
          userId,
          gamematchId: gamematch.id,
          status: 3,
          state: 3,
          gameType: 3,
          betSettings
        }
      })
      stopBackgroundMusic()
      navigation.navigate('Dashboard')
    }
    myFunction()
    return true
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleLeave);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", handleLeave);
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {
        gamematch && gamematch.id ? (
          <View style={styles.scrollView}>
            <GamersBox
              playerRooms={room?.playerRooms}
              userId={userGame[0]} />
            {withdrawn?.length ? (
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={async () => {
                    navigation.navigate('Preguntados-Categories', {
                      mode: 'challenge',
                      game: "trivoo"
                    })
                  }}
                  style={{
                    ...styles.challengeButton,
                    backgroundColor: '#108BE3',
                    marginBottom: 10
                  }}
                >
                  <Text style={styles.challengeTextButton}>Retar de nuevo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleLeave()}
                  style={{
                    ...styles.challengeButton,
                    backgroundColor: "#001C38",
                  }}
                >
                  <Text style={{
                    ...styles.challengeTextButton,
                    color: 'white'
                  }}>Volver a Laurel Gaming</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                  style={styles.goBack}
                  onPress={() => handleLeave()}>
                  <Text style={styles.goBackText}>Salir, no quiero jugar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    const token = await getData("userToken")
                    handleAction({
                      type: ACTIONS.CHANGE_GAMER_STATE,
                      params: {
                        token,
                        userId,
                        gamematchId: gamematch.id,
                        status: playerMe[0]?.status === 1 ? 2 : 1,
                        state: userGame[0]?.state === 1 ? 2 : 1,
                        gameType: betSettings?.value === 'training' ? 1 : 2,
                        betSettings
                      }
                    })
                  }}
                  style={{
                    ...styles.challengeButton,
                    backgroundColor: playerMe[0]?.status === 1 ? "#108BE3" : '#ABDEEA',
                  }}>
                  <Text style={styles.challengeTextButton}>¡Estoy listo!</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : null
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    padding: 21,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  challengeButton: {
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
  goBackText: {
    fontSize: 12,
    color: '#00443B',
    textAlign: "center",
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  goBack: {
    padding: 20
  }
})
export default Room;