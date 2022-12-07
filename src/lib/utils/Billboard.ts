/** ARENA DG Players Billboard
 *  
 * 2022 Novaworks.
 */

import { playersCounterBus, playersByFloor } from "./playersCounter"
import { movePlayerTo } from '@decentraland/RestrictedActions'
import { BILLBOARD_OKEX, BILLBOARD_THETA, BILLBOARD_TWITCH, TRANSPARENT_MATERIAL } from "lib/utils/sharedAssets"

let targetTransform = {
    'okex1':  [],
    'okex2':  [],
    'theta':  [],
    'twitch': [],
}

let numberInstances = {
    'okex1': [],
    'okex2': [],
    'theta': [],
    'twitch': [],
}

/** Prints quantity number in a bilboard*/
export class FloorPlayersQuantity {    
    public floor: number
    public players: number
    public parent: Entity
    public textEntity = new Entity()
    public textShape = new TextShape()
    public color: string

    /**
    * @param {number} floor     - Floor number in building
    * @param {number} players   - Amount of players by floor
    * @param {Entity} parent    - Billboard entity where the floors will be printed 
    */
    constructor(
        floor: number,
        players: number,
        parent: Entity,
        color: string,
        public parentName : string
    ){
        this.floor = floor
        this.players = players
        this.parent = parent
        this.color = color
        this.initTextEntity()
        this.printNumber(0);

        playersCounterBus.on("change",
        (v) => {
            if(v.building == this.parentName){
                if(v.floor == this.floor){
                    this.textShape.value = v.players.toString()
                }
            }
        }
     );
    }

    public initTextEntity(){
        this.textEntity.addComponent(new Transform({
            position: new Vector3(-0.01, 0.037 - (this.floor * 0.22), 0.02),
            rotation: Quaternion.Euler(0, 90, 0)
        }))
        this.textEntity.setParent(this.parent)
        this.textShape.fontSize = 1;
        this.textShape.color = Color3.FromHexString(this.color)
        this.textEntity.addComponent(this.textShape)
    }

    public printNumber(number){
        //log(number)
        this.textShape.value = number.toString()
    }
}

/** Create billboard in relation with a parent model*/
export class Billboard{
    public buildingName: string
    public model: GLTFShape
    public position: Vector3
    public parent: Entity
    public color: string

    public billboardModel = new Entity();

    /**
     * @param {string} buildingName - Name of the building  
     * @param {GLTFShape}  model    - GLTF Model reference 
     * @param {Vector3} position    - Respective position to parent building
     * @param {Entity} parent       - Building parent entity
     */
    constructor(
        buildingName: string,
        model: GLTFShape,
        position: Vector3,
        parent: Entity,
        color: string
    ){
        this.buildingName = buildingName
        this.model = model
        this.position = position
        this.parent = parent
        this.color = color

        this.placeBillboard()
        this.placeBillboardNumbers()
        this.placeJumpInTriggers()
    }

    private placeBillboard(){
        this.billboardModel.addComponent(this.model)
        this.billboardModel.addComponent(new Transform({
            position: this.position,
            rotation: Quaternion.Euler(0, 90, 0)
        }))

        this.billboardModel.setParent(this.parent)
        engine.addEntity(this.billboardModel)
    }

    private placeBillboardNumbers(){
        for (let i = 0 ; i < 4 ; i ++){
            numberInstances[this.buildingName].push(
                new FloorPlayersQuantity(i, playersByFloor[this.buildingName][i], this.billboardModel, this.color, this.buildingName)
            )
        }
    }
    
    private placeJumpInTriggers(){
        for(let i = 0 ; i < 4 ; i ++){
            const trigger = new Entity()
            trigger.addComponent(new BoxShape())
            trigger.setParent(this.billboardModel)
            trigger.addComponent(new Transform({
                position: new Vector3(0, 0.04 - i * 0.22, -0.53),
                scale: new Vector3(0.1, 0.15, 0.5)
            }))
            trigger.addComponent(TRANSPARENT_MATERIAL)
            
            trigger.addComponent(
                new OnPointerDown((e) => {
                    let parent = targetTransform[this.buildingName][0].position
                    movePlayerTo(
                        { x: parent.x,
                          y: parent.y + 24 + (i * 12),
                          z: parent.z },
                        { x: 8, y: 1, z: 8 }
                    )
                })
              )
        }
    }
}

export let boards= {
   // 'okex1': any,
   // 'okex2': any,
   // 'theta': any,
   // 'twitch':any,
}
export function placeBillboards(parent: Entity, zOffset: number, building: string){
    targetTransform[building].push(parent.getComponent(Transform))
    
    boards['twitch'] = new Billboard('twitch', BILLBOARD_TWITCH, new Vector3(-7.9, 1.5, 12 - zOffset), parent, '#D74DEB')
    boards['okex1'] = new Billboard('okex1',  BILLBOARD_OKEX,   new Vector3(-9.8, 1.5, 12 - zOffset), parent, '#1F72E3')
    boards['okex2'] = new Billboard('okex2',  BILLBOARD_OKEX,   new Vector3(-7.9, 3.4, 12 - zOffset), parent, '#1F72E3')
    boards['theta'] = new Billboard('theta',  BILLBOARD_THETA,  new Vector3(-9.8, 3.4, 12 - zOffset), parent, '#5ECAC1')
}