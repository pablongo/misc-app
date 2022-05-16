import { ACTIONS } from "./settings";
//import { extractJWT, getData } from "../../../../utils";

export function setTriviooGame(triviooGame: any) {
  return {
    type: ACTIONS.SET_TRIVIOO_GAME,
    triviooGame
  }
}

export function setRoom(room: any) {
  return {
    type: "UPDATE_ROOM",
    room,
  }
}

export function changeStatusPlayer (userId: string, status: number){
  return {
    type: ACTIONS.UPDATE_STATUS_PLAYER,
    userId,
    status
  }
}


export function changeGamerState(userId: string, state: number) {
  return {
    type: ACTIONS.CHANGE_GAMER_STATE,
    userId,
    state
  }
}


export function setGameQuestions(questions: Array<any>) {
  return {
    type: ACTIONS.SET_GAME_QUESTIONS,
    questions
  }
}


export function setCurrentQuestionIndex(currentQuestionIndex: number) {
  return {
    type: ACTIONS.SET_CURRENT_QUESTION_INDEX,
    currentQuestionIndex
  }
}


export function setRaundAnswers(raundAnswers: Array<any>) {
  return {
    type: ACTIONS.SET_RAUND_ANSWERS,
    raundAnswers 
  }
}

export function setGameResult(gameResult: any) {
  return {
    type: ACTIONS.SET_GAME_RESULT,
    gameResult
  }
}

export function setGamematchId(id: any) {
  return {
    type: ACTIONS.SET_GAMEMATCH_ID,
    id
  }
}
