
// pm2 flush && pm2 restart src/index.ts --name ws-broadcast && pm2 log^C

import * as WebSocket from "ws";

const DEBUG : Boolean = false

const  PORT_NUMBER = 8080;
const wss = new WebSocket.Server({ port: PORT_NUMBER});

interface customWs extends WebSocket {
  realm: string;
}
const d = new Date();
/** Types of data sent over websockets */
enum dataType {
  PING,
  INIT,
  SYNC,
}

let a : string[] = []

let livePlayers: { [key: string]:any } = { }


let initCounter : {
  [key: string]: number[]
} = {
  'okex1' : [0, 0, 0, 0],
  'twitch' : [0, 0, 0, 0],
  'okex2': [0, 0, 0, 0],
  'theta' : [0, 0, 0, 0],
  'out' : [0],
}

let realmsCounter : {
    [key: string]: any
} = {}
//} = { localhost : initCounter }

let rate = 10000

var intervalId = setInterval(function(){

  let conected = Object.keys(livePlayers).length
  let ms = Date.now();
  if(DEBUG)console.log('-- Players online: ' + conected + ' at: ' + ms +' --')

  for(let p in livePlayers){
    
    let player = livePlayers[p]
    let pl =  player.realm + player.building + player.floor
    if(DEBUG)console.log(p,livePlayers[p])

    /** Check if playert does not update */
    if(ms >  (player.time + rate )){
      /** Delete player from registry */
      if(DEBUG)console.log( p, "diconnected")
      if(player.lastBuilding){
        realmsCounter[player.realm][player.lastBuilding][player.lastFloor]-= 1
        delete livePlayers[p]
        continue
      }
    }else if(!player.registered){
        /** Fill counter */
        if(DEBUG)console.log('NEW PLAYER')
        livePlayers[p].registered = true
        livePlayers[p].lastSeen = pl
      if(player.building){
        realmsCounter[player.realm][player.building][player.floor]+= 1
        livePlayers[p].lastBuilding = player.building
        livePlayers[p].lastFloor = player.floor
      }
    }
    if(player.registered){
      if(livePlayers[p].lastSeen !== pl){
        /** Update player counter */
        if(DEBUG)console.log('PLAYER MOVES')
        livePlayers[p].lastSeen = pl
        if(player.lastBuilding){
          realmsCounter[player.realm][player.lastBuilding][player.lastFloor]-= 1
        }
        if(player.building){
          realmsCounter[player.realm][player.building][player.floor]+= 1
          livePlayers[p].lastSeen = pl
          livePlayers[p].lastBuilding = player.building
          livePlayers[p].lastFloor = player.floor
        }
      }else{
        if(DEBUG)console.log("PLAYER DOSN'T MOVE ")
      }
    }
  }
  if(DEBUG)console.log(realmsCounter)
}, rate * 2);

//clearInterval(intervalId) 

wss.on("connection", (clientWs, request) => {
  const ws = clientWs as customWs;

  ws.realm = request.url || "";

  ws.on( "message", function incoming(event) {
    wss.clients.forEach(function each(client) {
      const cWs = client as customWs;
      if (cWs.readyState === WebSocket.OPEN && cWs.realm === ws.realm) {
        const msg = JSON.parse(event.toString())
        cWs.realm = msg.data.realm || "";

        switch (msg.data.type) {
          case dataType.PING:
            if (ws.readyState === WebSocket.OPEN) {
              let value = msg.data
              let ms = Date.now();
              /** If player no registered */
              if (!(value.realm in realmsCounter)){
                  realmsCounter[value.realm] = initCounter
              }
              if (!(value.player in livePlayers)){
                livePlayers[value.player] = {
                  time : ms,
                  realm : value.realm,
                  building : value.building,
                  floor : value.floor,
                  registered : false,
                }
              }else{
                livePlayers[value.player].time = ms
                livePlayers[value.player].realm = value.realm
                livePlayers[value.player].building = value.building
                livePlayers[value.player].floor = value.floor
                livePlayers[value.player].registered = true
              }
              if(msg.data.realm in realmsCounter){
                  ws.send(
                    JSON.stringify({
                      data: {
                        type : dataType.SYNC,
                        legend : 'Sending remote counter to scene in real: ' + msg.data.realm,
                        counter : realmsCounter[msg.data.realm],
                        realm: msg.data.realm
                      }
                    })
                  );
                }
              }
            break

        }
      }
    });
  });
});

wss.once("listening", ()=>{
  console.log("Listening on port " + PORT_NUMBER)
})