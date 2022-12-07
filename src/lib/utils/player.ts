
/** Player routines
 * 
 * 2022 Novaworks.
 */

import { playersCounterBus, playersByFloor} from "./playersCounter"
import { playerOnBuilding, playerOnFloor} from "building/Floor"

/** Current player */
import { getUserData } from "@decentraland/Identity"
//import { getDecentralandTime } from "@decentraland/EnvironmentAPI"
//import { getUserPublicKey } from "@decentraland/Identity"

executeTask(async () => {
    let myPlayer = await getUserData()

   // onPlayerDisconnectedObservable.add((player) => {
   //   log("player disconect: ", player.userId)
   //   if (player.userId === myPlayer?.userId) {
   //     //log("I diconect the scene!")
   //     if( playerOnBuilding && playerOnFloor ){
   //         playersCounterBus.emit( "change", {
   //            building: playerOnBuilding,
   //            floor: playerOnFloor,
   //            players: playersByFloor[playerOnBuilding][playerOnFloor] - 1,
   //            type: 'leave',
   //         });
   //     }
   //   }
   // })

   // onLeaveSceneObservable.add((player) => {
   //     log("player left scene: ", player.userId)
   //     if (player.userId === myPlayer?.userId) {
   //       log("I left the scene!")
   //       if( playerOnBuilding && playerOnFloor ){
   //           playersCounterBus.emit( "change", {
   //              building: playerOnBuilding,
   //              floor: playerOnFloor,
   //              players: playersByFloor[playerOnBuilding][playerOnFloor] - 1,
   //              type: 'leave',
   //           });
   //       }
   //     }
   // })

    /** Player data */
    // let time = await getDecentralandTime()
    // let publicKeyRequest = executeTask(async () => {
    // let publicKey = await getUserPublicKey()
    //   return publicKey
    // })

    // playersCounterBus.emit( "playerIn", {
    //     data : myPlayer,
    //     time : time,
    //     ethKey: publicKeyRequest.isComplete ? publicKeyRequest : null
    // });

    /** Player connect and disconects */
    //onPlayerConnectedObservable.add((player) => {
    //  log("player conected: ", player.userId)
    //})

    // onEnterSceneObservable.add((player) => {
    //     log("player entered scene: ", player.userId)
    //      if (player.userId === myPlayer?.userId) {
    //        //log("I entered the scene!")
    //      }
    // })
})

// /** Ohters Player Data */
// import { getPlayersInScene } from "@decentraland/Players"
// 
// // Get all players already in scene
// executeTask(async () => {
//   let players = await getPlayersInScene()
//   players.forEach((player) => {
//     log("player is nearby: ", player.userId)
//   })
// })

// // Event when player enters scene
// onEnterSceneObservable.add((player) => {
//   log("player entered scene: ", player.userId)
// })
// 
// // Event when player leaves scene
// onLeaveSceneObservable.add((player) => {
//   log("player left scene: ", player.userId)
// })

//import { getConnectedPlayers } from "@decentraland/Players"
