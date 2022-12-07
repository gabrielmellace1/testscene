
/** ARENA DG
 * Coount Players in each Building by floor
 *  
 * 2022 Novaworks.
 */
import { boards } from "./Billboard";
export const playersCounterBus = new MessageBus();

export let playersByFloor = {
  'okex1' : [0, 0, 0, 0],
  'okex2' : [0, 0, 0, 0],
  'twitch': [0, 0, 0, 0],
  'theta' : [0, 0, 0, 0],
}

//playersCounterBus.on("change",
//    (v) => {
//        /** Set counter */
//        playersByFloor[v.building][v.floor] = v.players
//        /** Set billboard */
//        // boards[v.building].setFloor(v.floor, playersByFloor[v.building][v.floor])
//    }
//);