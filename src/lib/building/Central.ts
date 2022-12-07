/** ARENA DG Central building
 *  
 * 2022 Novaworks.
 */

import * as utils from '@dcl/ecs-scene-utils'
import { fetchMarqueeText } from '../media/media'
import { Marquee } from "../marquee/marquee";
import { Portal } from './Portal'
import { Screen } from "utils/Screen"

import {
  streamContent,
  //OKEX_SCREEN_FRAME,
  //okexScreenContent,
  //THETA_SCREEN_FRAME,
  //thetaScreenContent,
  TWITCH_SCREEN_FRAME, // To do, pedir marco rojo
  //twitchScreenContent,
  PORTAL_RED_GLB,
  PORTAL_NUMBERS_WHITE,
  TRANSPARENT_MATERIAL,

  resfreshStreaming
} from "lib/utils/sharedAssets"


export class Central {
  private portalScale = new Vector3(1.3, 1.3, .75)
  private portal1FDestination = new Vector3(70, 22, 42)
  private portal2FDestination = new Vector3(70, 33, 42)
  
  private left1FDestination = new Vector3(70, 23, 42)
  private left2FDestination = new Vector3(66.5, 33.5, 42)
  private left1FOrigin = new Vector3(38.4, 23, 51)
  private left1FOrigin_b = new Vector3(90, 23, 46)

  private left2FOrigin = new Vector3(61, 31.5, 54)
  private right2FOrigin = new Vector3(67, 31.5, 54)
  private left2BFOrigin = new Vector3(67, 31.5, 42)
  private right2BFOrigin = new Vector3(61, 31.5, 42)  
  
  private rightPBDestination = new Vector3(66.5, 9, 54)
  private right1FOrigin = new Vector3(38.4, 23 , 55)
  private right1FOrigin_b = new Vector3(90, 23 , 41)

  private screen1Fa : Screen
  private screen1Fb : Screen
  private screen2Fa : Screen
  private screen2Fb : Screen

  constructor(){
    this.addCentralBuilding()
    
    this.addGFPortals()
    this.add1FPortals()
    this.add2FPortals()

    this.addGFScreens()
    this.add1FScreens()
    this.addF2Screens()
    
    this.addScreensTrigger()
  }

  addCentralBuilding(){
    const edificiocentral = new Entity();
    edificiocentral.addComponent(new GLTFShape("models/central.glb"));
    edificiocentral.addComponent(new Transform({scale: Vector3.One()}))
    engine.addEntity(edificiocentral);
  }

  addGFPortals(){      
    let portalPBto1Fa = new Portal(
      new Vector3(55, 8.5, 41),
      this.portalScale,
      new Vector3(0,225+180,0),
      this.portal1FDestination,
      PORTAL_RED_GLB,
      PORTAL_NUMBERS_WHITE[1],
      "GO 1F",
      undefined,
      false,
      false
    );
    
    let portalPBto1Fb = new Portal(
      new Vector3(72, 8.5, 56),
      this.portalScale,
      new Vector3(0,45+180,0),
      this.portal1FDestination,
      PORTAL_RED_GLB,
      PORTAL_NUMBERS_WHITE[1],
      "GO 1F",
      undefined,
      false,
      false
    );
    
    let portalPBto2Fa = new Portal(
      new Vector3(74, 8.5, 39),
      this.portalScale,
      new Vector3(0,310,0),
      this.portal2FDestination,
      PORTAL_RED_GLB,
      PORTAL_NUMBERS_WHITE[2],
      "GO 2F",
      undefined,
      false,
      false
    );
    
    let portalPBto2Fb = new Portal(
      new Vector3(54, 8.5, 57),
      this.portalScale,
      new Vector3(0,130,0),
      this.portal2FDestination,
      PORTAL_RED_GLB,
      PORTAL_NUMBERS_WHITE[2],
      "GO 2F",
      undefined,
      false,
      false
    );
  }

  add1FPortals(){
    let left_1F_Portal = new Portal(
      this.left1FOrigin,
      this.portalScale,
      new Vector3(0, 90, 0),
      this.left2FDestination,
      PORTAL_RED_GLB,
      PORTAL_NUMBERS_WHITE[2],
      "GO 2F",
      undefined,
      true,
      true
    );
    
    let right_1F_Portal = new Portal(
      this.right1FOrigin,
      this.portalScale,
      new Vector3(0, 90, 0),
      this.rightPBDestination,
      PORTAL_RED_GLB,
      PORTAL_NUMBERS_WHITE[0],
      "GO To Hall",
      undefined,
      true,
      false
    );
    
    let left_1F_Portal_b = new Portal(
      this.left1FOrigin_b,
      this.portalScale,
      new Vector3(0, 270, 0),
      this.left2FDestination,
      PORTAL_RED_GLB,
      PORTAL_NUMBERS_WHITE[2],
      "GO 2F",
      undefined,
      true,
      false
    );
    
    let right_1F_Portal_b = new Portal(
      this.right1FOrigin_b,
      this.portalScale,
      new Vector3(0,  270, 0),
      this.rightPBDestination,
      PORTAL_RED_GLB,
      PORTAL_NUMBERS_WHITE[0],
      "GO To Hall",
      undefined,
      true,
      true
    );
  }
  
  add2FPortals(){
    let left_2F_Portal = new Portal(
      this.left2FOrigin,
      this.portalScale,
      new Vector3(0, 180, 0),
      this.left1FDestination,
      PORTAL_RED_GLB,
      PORTAL_NUMBERS_WHITE[1],
      "GO 1F",
      undefined,
      true,
      true
    );
    
    let left_2F_Portal_B = new Portal(
      this.left2BFOrigin,
      this.portalScale,
      new Vector3(0, 0, 0),
      this.left1FDestination,
      PORTAL_RED_GLB,
      PORTAL_NUMBERS_WHITE[1],
      "GO 1F",
      undefined,
      true,
      true
    );
    
    let right_2F_Portal = new Portal(
      this.right2FOrigin,
      this.portalScale,
      new Vector3(0, 180, 0),
      this.rightPBDestination,
      PORTAL_RED_GLB,
      PORTAL_NUMBERS_WHITE[0],
      "Go To Hall",
      undefined,
      true,
      true
    );
    
    let right_2F_Portal_B = new Portal(
      this.right2BFOrigin,
      this.portalScale,
      new Vector3(0, 0, 0),
      this.rightPBDestination,
      PORTAL_RED_GLB,
      PORTAL_NUMBERS_WHITE[0],
      "Go To Hall",
      undefined,
      true,
      true
    );
  }

  addGFScreens(){
    let parentEntity = new Entity()
    
    let basementCenter1 = new Entity();
    basementCenter1.addComponent(new Transform({ position:new Vector3(64,10,48), scale: new Vector3(1,1,1) }))
    basementCenter1.getComponent( Transform).rotation.eulerAngles = new Vector3(0,30,0)
    engine.addEntity(basementCenter1)
    basementCenter1.setParent(parentEntity)
    let screenGF1 = new Screen(new Vector3(0, 3, 8), new Vector3(0, 180, 0), TWITCH_SCREEN_FRAME, streamContent, basementCenter1,1, false);
    let screenGF2 = new Screen(new Vector3(0, 3, -8), new Vector3(0, 0, 0), TWITCH_SCREEN_FRAME, streamContent, basementCenter1,1, false);

    //esto el parent? no se entiende bie
    let basementCenter2 = new Entity();
    basementCenter2.addComponent(new Transform({ position:new Vector3(64,10,48), scale: new Vector3(1,1,1) }))
    basementCenter2.getComponent( Transform).rotation.eulerAngles = new Vector3(0,90,0)

    engine.addEntity(basementCenter2)
    basementCenter2.setParent(parentEntity)
    let screenGF3 = new Screen(new Vector3(0, 3, 8), new Vector3(0,  180, 0), TWITCH_SCREEN_FRAME, streamContent, basementCenter2, 1, false);
    let screenGF4 = new Screen(new Vector3(0, 3, -8), new Vector3(0,0, 0), TWITCH_SCREEN_FRAME, streamContent, basementCenter2, 1, false);

    let basementCenter3 = new Entity();
    basementCenter3.addComponent(new Transform({ position:new Vector3(64,10,48), scale: new Vector3(1,1,1) }))
    basementCenter3.getComponent( Transform).rotation.eulerAngles = new Vector3(0,-30,0)
    engine.addEntity(basementCenter3)

    basementCenter3.setParent(parentEntity)

    let screenGF5 = new Screen(new Vector3(0, 3, 8), new Vector3(0, 180, 0), TWITCH_SCREEN_FRAME, streamContent, basementCenter3, 1, false);
    let screenGF6 = new Screen(new Vector3(0, 3, -8), new Vector3(0,0, 0), TWITCH_SCREEN_FRAME, streamContent, basementCenter3, 1, false);

    engine.addEntity(parentEntity)
    parentEntity.addComponent(new Transform({ position: new Vector3(0, 0 ,0)}))
    this.GFScreensMovement(parentEntity, screenGF1, screenGF2, screenGF3, screenGF4, screenGF5, screenGF6)
  }

  GFScreensMovement(parentEntity, screenGF1, screenGF2, screenGF3, screenGF4, screenGF5, screenGF6){
    let triggerSizeGF = new Vector3(10, 4, 10)
    let boxTriggerGF = new Entity()
    boxTriggerGF.addComponent(TRANSPARENT_MATERIAL)
    boxTriggerGF.addComponent(new BoxShape()).withCollisions = false
    boxTriggerGF.addComponent(new Transform({
      position: new Vector3(64, 9, 48),
      scale: triggerSizeGF
    }))

    let pathDown = []
    pathDown[0] = new Vector3(0, 0, 0)
    pathDown[1] = new Vector3(0, -3.7, 0)

    let pathUp = []
    pathUp[0] = new Vector3(0, -3.7, 0)
    pathUp[1] = new Vector3(0, 0, 0)

    let GFTriggerBox = new utils.TriggerBoxShape(triggerSizeGF)
    boxTriggerGF.addComponent(
      new utils.TriggerComponent(
        GFTriggerBox,
        {
          onCameraEnter : () => {
            resfreshStreaming()
            parentEntity.addComponent(new utils.FollowPathComponent(pathDown, 1))
            screenGF1.playScreen()
            screenGF2.playScreen()
            screenGF3.playScreen()
            screenGF4.playScreen()
            screenGF5.playScreen()
            screenGF6.playScreen()
          },
          onCameraExit : () => {
            parentEntity.addComponent(new utils.FollowPathComponent(pathUp, 1))
            screenGF1.pauseScreen()
            screenGF2.pauseScreen()
            screenGF3.pauseScreen()
            screenGF4.pauseScreen()
            screenGF5.pauseScreen()
            screenGF6.pauseScreen()
          }
        }
      )
    )
    engine.addEntity(boxTriggerGF)
  }

  add1FScreens(){
    let screen1FEntity = new Entity(); 
    screen1FEntity.addComponent(new Transform({ position:new Vector3(64,20,48), scale: new Vector3(1,1,1) }))
    engine.addEntity(screen1FEntity)
    screen1FEntity.getComponent(Transform).scale = Vector3.One().scale(1.3) 
    this.screen1Fa = new Screen(new Vector3(0, 3, 0), new Vector3(0, -90, 0), TWITCH_SCREEN_FRAME, streamContent, screen1FEntity, 1.25, false)
    this.screen1Fb = new Screen(new Vector3(0.1, 3, 0), new Vector3(0, 90, 0), TWITCH_SCREEN_FRAME, streamContent, screen1FEntity, 1.25, false)
  }

  addF2Screens(){
    const upperFloorPos = new Vector3(64,33,48)

    let streamingScreen = new Entity();
    streamingScreen.addComponent(new Transform({ position: upperFloorPos, scale: new Vector3(1,1,1) }))
    engine.addEntity(streamingScreen)
    streamingScreen.getComponent(Transform).scale = Vector3.One().scale(2.3) 

    this.screen2Fa = new Screen(new Vector3(-11, 0, 0), new Vector3(0, 90, 0), TWITCH_SCREEN_FRAME, streamContent, streamingScreen, 1, false)
    this.screen2Fb = new Screen(new Vector3(11, 0, 0), new Vector3(0, -90, 0), TWITCH_SCREEN_FRAME, streamContent, streamingScreen, 1, false)
  }

  addScreensTrigger(){
    let triggerSize = new Vector3(60, 20, 35)
    let boxTrigger = new Entity()
    boxTrigger.addComponent(TRANSPARENT_MATERIAL)
    boxTrigger.addComponent(new BoxShape()).withCollisions = false
    boxTrigger.addComponent(new Transform({
      position: new Vector3(64, 30, 47),
      scale: triggerSize
    }))

    let basementTriggerBox = new utils.TriggerBoxShape(triggerSize)
    boxTrigger.addComponent(
      new utils.TriggerComponent(
        basementTriggerBox,
        {
          onCameraEnter : () => {
            resfreshStreaming()
            this.screen1Fa.playScreen()
            this.screen1Fb.playScreen()
            // To do: separar esto y agregar retro pantalla en 1er piso
            this.screen2Fa.playScreen()
            this.screen2Fb.playScreen()
          },
          onCameraExit : () => {
            this.screen1Fa.pauseScreen()
            this.screen1Fb.pauseScreen()
            // To do: separar esto y agregar retro pantalla en 1er piso
            this.screen2Fa.pauseScreen()
            this.screen2Fb.pauseScreen()
          }
        }
      )
    )
    engine.addEntity(boxTrigger)
  }

  public addMarquee(){
    fetchMarqueeText().then(response => {
      let marquee = new Marquee(
        response,
        new Vector3(65, 24, 48),
        new Vector3(61, 5, 31),
      )
    })
  }
}