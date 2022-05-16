import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { ACTIONS as BET_ACTIONS } from '../controllers/bet/settings'
import { ACTIONS as TRIVIOOGAME_ACTIONS } from '../controllers/games/questions/actions/settings'
import { ACTIONS as OTHER_ACTIONS } from '../controllers/games/other/settings'


export interface IBeatCreation {
  type: number | null,
  creatorId: string | null,
  betSettings: string | null,
  gameId: number | null,
  gameSettings: string | null,
  friends: []
}
export interface ITriviooGamematch {
  betId: string,
  betSettings: string,
  creatorId: string,
  gameSettings: string,
  gamers: Array<Gamer>,
  id: string,
  restaurantInfo: string,
  currentQuestionIndex: number
}
export interface ITriviooGame {
  userId: string,
  gamematchId: string,
  room: any,
  gamematch: ITriviooGamematch,
  game: {
    questions: Array<any>,
    raundAnswers: Array<any>,
    gameResult: any
  }
}

export interface IOtherGame {
  userId: string,
  game: {},
  type: number | null,
  friends: [],
  betSettings: {}
}

export interface Gamer {
  id: string,
  userId: string,
  socketId: string,
  state: number,
  gamematchId: string,
}
export interface IState {
  betCreation: IBeatCreation,
  triviooGame: ITriviooGame
}
const initialState = {
  betCreation: {
    "betSettings": "{\"amount\":\"100\"}",
    "creatorId": "db3dfcdf-ec89-417f-a2e8-81c4e3b50094",
    "friends": [],
    "gameId": 1,
    "gameSettings": "{\"categoryId\":1}",
    "type": 1
  }/*{
    type: null,
    creatorId: null,
    betSettings: null,
    gameId: null,
    gameSettings: null,
    friends: []
  }*/,
  triviooGame: {
    userId: '',
    room:{
      id: '',
      playerRooms: [],
    },
    gamematchId: '813474c1-14d7-4bef-9483-d939ca9ced59',
    gamematch: {
      betId: "",
      creatorId: "",
      gameSettings: "{}",
      gamers: [],
      currentQuestionIndex: 0,
      id: ""
    },
    game: {
      questions: [],
      raundAnswers: [],
      gameResult: {}
    }
  },

}


const betCreationReducer = (betCreation: IBeatCreation, action: any): IBeatCreation => {
  switch (action.type) {
    case BET_ACTIONS.UPDATE_BEAT:
      return {
        ...betCreation,
        ...action.beatPart
      }

    default: {
      return betCreation
    }

  }
}

const triviooGameReducer = (triviooGame: ITriviooGame, action: any): ITriviooGame => {
  switch (action.type) {
    case TRIVIOOGAME_ACTIONS.SET_TRIVIOO_GAME:
      return {
        ...triviooGame,
        ...action.triviooGame
      }

    case TRIVIOOGAME_ACTIONS.UPDATE_STATUS_PLAYER:
      const playerIndex = triviooGame.room?.playerRooms.findIndex((player: any) => player?.user?.id === action?.userId);
      if(playerIndex !== -1){
        const playerRooms = [...triviooGame?.room?.playerRooms];
        playerRooms[playerIndex].status = action?.status;
        return {
          ...triviooGame,
          room:{
            ...triviooGame.room,
            playerRooms,
          }
        }
      }

      return {
        ...triviooGame
      }

    case TRIVIOOGAME_ACTIONS.CHANGE_GAMER_STATE:
      const gamerIndex = triviooGame.gamematch.gamers.findIndex(g => g.userId === action.userId)

      return {
        ...triviooGame,
        gamematch: {
          ...triviooGame.gamematch,
          gamers: triviooGame.gamematch.gamers.slice(0, gamerIndex).concat([{
            ...triviooGame.gamematch.gamers[gamerIndex],
            state: action.state
          }]).concat(triviooGame.gamematch.gamers.slice(gamerIndex + 1))
        }
      }

    case TRIVIOOGAME_ACTIONS.SET_GAME_QUESTIONS:
      return {
        ...triviooGame,
        game: {
          ...triviooGame.game,
          questions: action.questions
        }
      }

    case TRIVIOOGAME_ACTIONS.SET_CURRENT_QUESTION_INDEX:
      return {
        ...triviooGame,
        gamematch: {
          ...triviooGame.gamematch,
          currentQuestionIndex: action.currentQuestionIndex
        }
      }

    case TRIVIOOGAME_ACTIONS.SET_RAUND_ANSWERS:
      return {
        ...triviooGame,
        game: {
          ...triviooGame.game,
          raundAnswers: action.raundAnswers
        }
      }

    case TRIVIOOGAME_ACTIONS.SET_GAME_RESULT:
      return {
        ...triviooGame,
        game: {
          ...triviooGame.game,
          gameResult: action.gameResult
        }
      }

    case TRIVIOOGAME_ACTIONS.SET_GAMEMATCH_ID:
      return {
        ...triviooGame,
        gamematchId: action.id
      }
    
    case "UPDATE_ROOM":
      return{
        ...triviooGame,
        room: action.room
      }

    default: {
      return triviooGame
    }

  }
}

const otherGameReducer = (otherGame: IOtherGame, action: any): IOtherGame => {
  switch (action.type) {
    case OTHER_ACTIONS.UPDATE_OTHER:
      return {
        ...otherGame,
        ...action.otherPart
      }
    default: {
      return otherGame
    }

  }
}

const getStore = () => {
  return createStore(
    (state: any, action: any) => {
      return {
        ...state,
        betCreation: betCreationReducer(state.betCreation, action),
        triviooGame: triviooGameReducer(state.triviooGame, action),
        otherGame: otherGameReducer(state.otherGame, action),
      }
    },
    initialState,
    applyMiddleware(
      thunkMiddleware
    )
  )
}

export default getStore