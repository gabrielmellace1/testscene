/** ARENA DG Floor
 *  
 * 2022 Novaworks.
 */

import * as utils from '@dcl/ecs-scene-utils'

import { Portal, PortalOperationType } from "./Portal"
import { Screen } from "utils/Screen"
import { Advertisement } from "../utils/Advertisement"
import { TRANSPARENT_MATERIAL, TABLE_MODEL, PORTAL_NUMBERS_WHITE, resfreshStreaming} from "lib/utils/sharedAssets"

//import { Platform } from '@decentraland/EnvironmentAPI'

import { playersCounterBus, playersByFloor } from "utils/playersCounter"

// export let floorHistory : any[] = []
export let playerOnBuilding : any = 'out'
export let playerOnFloor : number = 0

/** Creates and place Floors */
export class Floor {
    private portals = []
    private tables = []
    private ads = []
    private screens = []

    private static readonly HEIGHT_FLOOR = 20.5
    private FLOOR_REF: Entity
    private FLOOR_TRANSFORM: Transform
    public  players : number = 0
    private BUILDING_INTERIOR_ENTITY
    private BUILDING_EXTERIOR_ENTITY

    /**
    * @param {Vector3} position     - Floor center.
    * @param {Vector3} rotation     - Floor orientation.
    * @param {GLTFShape} screeFrame - Floor shape for framing content.
    * @param {VideoTexture} screeContent - Floor poster material.
    * @param {GLTFShape} advFrame   - Floor shape for framing Ads.
    * @param {Texture} advContent   - Floor poster material.
    * @param {Vector3} triggerScale - Floor scale trigger
    */
    constructor(
        private level: number,
        private position: Vector3,
        private rotation: Vector3,
        private portalModel: GLTFShape,
        private screenFrame: GLTFShape,
        private screenContent: Material,
        private advFrame: GLTFShape,
        private advContent: Material,
        BUILDING_INTERIOR_ENTITY : Entity,
        BUILDING_EXTERIOR_ENTITY : Entity,
        public building: string,
        private floorLength: number = 1,
        private shouldUpdate?: boolean,
        private triggerScale?: Vector3,
        private triggerOffset?: Vector3,
    ){
        this.BUILDING_INTERIOR_ENTITY = BUILDING_INTERIOR_ENTITY
        this.BUILDING_EXTERIOR_ENTITY = BUILDING_EXTERIOR_ENTITY
        this.floorLength = floorLength
        this.FLOOR_REF = new Entity();
        this.FLOOR_REF.addComponent(new Transform({
            position : position
        }))
        this.FLOOR_TRANSFORM = this.FLOOR_REF.getComponent(
            Transform
        )
        this.FLOOR_TRANSFORM.rotation.eulerAngles = rotation
        engine.addEntity(this.FLOOR_REF)
        this.addTriggerBox(this.FLOOR_REF,triggerScale,triggerOffset)
    }
    
    private addPortals(
        level: number,
        portalModel: GLTFShape,
        reference: Entity,
        BUILDING_INTERIOR_ENTITY : Entity,
        BUILDING_EXTERIOR_ENTITY : Entity
    ){
        for(let i = 0; i < 4; i++){
            let targetX = 1
            let upOrDown = 0
            let portalNumber = i + 1
            if(level >= i){
               upOrDown = -1
            }
            let targetFloor = i + upOrDown
            portalNumber = targetFloor + 1
            let portalText = "LEVEL " + ( targetFloor + 1 ).toString()
            if(targetFloor < 0){
               targetX = 0
               portalText = "HALL"
               portalNumber = 0
            }
            let targetY = Floor.HEIGHT_FLOOR + (12 * targetFloor) 
            let hoverText = "GO TO: " + portalText
            let portalsZ = (this.floorLength <= 1) ? -13.4 : -29.

            this.portals.push(
                new Portal(
                    new Vector3(
                        6 - (4 * i),
                        -1.2,
                        portalsZ - (4 * i)
                    ),
                    new Vector3(1.3, 1.3, .75),
                    new Vector3(0,-44.4, 0),
                    new Vector3(
                        // todo: Spawn point 
                        this.FLOOR_TRANSFORM.position.x, // relative to size
                        targetY,
                        this.FLOOR_TRANSFORM.position.z
                    ),
                    portalModel,
                    PORTAL_NUMBERS_WHITE[portalNumber],
                    hoverText,
                    reference,
                    this.shouldUpdate,
                    i % 2 == 0? true : false
                )
            )

            if(targetFloor < 0) {
                this.portals.forEach(element => {
                    element.AddPortalOperationType(
                        PortalOperationType.ExitBuilding,
                        BUILDING_INTERIOR_ENTITY,
                        BUILDING_EXTERIOR_ENTITY
                    )
                });
                
            }
            else {
                this.portals.forEach(element => {
                    element.AddPortalOperationType(
                        PortalOperationType.EnterBuilding,
                        BUILDING_INTERIOR_ENTITY,
                        BUILDING_EXTERIOR_ENTITY
                    )
                });
            }
        }
    }
    
    private removePortals(){
        this.portals.forEach(element => {
            element.removePortal()
        });
    }

    private addScreens(
        screenFrame: GLTFShape,
        screenContent:Material,
        reference: Entity,
    ){
        this.screens.push(
            new Screen(
                new Vector3( 0, 1, 10.5),
                new Vector3(0, 180, 0),
                screenFrame,
                screenContent, 
                reference,
                1.5,
                true,
            )
        )
        
        let secondScreenZ = (this.floorLength <= 1) ? 0 : 8
        this.screens.push(
            new Screen(
                new Vector3( -10, 1, 0 - secondScreenZ),
                new Vector3(0, 90,0),
                screenFrame,
                screenContent, 
                reference,
                1.5,
                true,
            )
        )
    }

    private removeScreens(){
        this.screens.forEach(element => {
            element.removeScreen()
        });
    }

    private addAdvs(
        advFrame: GLTFShape,
        advContent: Material,
        reference: Entity
    ){
        let advsZ = (this.floorLength <= 1) ? -19 : -36
        this.ads.push(
            new Advertisement(
                new Vector3( -10, 0, advsZ + 4.5),
                new Vector3(0,0,0),
                new Vector3(0, -90, 180),
                advFrame,
                advContent,
                reference,
            )
        )
        this.ads.push(
            new Advertisement(
                new Vector3( -10, 0, advsZ - 4.5 ),
                new Vector3(1,1,1),
                new Vector3( 0, -90, 180),
                advFrame,
                advContent,
                reference
            )
        )
    }

    private removeAds(){
        this.ads.forEach(element => {
            element.removeAdvertisement()
        });
    }

    private addTables(
        reference: Entity
    ){
        let tableCols = (this.floorLength <= 1) ? 2 : 4
        for(let i = 0; i < 2; i++) {
           for(let j = 0; j < tableCols; j++){
                let table = new Entity()
                table.addComponent(new Transform({
                    position: new Vector3( 3 - i * 8, -2.4, 4 - ( j * 8 )),
                }))
                table.addComponent(TABLE_MODEL)
                table.setParent(reference)
                this.tables.push(table)
            }
        }
    }

    private removeTables(){
        this.tables.forEach(element => {
            engine.removeEntity(element)
        });
    }

    private addTriggerBox(
        parent: Entity,
        boxSize: Vector3 = new Vector3(22, 5, 45), // edificios chicos 
        boxOffset: Vector3 = new Vector3(0, -1.1, -10)
    ){
        const box = new Entity()
        
        box.addComponent(new BoxShape())
        box.getComponent(BoxShape).withCollisions = false
        box.addComponent(new Transform({
            position: boxOffset,
            scale: boxSize
        }))
                
        if (this.floorLength > 1){
            box.getComponent(Transform).rotation.eulerAngles = new Vector3(0,90,0)
        }

        box.setParent(parent)
        box.addComponent(TRANSPARENT_MATERIAL)

        let triggerBox = new utils.TriggerBoxShape()
        triggerBox.size = boxSize
          box.addComponent(
            new utils.TriggerComponent(
                triggerBox,
                {
                    onCameraEnter : () => {
                        resfreshStreaming()
                        this.addPortals(this.level, this.portalModel, this.FLOOR_REF, this.BUILDING_INTERIOR_ENTITY, this.BUILDING_EXTERIOR_ENTITY)
                        this.addTables(this.FLOOR_REF)
                        this.addAdvs(this.advFrame, this.advContent, this.FLOOR_REF)
                        this.addScreens(this.screenFrame, this.screenContent, this.FLOOR_REF)

                        // get actual floor players
                        //floorHistory.push( {
                        //  'building' : this.building,
                        //  'level'    : this.level
                        //})
                        //log(floorHistory)

                        playerOnBuilding = this.building
                        playerOnFloor  = this.level
                        this.players++
                        //playersCounterBus.emit( "change" , {
                        //  building: this.building,
                        //  floor: this.level,
                        //  //players: this.players,
                        //  players: playersByFloor[this.building][this.level] + 1,
                        //  type: 'enter',
                        //});
                    },
                    
                    onCameraExit: () => {
                        this.removePortals()
                        this.removeTables()
                        this.removeAds()
                        this.removeScreens()
                        //lets = playersByFloor[this.building][this.level]-- 
                        playerOnBuilding = 'out'
                        playerOnFloor = 0

                        this.players--
                        //playersCounterBus.emit( "change", {
                        //  building: this.building,
                        //  floor: this.level,
                        //  //players: this.players,
                        //  //players: -1,
                        //  //players: playersByFloor[this.building][this.level] - 1,
                        //  type: 'exit',
                        //});

                    },
                    enableDebug: false    // show/hide trigger 
                }
               
            )
        )
        engine.addEntity(box)

    }
}

