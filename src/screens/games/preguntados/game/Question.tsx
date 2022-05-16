import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, BackHandler, StatusBar, Platform, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { ACTIONS } from "../../../../controllers/games/questions/settings"
import { IState } from '../../../../store';
import { getData, runBackgroundTimer, stopBackgroundTimer } from '../../../../utils';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { playSelectSound, stopBackgroundMusic, playQuestionBackgroundMusic, stopQuestionBackgroundMusic, playWin, playLoseSound } from '../../../../controllers/sound';
import ImgCloseWhite from '../../../../assets/closeWhite.svg'
import ImgClose from '../../../../assets/close.svg'
import moment from 'moment';
import Modal from "react-native-modal";
import CustomButton from '../../../../components/customButton';
import numbro from 'numbro';
import StandbyScreen from './StandbyScreen';

const LOADING_QUESTION_VIEW = {
  question: {
    id: null,
    question: '¡Todos listos y preparados!. El juego empieza ya.',
    options: [{ text: '...' }, { text: '...' }, { text: '...' }, { text: '...' }],
    timeToReply: 10000
  }
}
const colors = ["#F85349", "#0BC481", "#0F8BE3", "#F6A440"]

const Question: React.FC<{ handleAction: any, user: any, navigation: any, }> = ({ handleAction, user, navigation }) => {
  const [seg, setSeg] = useState(0)
  const [isSellected, setIsSelected] = useState(false)
  const [remainingTime, setRemainingTime] = useState(10)
  const [selectAnswer, setSelectAnswer]: any = useState('')
  const [correcAnswerIndex, setCorrecAnswerIndex] = useState(4)
  const [questionNumber, setQuestionNumber] = useState(0)
  const [started, setStarted] = useState(false)
  const [nextRound, setNextRound] = useState(false)
  const [nextRoundText, setNextRoundText] = useState('')
  const [timeInMilliseconds, setTimeInMilliseconds]: any = useState(0)
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isMusicEnabled, setIsMusicEnabled] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const categories: any = useSelector((state: IState) => {
    return JSON.parse(state.triviooGame.gamematch.gameSettings).category
  })
  const allQuestions: any = useSelector((state: IState) => {
    return state.triviooGame.game.questions
  })
  const question = useSelector((state: IState) => {
    if (state.triviooGame.gamematch.currentQuestionIndex === -1) {
      return LOADING_QUESTION_VIEW.question
    }
    if (!Array.isArray(state.triviooGame.game.questions) || state.triviooGame.gamematch.currentQuestionIndex < 0) {
      return null
    }
    return state.triviooGame.game.questions[state.triviooGame.gamematch.currentQuestionIndex - 1]
  })
  const friends = useSelector((state: IState) => {
    return state.triviooGame.room.playerRooms
  })

  const betSettings = useSelector((state: IState) => {
    const newBetSettings: any = state.triviooGame.gamematch.betSettings
    return JSON.parse(newBetSettings)
  })

  const gamematchId = useSelector((state: IState) => {
    return state.triviooGame.gamematchId
  })
  const [pointsColors, setPointsColors] = useState(allQuestions.map(() => '#001C38'))
  const [questionColors, setQuestionColors] = useState(question.options.map(() => '#E2F4F8'))

  const handleReply = async (answer: any, value: any) => {
    if (!isSellected) {
      setIsSelected(true)
      if (value !== '...' && !nextRound) {
        setSelectAnswer(answer)

        if (isSoundEnabled) {
          playSelectSound()
        }
        var duration = moment.duration(moment().diff(timeInMilliseconds));
        const newQuestionColor = questionColors
        newQuestionColor[answer] = '#108BE3'
        setQuestionColors(newQuestionColor)
        const token = await getData("userToken")

        handleAction({
          type: ACTIONS.REPLY_QUESTION,
          params: {
            token,
            gamematchId: gamematchId,
            questionId: question.id,
            answer,
            userId: user?.id,
            duration: duration.asMilliseconds()
          }
        })
      }
    }
  }

  const handleFinishTime = async () => {
    if (remainingTime <= 5) {
      stopBackgroundTimer()
      setSeg(10)
      if (questionNumber === 0 && !nextRound) {
        setNextRoundText('¡EMPEZAMOS!')
        setStarted(true)
      } else {
        setNextRound(true)
      }
    }
  }

  const backAction = () => {
    const myFunction = async () => {
      const userData = await getData('user')
      const token = await getData("userToken")
      stopBackgroundTimer()
      stopQuestionBackgroundMusic()
      if (userData.music) {
        stopBackgroundMusic()
      }
      handleAction({
        type: ACTIONS.CHANGE_GAMER_STATE,
        params: {
          token,
          userId: userData.id,
          gamematchId: gamematchId,
          status: 3,
          state: 3,
          gameType: 3
        }
      })
      navigation.navigate('Dashboard')
    }
    myFunction()
    return true
  }

  const handleBackgroundTaks = async (value: boolean) => {
    stopBackgroundTimer()
    setRemainingTime(10)
    runBackgroundTimer(setRemainingTime)
    if (value) {
      const newQuestionNumber = questionNumber
      setQuestionNumber(newQuestionNumber + 1)
      if (pointsColors[questionNumber - 1] === '#001C38') {
        const newPointsColors = pointsColors
        newPointsColors[questionNumber - 1] = '#F8534B'
        setPointsColors(newPointsColors)
      }
    }
  }

  const handleGoBack = () => {
    setOpenModal(true)
    return true
  }

  const closeModal = () => {
    setOpenModal(false)
  }

  useEffect(() => {
    if (started) {
      handleBackgroundTaks(true)
    } else {
      handleBackgroundTaks(false)
    }
  }, [question])

  useEffect(() => {//Carga
    setTimeInMilliseconds(moment().valueOf())
    setSelectAnswer('')
    setIsSelected(false)
    const newQuestionColor = question.options.map(() => '#E2F4F8')
    setQuestionColors(newQuestionColor)
    setCorrecAnswerIndex(question.options.findIndex((item: any) => item.columnName === "correctAnswer"))
    setSeg(0)
    setNextRoundText('')
    setNextRound(false)
    if (isMusicEnabled) {
      playQuestionBackgroundMusic()
    }
  }, [question])


  useEffect(() => {
    if (nextRound) {
      stopQuestionBackgroundMusic()
      const newQuestionColor = question.options.map(() => '#E2F4F8')
      const newPointsColors = pointsColors
      if (correcAnswerIndex === selectAnswer) {
        if (isSoundEnabled) {
          playWin()
        }
        newQuestionColor[selectAnswer] = '#0CC482'
        newPointsColors[questionNumber - 1] = '#0CC482'
        setQuestionColors(newQuestionColor)
        setNextRoundText('ACIERTO')
        setPointsColors(newPointsColors)
      } else {
        if (!selectAnswer) {
          if (isSoundEnabled) {
            playLoseSound()
          }
          playLoseSound()
          newQuestionColor[correcAnswerIndex] = '#0CC482'
          newPointsColors[questionNumber - 1] = '#F8534B'
          setQuestionColors(newQuestionColor)
          setNextRoundText('NO RESPONDIDO')
          setPointsColors(newPointsColors)
        } else {
          if (isSoundEnabled) {
            playLoseSound()
          }
          newQuestionColor[selectAnswer] = '#F8534B'
          newQuestionColor[correcAnswerIndex] = '#0CC482'
          newPointsColors[questionNumber - 1] = '#F8534B'
          setQuestionColors(newQuestionColor)
          setNextRoundText('ERROR')
          setPointsColors(newPointsColors)
        }
      }
    }
  }, [nextRound])

  useEffect(() => {
    const myFunction = async () => {
      const userData = await getData('user')
      if (userData.music) {
        stopBackgroundMusic()
      }
      setIsSoundEnabled(userData.sound)
      setIsMusicEnabled(userData.music)
    }
    myFunction()
  }, [])

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleGoBack);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", handleGoBack);
  }, []);


  if (questionNumber === 0) return (
    <SafeAreaView style={styles.safeAreaView}>
      {Platform.OS === 'android' && <StatusBar backgroundColor={'#002F5E'} barStyle={'light-content'}></StatusBar>}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.circleBack}
          onPress={() => handleGoBack()}
        >
          <ImgCloseWhite width={12} height={12} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Trivoo</Text>
        <View style={styles.headerBox}>
          {friends.map((item: any, index: any) => {
            return (
              <View style={{
                ...styles.circularBox,
                backgroundColor: colors[index],
                right: 10 * index,
                zIndex: index * -1,
                elevation: index * -1,
              }}
                key={`gamer-${index}`}
              >
                <Text style={styles.headerText}>{item?.user?.name?.charAt(0).toUpperCase()}</Text>
              </View>
            )
          })}
        </View>
      </View>
      <StandbyScreen />
      <View style={{ marginTop: nextRoundText === '¡EMPEZAMOS!' ? Dimensions.get('window').height - 700 : Dimensions.get('window').height - 800, }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', }}>
          {betSettings?.value !== 'training' ? (
            <Text style={styles.betText}>Apuesta total: {betSettings?.type === 'Economic' ? `${numbro((betSettings.value * friends.length)).format({ trimMantissa: true, mantissa: 2 })}€` : betSettings?.type}</Text>
          ) : null}
          {nextRoundText !== '¡EMPEZAMOS!' && (
            <Text style={{
              ...styles.betSubText,
              marginTop: betSettings?.value !== 'training' ? 0 : 20
            }}>Round {questionNumber}/10</Text>
          )}
          <View style={styles.circularProgress}>
            {seg === 0 ? (
              <CountdownCircleTimer
                isPlaying
                duration={10}
                initialRemainingTime={remainingTime}
                colors={'#108BE3'}
                trailColor={'#001224'}
                size={68}
                strokeWidth={5}
                trailStrokeWidth={2}
                onComplete={() => {
                  handleFinishTime()
                  return { shouldRepeat: true, newInitialRemainingTime: remainingTime } // repeat animation in 1.5 seconds
                }}
              >
                {({ remainingTime }) => <Text style={styles.circularProgressText}>{remainingTime}</Text>}
              </CountdownCircleTimer>

            ) : (
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.empezamos}>
                  {nextRoundText}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <ModalWarning
        openModal={openModal}
        closeModal={closeModal}
        backAction={backAction} />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {Platform.OS === 'android' && <StatusBar backgroundColor={'#002F5E'} barStyle={'light-content'}></StatusBar>}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.circleBack}
            onPress={() => handleGoBack()}
          >
            <ImgCloseWhite width={12} height={12} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Trivoo</Text>
          <View style={styles.headerBox}>
            {friends.map((item: any, index: any) => {
              return (
                <View style={{
                  ...styles.circularBox,
                  backgroundColor: colors[index],
                  right: 10 * index,
                  zIndex: index * -1,
                  elevation: index * -1,
                }}
                  key={`gamer-${index}`}
                >
                  <Text style={styles.headerText}>{item?.user?.name?.charAt(0).toUpperCase()}</Text>
                </View>
              )
            })}
          </View>
        </View>
        <View style={styles.container}>
          {
            question.id ? (
              <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View>
                  <View style={styles.pointBox}>
                    {allQuestions.map((item: any, index: any) => {
                      return (
                        <View key={`question${index}`} style={{
                          ...styles.point,
                          backgroundColor: pointsColors[index],
                        }}>
                          <Text>
                            {' '}
                          </Text>
                        </View>
                      )
                    })}
                  </View>
                  <View style={styles.question}>
                    <View style={styles.headerCircularBox}>
                      {question.id === null ? (
                        <Text style={styles.headerCircularBoxText}>
                          ?
                        </Text>
                      ) : (
                        <Image source={{ uri: categories.image }} style={styles.categoryIcon} />
                      )}
                    </View>
                    <Text style={styles.questionHeaderText}>
                      {
                        question.id === null ? 'Tic, Tac.' : `${categories?.name?.charAt(0).toUpperCase() + categories.name.slice(1)}`
                      }
                    </Text>
                    <Text style={styles.questionText}>
                      {
                        question.question
                      }
                    </Text>
                  </View>
                  {
                    question.options.map((option: any, i: any) => {
                      return (
                        <TouchableOpacity
                          key={i}
                          onPress={() => {
                            handleReply(i, option.text)
                          }}
                          style={{
                            ...styles.challengeButton,
                            backgroundColor: questionColors[i]
                          }}
                        >
                          <Text style={styles.challengeTextButton}>{option.text}</Text>
                        </TouchableOpacity>
                      )
                    })
                  }
                </View>
                <View>
                  {betSettings?.value !== 'training' ? (
                    <Text style={styles.betText}>Apuesta total: {betSettings?.type === 'Economic' ? `${numbro((betSettings.value * friends.length)).format({ trimMantissa: true, mantissa: 2 })}€` : betSettings?.type}</Text>
                  ) : null}
                  {questionNumber !== 0 ? (
                    <Text style={{
                      ...styles.betSubText,
                      marginTop: betSettings?.value !== 'training' ? 0 : 20
                    }}>Round {questionNumber}/10</Text>
                  ) : (
                    <Text style={styles.betSubText}>{' '}</Text>
                  )}

                  <View style={styles.circularProgress}>
                    {seg === 0 ? (
                      <CountdownCircleTimer
                        isPlaying
                        duration={10}
                        initialRemainingTime={remainingTime}
                        colors={'#108BE3'}
                        trailColor={'#001224'}
                        size={68}
                        strokeWidth={5}
                        trailStrokeWidth={2}
                        onComplete={() => {
                          handleFinishTime()
                          return { shouldRepeat: true, newInitialRemainingTime: remainingTime } // repeat animation in 1.5 seconds
                        }}
                      >
                        {({ remainingTime }) => <Text style={styles.circularProgressText}>{remainingTime}</Text>}
                      </CountdownCircleTimer>

                    ) : (
                      <View>
                        <Text style={
                          nextRoundText === '¡EMPEZAMOS!' ? styles.empezamos :
                            nextRoundText === 'ACIERTO' ? styles.acierto :
                              nextRoundText === 'ERROR' ? styles.error : styles.noRespondio
                        }>
                          {nextRoundText}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ) : null
          }
        </View>
        <ModalWarning
          openModal={openModal}
          closeModal={closeModal}
          backAction={backAction} />
      </ScrollView>
    </SafeAreaView>
  );
}

const ModalWarning: React.FC<{
  openModal?: boolean,
  closeModal: () => void,
  backAction: () => void
}> = ({ openModal, closeModal, backAction }) => (
  <Modal
    isVisible={openModal}
    style={{ margin: 0, justifyContent: 'flex-end' }}
    onBackdropPress={() => closeModal()}
  >
    <View style={styles.modalContent}>
      <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={closeModal}>
        <ImgClose width={12} height={12} />
      </TouchableOpacity>
      <Text style={styles.titleModal}>
        ¿Desea salir de la partida?
      </Text>
      <Text style={styles.textModal}>
        Si sales se te considerará como participante retirado y perderás la partida.
      </Text>
      <View style={{ alignItems: 'center', }}>
        <CustomButton
          onPress={backAction}
          style={styles.modalButton}>
          <Text style={{ ...styles.modalText, color: '#F8534B' }}>Quiero retirarme</Text>
        </CustomButton>
        <CustomButton
          onPress={closeModal}
          style={styles.modalButton2}>
          <Text style={{ ...styles.modalText, color: '#00274E' }}>Continuar jugando</Text>
        </CustomButton>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: '#00274e',
    flex: 1,
  },
  container: {
    margin: 20,
    paddingBottom: 0,
    paddingTop: 0,
    flex: 1,
  },
  header: {
    padding: 21,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#002F5E',
    borderBottomColor: "#001C38",
    borderBottomWidth: 1,
    alignContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    color: '#FFFFFF',
    fontFamily: 'Apercu Pro Bold',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 15,
  },
  circularBox: {
    position: 'absolute',
    borderRadius: 100,
    paddingVertical: 5,
    paddingHorizontal: 10,
    bottom: -16
  },
  headerBox: {
    width: 50,
  },
  point: {
    height: 6,
    width: 6,
    borderRadius: 100,
    marginRight: 10,
  },
  pointBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5
  },
  question: {
    marginTop: 50,
    padding: 30,
    paddingTop: 40,
    borderRadius: 25,
    backgroundColor: '#E2F4F8'
  },
  questionText: {
    fontSize: 20,
    color: '#00274E',
    fontFamily: 'Apercu Pro Light',
    fontStyle: 'normal',
    fontWeight: '300',
    textAlign: 'center'
  },
  questionHeaderText: {
    color: '#00274E',
    fontFamily: 'Apercu Pro Bold',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center'
  },
  headerCircularBox: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 68,
    height: 68,
    backgroundColor: '#108BE3',
    borderRadius: 100,
    left: '50%',
    top: -33,
  },
  headerCircularBoxText: {
    color: '#00274E',
    fontFamily: 'Apercu Pro Bold',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 30,
    textAlign: 'center'
  },
  challengeTextButton: {
    fontFamily: 'Apercu Pro Bold',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 15,
    color: '#00443B',
  },
  challengeButton: {
    marginTop: 10,
    borderRadius: 100,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  circularProgress: {
    width: '100%',
    height: 100,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularProgressText: {
    fontFamily: 'Apercu Pro',
    fontWeight: 'normal',
    fontSize: 25,
    color: '#E2F4F8',
  },
  betText: {
    fontFamily: 'Apercu Pro Bold',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    padding: 10,
    paddingBottom: 5
  },
  betSubText: {
    fontFamily: 'Apercu Pro Medium',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    padding: 10,
    paddingTop: 0
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 100
  },
  empezamos: {
    fontSize: 30,
    fontFamily: 'Apercu Pro',
    color: '#108BE3'
  },
  acierto: {
    fontSize: 30,
    fontFamily: 'Apercu Pro',
    color: '#0CC482'
  },
  error: {
    fontSize: 30,
    fontFamily: 'Apercu Pro',
    color: '#F8534B'
  },
  noRespondio: {
    fontSize: 30,
    fontFamily: 'Apercu Pro',
    color: '#F8534B'
  },
  circleBack: {
    width: 30,
    height: 30,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  modalButton: {
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#F8534B',
    padding: 10,
    width: 302,
    height: 51,
    marginTop: 30,
    fontFamily: 'Apercu Pro Bold',
    fontStyle: 'normal',
    fontWeight: '700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButton2: {
    borderRadius: 100,
    backgroundColor: '#108BE3',
    padding: 10,
    width: 302,
    height: 51,
    marginTop: 10,
    fontFamily: 'Apercu Pro Bold',
    fontStyle: 'normal',
    fontWeight: '700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalText: {
    fontWeight: 'bold',
    fontFamily: 'Apercu Pro',
    fontSize: 14,
    color: '#00443B'
  },
  textModal: {
    fontSize: 15,
    marginTop: 10,
    color: '#00274E',
    fontFamily: 'Apercu Pro Regular',
    fontStyle: 'normal',
    fontWeight: '400',
  },
  titleModal: {
    fontSize: 18,
    marginTop: 30,
    color: '#00274E',
    fontFamily: 'Apercu Pro Bold',
    fontStyle: 'normal',
    fontWeight: '700',
  },
  modalContent: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 35,
    backgroundColor: '#FFFFFF',
  },
})

export default Question;