/** ARENA DG Basement
 *  
 * 2022 Novaworks.
 */

import { Chamber } from "./Chamber"
import { BasementAdvWall } from "./BasementAdvWall"
import { Portal } from '../building/Portal'
import { fetchAdsMaterials} from "lib/utils/sharedAssets"
import { initAnimatedCircle } from "./AnimatedCircle"
import * as utils from '@dcl/ecs-scene-utils'

import {
  OKEX_SCREEN_FRAME,
  okexScreenContent,
  OKEX_ADV_FRAME,
  OKEX_ADV_MATERIAL,

  THETA_SCREEN_FRAME,
  thetaScreenContent,
  THETA_ADV_FRAME,
  THETA_ADV_MATERIAL,

  TWITCH_SCREEN_FRAME,
  twitchScreenContent,
  TWITCH_ADV_FRAME,
  TWITCH_ADV_MATERIAL,
  
  TRANSPARENT_MATERIAL,

  streamContent,

  resfreshStreaming
} from "lib/utils/sharedAssets"

export class Basement{
  chambers = []
  advWalls = []
  private largeAdsWallsMaterials

  constructor(){
    this.buildBasement()
    initAnimatedCircle()
    this.createPortal()
    this.createScreensTrigger()
    this.initAdWalls()
  }
  

  buildBasement(){
    const basementEntity = new Entity()
    const BASEMENT = new GLTFShape("models/basement.glb");
    basementEntity.addComponent(BASEMENT)
    engine.addEntity(basementEntity)
  }

  createPortal(){
    new Portal(
      new Vector3(64,3,46),
      Vector3.One().scale(5),
      Vector3.Zero(),
      new Vector3(60, 9.5, 50),
      undefined,
      undefined,
      "GO 1F",
      undefined,
      false,
      false
    );
  }

  createChambers(){
    this.chambers.push(
      new Chamber(
        new Vector3(41.93,3.60,66.94),
        new Quaternion(0,1,0,0),
        TWITCH_SCREEN_FRAME,
        streamContent,
      )
    )
    
    this.chambers.push(
      new Chamber(
        new Vector3(87.09, 3.60, 29.06),
        new Quaternion(0,0,0,0),
        THETA_SCREEN_FRAME,
        streamContent,
      )
    )
    
    this.chambers.push(
      new Chamber(
        new Vector3(29.228, 3.608,38.524),
        new Quaternion(0,1,0,1),
        OKEX_SCREEN_FRAME,
        streamContent
      )
    )
    
    this.chambers.push(
      new Chamber(
        new Vector3(98.950, 3.608, 57.474),
        new Quaternion(0,-1,0,1),
        OKEX_SCREEN_FRAME,
        streamContent
      )
    )
  }

  private removeChambers(){
    this.chambers.forEach(element => {
        element.removeChamber()
    });
  }

  public createLargeAdsWalls(adsMaterials){
    this.advWalls.push(
      new BasementAdvWall(
        new Vector3(61, 0, 18.5),
        new Vector3(0, -90, 0),
        THETA_ADV_FRAME,
        adsMaterials,
        4,
      )
    )
    
    this.advWalls.push(
      new BasementAdvWall(
        new Vector3(66.8, 0, 77.5),
        new Vector3(0, 90, 0),
        TWITCH_ADV_FRAME,
        adsMaterials,
        4,
      )
    ) 
  }

  public createSmallAdsWalls(adsMaterials){
    this.advWalls.push(
      new BasementAdvWall(
        new Vector3(19, 0, 50.7),
        new Vector3(0, 0, 0),
        OKEX_ADV_FRAME,
        adsMaterials,
        3,
      )
    )
    
    this.advWalls.push(
      new BasementAdvWall(
        new Vector3(109.5, 0, 45),
        new Vector3(0, 180, 0),
        OKEX_ADV_FRAME,
        adsMaterials,
        3,
      )
    )
  }

  initAdWalls(){
    fetchAdsMaterials(38).then(
      response => {
        this.createLargeAdsWalls(response)
      }
    )

    fetchAdsMaterials(37).then(
      response => {
        this.createSmallAdsWalls(response)
      }
    )
  }

  removeAdvsWalls(){
    this.advWalls.forEach(element => {
      element.removeAds()
    });
  }

  createScreensTrigger(){ 
    let triggerSize = new Vector3(80, 4, 80)
    let boxTrigger = new Entity()
    boxTrigger.addComponent(TRANSPARENT_MATERIAL)
    boxTrigger.addComponent(new BoxShape()).withCollisions = false
    boxTrigger.addComponent(new Transform({
      position: new Vector3(63, 2, 49),
      scale: triggerSize
    }))
    
    let basementTriggerBox = new utils.TriggerBoxShape(triggerSize)
    boxTrigger.addComponent(
      new utils.TriggerComponent(
        basementTriggerBox,
        {
          onCameraEnter : () => {
            resfreshStreaming()
            this.createChambers()
          },
          onCameraExit : () => {
            this.removeChambers()
          }
        }
      )
    )
    engine.addEntity(boxTrigger)
  }
}