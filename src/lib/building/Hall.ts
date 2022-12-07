/** ARENA DG Hall
 *  
 * 2022 Novaworks.
 */

import * as utils from '@dcl/ecs-scene-utils'
import { Portal, PortalOperationType } from "./Portal"
import { Screen } from "utils/Screen"
import { Advertisement } from "../utils/Advertisement"
import { PORTAL_NUMBERS_WHITE, TRANSPARENT_MATERIAL} from "lib/utils/sharedAssets"

/** Creates and place de Hall */
export class Hall {

    private static readonly HEIGHT_HALL = 10
    private static readonly HEIGHT_FLOOR = 11.1
    private HALL_REF: Entity
    private HALL_TRANSFORM: Transform

    /**
    * @param {Vector3} position     - Hall center.
    * @param {Vector3} rotation     - Hall orientation.
    * @param {GLTFShape} screeFrame - Hall shape for framing content.
    * @param {Material} screeContent - Hall poster material.
    * @param {GLTFShape} advFrame   - Hall shape for framing Ads.
    * @param {Texture} advContent   - Hall poster material.
    */
    constructor(
        private position: Vector3,
        private rotation: Vector3,
        private portalModel: GLTFShape,
        private screenFrame: GLTFShape,
        private screenContent:Material,
        private advFrame: GLTFShape,
        private advContent: Material,
        private interior_building : Entity,
        private exterior_building : Entity,
        private shouldUpdate?: boolean
    ){
        this.HALL_REF = new Entity();
        this.HALL_REF.addComponent(new Transform({
            position: position,
        }))
        this.HALL_TRANSFORM = this.HALL_REF.getComponent(
            Transform
        )
        this.HALL_TRANSFORM.rotation.eulerAngles = rotation
        engine.addEntity(this.HALL_REF)
        this.addScreens(screenFrame, screenContent, this.HALL_REF)
        this.addAdvs(advFrame, advContent, this.HALL_REF)
        this.addPortals(portalModel, this.HALL_REF, interior_building, exterior_building)
    }
    get ref() {
        return this.HALL_REF;
    }
    private addPortals(
        portalModel: GLTFShape,
        reference: Entity,
        interior_building : Entity,
        exterior_building : Entity,
    ){
        for(let i = 0; i < 4; i++){
            let targetFloor = i + 1
            let hoverText = "GO TO LEVEL: " + targetFloor.toString()
            let targetY = Hall.HEIGHT_FLOOR + 12.1 *  targetFloor
            let portalHall = new Portal(
                new Vector3(
                    0 + 6 - (4 * i),
                    0 + Hall.HEIGHT_HALL - 0.75,
                    0 - 8,
                ),
                new Vector3(1.3, 1.3, .75),
                new Vector3(0, 0, 0),
                new Vector3(
                    this.HALL_TRANSFORM.position.x,
                    this.HALL_TRANSFORM.position.y + targetY,
                    this.HALL_TRANSFORM.position.z
                ),
                portalModel,
                PORTAL_NUMBERS_WHITE[targetFloor],
                hoverText,
                reference,
                this.shouldUpdate,
                i % 2 == 0? true : false
            );
            portalHall.AddPortalOperationType(
              PortalOperationType.EnterBuilding,
              interior_building,
              exterior_building
            )
        }
    }

    private addScreens(
        screenFrame: GLTFShape,
        screenContent:Material,
        reference?: Entity,
    ){
        let screenHall = new Screen(
            new Vector3(0, 0.25 + Hall.HEIGHT_HALL, 9.8),
            new Vector3(1, 1, 1),
            screenFrame,
            screenContent, 
            reference,
            1,
            false
        );

        let triggerSizeHall = new Vector3(27, 4, 27)
        let boxTriggerHall = new Entity()
        boxTriggerHall.addComponent(TRANSPARENT_MATERIAL)
        boxTriggerHall.addComponent(new BoxShape()).withCollisions = false
        boxTriggerHall.addComponent(new Transform({
            position: new Vector3(this.HALL_TRANSFORM.position.x, this.HALL_TRANSFORM.position.y + 10, this.HALL_TRANSFORM.position.z),
            scale: triggerSizeHall
        }))

        let HallTriggerBox = new utils.TriggerBoxShape(triggerSizeHall)
        boxTriggerHall.addComponent(
        new utils.TriggerComponent(
            HallTriggerBox,
            {
                onCameraEnter : () => {
                    screenHall.playScreen()
                    // engine.addEntity(this.interior_building)
                },
                onCameraExit : () => {
                    screenHall.pauseScreen()
                    // engine.removeEntity(this.interior_building)
                }
            }
        )
        )
        engine.addEntity(boxTriggerHall)
    }

    private addAdvs(
        advFrame: GLTFShape,
        advContent: Material,
        reference: Entity
    ){
        let advHall1 = new Advertisement(
            new Vector3(-8.5, 0.25 + Hall.HEIGHT_HALL, -5),
            new Vector3(0,0,0),
            new Vector3(0, -90, 180),
            advFrame,
            advContent,
            reference,
        );
        
        let advHall2 = new Advertisement(
            new Vector3(-8.5, 0.25 + Hall.HEIGHT_HALL, 5),
            new Vector3(2.7, 4.62, 1),
            new Vector3(0, -90, 180),
            advFrame,
            advContent,
            reference
        );
    }
}