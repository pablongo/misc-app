import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View, SafeAreaView, StatusBar, Platform } from "react-native";
import useQuestionsGame from "../../../../controllers/games/questions/useQuestionsGame"
import Room from "../../transversal/Room";
import Question from "./Question";
import Results from "./Results";
import Training from "./Training";
import { VIEWS, EVENTS, ACTIONS } from "../../../../controllers/games/questions/settings"
import { useDispatch, useSelector } from "react-redux";
import { changeGamerState, changeStatusPlayer, setCurrentQuestionIndex, setGameQuestions, setGameResult, setRaundAnswers, setRoom, setTriviooGame } from "../../../../controllers/games/questions/actions";
import { getData } from "../../../../utils";
import { IState } from "../../../../store";

const IMG_ARROW_BACK = require('../../../../assets/arrow-back-green.png');


const QuestionsGame: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const [view, setView] = useState(VIEWS.ROOM)
  const [user, setUser] = useState(VIEWS.ROOM)

  const gamematchId = useSelector((state: IState) => {
    return state.triviooGame.gamematchId
  })

  const triggerAction = useQuestionsGame((action: any) => {
    switch (action.type) {
      case EVENTS.ERROR:
        Alert.alert(
          "Error",
          action.params.message
        );
        break;

      case EVENTS.DISCONNECT:
        navigation.navigate('Preguntados')
        break;

      case EVENTS.INIT_GAMEMATCH_SETTINGS_FOR_PLAY:
        dispatch(setTriviooGame(action.params))
        if (action.params.gamematch.currentQuestionIndex >= 0 && Array.isArray(action.params.game.questions)) {
          setView(VIEWS.QUESTION)
        }
        break;

      case "UPDATE_ROOM":
        dispatch(setRoom(action.params))
        break;

      case EVENTS.GAMER_CHANGE_READY:
        dispatch(changeGamerState(action.params.userId, action.params.state))
        break;

      case EVENTS.UPTADE_STATUS_PLAYER:
        dispatch(changeStatusPlayer(action.params.userId, action.params.status))
        break;

      case EVENTS.STAR_GAME:
        dispatch(setGameQuestions(action.params))
        setView(VIEWS.QUESTION)
        break;

      case EVENTS.RAUND_RESULT:
        dispatch(setRaundAnswers(action.params.raundAnswers))
        break;

      case EVENTS.NEXT_RAUND:
        dispatch(setRaundAnswers([]))
        dispatch(setCurrentQuestionIndex(action.params.currentQuestionIndex))
        break;

      case EVENTS.GAME_RESULT:
        dispatch(setGameResult(action.params))
        setView(VIEWS.RESULTS)
        break;

      default:
        break;
    }
  });

  useEffect(() => {
    if (!triggerAction) {
      return
    }
    const eff = async () => {
      if (!gamematchId) {
        return
      }
      const token = await getData('userToken')
      const userState = await getData('user')
      setUser(userState)
      console.log('Connecting to ' + gamematchId);

      triggerAction({
        type: ACTIONS.CONECT_GAMEMATCH,
        params: {
          gamematchId: gamematchId,
          token
        }
      })
    }
    eff()
  }, [triggerAction, gamematchId])
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: view === VIEWS.ROOM ? '#FFFFFF' : '#00274e' }}>
      {Platform.OS === 'ios' && <StatusBar barStyle={view === VIEWS.ROOM ? 'default' : 'light-content'}></StatusBar>}
      {
        view === VIEWS.ROOM ? (
          <View style={{ flex: 1 }}>
            <Room handleAction={triggerAction} navigation={navigation} />
          </View>
        ) :
          view === VIEWS.QUESTION ? (
            <Question handleAction={triggerAction} user={user} navigation={navigation} />
          ) :
            view === VIEWS.RESULTS ? (
              <View style={{ flex: 1 }}>
                {route.params?.type === 'training' ? (
                  <Training handleAction={triggerAction} navigation={navigation} />
                ) : (
                  <Results handleAction={triggerAction} navigation={navigation} />
                )}
              </View>
            ) :
              (null)
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  arrowBack: {
    width: 12,
    height: 10,
    marginTop: 20,
  }
})

export default QuestionsGame