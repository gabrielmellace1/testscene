/** ARENA DG Portal 
 *  
 * 2022 Novaworks.
 */

import { movePlayerTo } from '@decentraland/RestrictedActions'
import { TRANSPARENT_MATERIAL, PORTAL_MASK_SHAPE_CIRCLE, PORTAL_MASK_SHAPE_DEFAULT} from "lib/utils/sharedAssets"

export enum PortalOperationType
{
    Nothing = 0,
    EnterBuilding = 1,
    ExitBuilding = 2
} 

/** Floor connection Teleport. */
export class Portal implements ISystem {
    private PORTAL_ENTITY : Entity
    private PORTALEXECUTIONTYPE : PortalOperationType
    private BUILDING_INTERIOR_ENTITY : Entity
    private BUILDING_EXTERIOR_ENTITY : Entity
    private PORTAL_TRANSFORM : Transform
    private TIMER : number = 0.0
    private FREQUENCY : number = 1.0
    private AMPLITUDE : number = 0.25

    /**
    * @param {Vector3} position - Portal plasement.
    * @param {Vector3} scale    - Portal size.
    * @param {Vector3} rotation - Portal rotation.
    * @param {Vector3} target   - Portal target.
    * @param {GLTFShape} model  - Portal model.
    * @param {GLTFShape} number - Portal floor target number.
    * @param {string} text      - Teleport hover text.
    */
    constructor(
        private position: Vector3,
        private scale: Vector3,
        private rotation: Vector3,
        private target: Vector3,
        private model: GLTFShape,
        //private number: GLTFShape | undefined,
        private number: GLTFShape,
        private text: string,
        private parent?: Entity,
        private shouldUpdate?: boolean,
        private shouldStarUp? : boolean
    ){
        this.addPortal()
        if(shouldUpdate)
        {
            this.TIMER = shouldStarUp ? 0.0 : Math.PI
            engine.addSystem(this)
        }
    }
    
    update(dt: number) {
        this.TIMER += dt
        let newPos = this.position.y + this.AMPLITUDE * Math.sin(this.TIMER * this.FREQUENCY)
        this.PORTAL_TRANSFORM.position = new Vector3(this.position.x, newPos, this.position.z)
        //log("Sin: " + Math.sin(this.TIMER))
    }

    public AddPortalOperationType(
        PORTALEXECUTIONTYPE : PortalOperationType,
        BUILDING_INTERIOR_ENTITY : Entity,
        BUILDING_EXTERIOR_ENTITY : Entity
    ){
        this.PORTALEXECUTIONTYPE = PORTALEXECUTIONTYPE
        this.BUILDING_INTERIOR_ENTITY = BUILDING_INTERIOR_ENTITY
        this.BUILDING_EXTERIOR_ENTITY = BUILDING_EXTERIOR_ENTITY
    }

    
    /**
     * Creates a Teleport element
     */
    private addPortal(){
        this.PORTAL_ENTITY = new Entity()
        this.PORTAL_TRANSFORM = new Transform({
            position: this.position,
            scale: this.scale
        })

        //Add transform
        this.PORTAL_ENTITY.addComponent(
            this.PORTAL_TRANSFORM
        )

        //Rotate Object
        this.PORTAL_ENTITY.getComponent(
            Transform
        ).rotation.eulerAngles = this.rotation

        //Add Model
        if (typeof this.model !== 'undefined') {
        this.PORTAL_ENTITY.addComponent(this.model)
        }

        //Kinship
        if (typeof this.parent !== 'undefined') {
            this.PORTAL_ENTITY.setParent(this.parent)
        } else {
            engine.addEntity(this.PORTAL_ENTITY)
        }

        //Number Denotation
        if(this.number){
            this.addNumber(this.number, this.PORTAL_ENTITY)
        }

        this.addMask(
            this.position,
            new Vector3(1.3, 1.3, 1.3),
            this.rotation,
            this.target,
            new Vector3(90, 0, 90),
            this.text
        )
    }

    public removePortal(){
        engine.removeEntity(this.PORTAL_ENTITY)
    }
    
    /** 
     * Adds portal numer above
     */
    private addNumber(
        number : GLTFShape,
        parentEntity: Entity
    ){
        let portalNumber = new Entity()
        portalNumber.addComponent(
            new Transform({
                position: new Vector3(0, 0, 0),
                scale: new Vector3(1,1,1)
            })
        )
        portalNumber.getComponent(Transform).rotation.eulerAngles = new Vector3(
            0, - 90, 0
        )
        portalNumber.addComponent(number)
        portalNumber.setParent(parentEntity)
    }
    
    /** 
     * Adds an invisible shape bigger than the model,
     * whith the teleport functionality,
     * for better pointer hover.
     */
    private addMask(
        position: Vector3,
        scale: Vector3,
        rotation: Vector3,
        teleportTarget: Vector3, 
        cameraOrientation: Vector3,
        text : string
    ){
        let portalMask = new Entity();
        portalMask.addComponent(PORTAL_MASK_SHAPE_DEFAULT)
        portalMask.addComponent(TRANSPARENT_MATERIAL)
        portalMask.addComponent(new Transform({
            position: new Vector3(0, 0, .5),
            scale: scale
        }))

        portalMask.getComponent(Transform).rotation.eulerAngles = rotation
        // Add Teleport functionality
        // let  portalTransform  = this.PORTAL_ENTITY.getComponent(Transform)
        portalMask.addComponent(
            new OnPointerDown(
                (e) => {
                    movePlayerTo(
                        teleportTarget,
                        cameraOrientation
                    )
                    this.executePortalOperation()
                },
                { hoverText: text }
            )
        )
        portalMask.setParent(this.PORTAL_ENTITY)
    }

    private executePortalOperation()
    {
        switch(this.PORTALEXECUTIONTYPE)
        {
            case PortalOperationType.Nothing : 
            {
                break;
            }
            
            case PortalOperationType.ExitBuilding : 
            {
                let addedToEngine = this.BUILDING_EXTERIOR_ENTITY.isAddedToEngine;
                if(!!addedToEngine)
                {
                    // log('ExitBuilding')
                    engine.removeEntity(this.BUILDING_INTERIOR_ENTITY)
                    engine.addEntity(this.BUILDING_EXTERIOR_ENTITY)
                }
                break
            }

            case PortalOperationType.EnterBuilding :
            {
                let addedToEngine = this.BUILDING_INTERIOR_ENTITY.isAddedToEngine;
                if(addedToEngine)
                {
                    // log('EnterBuilding')
                    engine.removeEntity(this.BUILDING_EXTERIOR_ENTITY)
                    engine.addEntity(this.BUILDING_INTERIOR_ENTITY)
                }
                break
            }

            default: 
            {
                log('PORTALEXECUTIONTYPE undefined execution')
                break
            }
        }
    }
}