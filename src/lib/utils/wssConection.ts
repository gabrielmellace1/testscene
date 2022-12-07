/** ARENA DG 
 * Playrr counter perssintance over websocket
 *  
 * 2022 Novaworks.
 */

import { getCurrentRealm } from '@decentraland/EnvironmentAPI'
import { playerOnBuilding, playerOnFloor } from '../building/Floor'
import { playersCounterBus, playersByFloor} from "./playersCounter"
import { getUserData } from "@decentraland/Identity"
import { getDecentralandTime } from "@decentraland/EnvironmentAPI"

const DEBUG : Boolean = false

/** How often the player sends updates to server, in seconds */


const LOCAL_SERVER: boolean = false

/** Types of data sent over websockets */
enum dataType {
  PING,
  INIT,
  SYNC,
  DATA,
}
/*
const remoteUrl = `wss://kws.novaworks.cloud/broadcast`
const server = LOCAL_SERVER
  ? 'ws://localhost:8080/'
  : remoteUrl

/** Establish connection and message manipulation */
/*
export async function joinSocketsServer() {


  let counterInit = false

  /** Get user data */ 
  /*
  if(DEBUG) log('about to get the user data')
  //alteredUserName = userData.displayName + Math.floor(Math.random() * 10000)
  let player = await getUserData()
  let time = await getDecentralandTime()
  let realm = await getCurrentRealm() //

  /** Keep counter in different realms ws server */ 
  /*
  if(DEBUG) log(`You are in the realm: `, realm.displayName)
  
  /** Connect to websockets server */ 
  //const socket = await new WebSocket(server + realm.displayName + '-counter')
  /*
  const socket = await new WebSocket(server)

  //log('socket connection to: ', server + realm.displayName + '-counter')
  if(DEBUG) log('Socket connection to: ', server )

  socket.onopen = async function (event) {

    if (!counterInit) {
      socket.send(
        JSON.stringify({
          data: {
            realm: realm.displayName,
            type: dataType.INIT,
            legend: 'Ask counter for my realm!',
          }
        })
      )
    }

  }

  /** Incomings */ 
  /*
  socket.onmessage = async function (event) {
    try {
      if(DEBUG) log('INCOMING: ' + event.data)
      const msg = JSON.parse(event.data)

      switch (msg.data.type) {

        case dataType.SYNC:
          let remoteCounter = msg.data.counter
          //if (!counterInit) {
            if(DEBUG) log(msg.data)
            if (realm.displayName == msg.data.realm) {
              for( let building in remoteCounter ){
                for( let floor in remoteCounter[building] ){
                  playersCounterBus.emit( "change" , {
                    building: building,
                    floor: floor,
                    players: remoteCounter[building][floor],
                    type: 'init',
                  });
                 }
              }
              //counterInit = true
            //}
          }
          break
      }
    } catch (error) {
      if(DEBUG) log('exec: '+ error)
    }

  }

  playersCounterBus.on("change",
      (value) => {

        if( counterInit ){
          if(DEBUG) log('SYNC',value)
          socket.send(
            JSON.stringify({
              data: {
                realm: realm.displayName,
                type: dataType.SYNC,
                legend: 'Update remote counter!',
                building: value.building,
                floor: value.floor,
                players: value.players,
              }
            })
          )
        }
      }
  );


  playersCounterBus.on("playerIn",
      (value) => {
          socket.send(
            JSON.stringify({
              data: {
                time : value.time,
                player : value.data,
                wearables : value.data.avatar.wearables,
                ethereumKey: value.ethKey,
                type : dataType.DATA,
              }
            })
          )
        }
  );

  socket.onerror = (res) => {
    if(DEBUG) log('WSS ERROR ', res)
  }

  socket.onclose = (res) => {
    counterInit = false
    if(DEBUG) log('DISCONNECTED FROM SERVER', socket.readyState)
    if(DEBUG) log('Tring to reconect...')
    setUpScene() 
  }

  //engine.addSystem( new pingSystem(socket) )

  engine.addSystem( new initAndUpdateSystem(
    socket,
    realm.displayName,
    player.userId,
  ))

  return time
}

async function setUpScene() {
    let socket = await joinSocketsServer()
};
setUpScene() 

/** Systems for periodic communication */
/*
class initAndUpdateSystem implements ISystem {
  timer: number = 0
  socket: WebSocket
  realm: string
  player: string
  init: boolean = false

  update(dt: number): void {
    this.timer += dt

    /** Update local counter frome remote server at a init */ 
    /*
    if ( !this.init && this.timer >= 9) {
     // Send once at init
     this.init = true
    }

    /** Send updated counter to server at a regular interval */ 
    /*
    if (this.timer >= 10 && this.init) {
      this.timer = 0
      this.socket.send(
        JSON.stringify({
          data: {
            type: dataType.PING,
            legend: 'Still here!',
            realm: this.realm,
            player: this.player,
            building: playerOnBuilding,
            floor: playerOnFloor,
          }

        })
      )
    }

  }
  constructor(socket: WebSocket, realm:string, player:string) {
    this.socket = socket,
    this.realm = realm
    this.player = player
  }
}

//const updateInterval = 5
////let player = await getUserData()
////let time = await getDecentralandTime()
////let realm = await getCurrentRealm() //
//class pingSystem implements ISystem {
//  interval: number = updateInterval
//  socket: WebSocket
//  update(dt: number): void {
//      this.interval -= dt
//      if (this.interval < 0) {
//        this.interval = updateInterval
//        this.socket.send(
//          JSON.stringify({
//            data: {
//              type: dataType.PING,
//              legend: 'PONG',
//              //realm: realm.displayName,
//              realm: 'reealms',
//            }
//          })
//        )
//      }
//  }
//  constructor(socket: WebSocket) {
//    this.socket = socket
//  }
//
//}*/