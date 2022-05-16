import { ACTIONS } from "./settings";
import { fetchPost } from "../../../client";
import { extractJWT, getData } from "../../utils";
import { setGamematchId } from "../games/questions/actions";

export function updateBeat(beatPart: any) {
  return {
    type: ACTIONS.UPDATE_BEAT,
    beatPart
  }
}

export function createBet(navigation: any, type: string = 'game') {
  return async (dispatch: any, getState: any) => {
    try {
      const token = await getData('userToken');
      const jwt = extractJWT(token)
      const state = await getState()
      const bet = state.betCreation
      bet.creatorId = jwt.id
      const result = await fetchPost('/api/bet/createBet', bet)
      dispatch(setGamematchId(result.data.gamematchId))
      navigation.navigate('Preguntados-Game', { type })
    } catch (error) {
      console.log(error);
    }
  }
}