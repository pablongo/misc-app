import { ACTIONS } from "./settings";

export function updateOther(otherPart: any) {
  return {
    type: ACTIONS.UPDATE_OTHER,
    otherPart
  }
}