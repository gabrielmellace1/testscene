import { PathData } from "./PathData"
import { TRANSPARENT_MATERIAL } from "lib/utils/sharedAssets"
//import { TransformSystem } from "@dcl/ecs-scene-utils"


/** Character Node for Words Chain  */
export class CharNode{
    public order : number = 0
    private static COUNT = 0 
    public next : CharNode = null
    public entity = new Entity()
    public position : Vector3 = new Vector3(1,1,1)
    public transform: Transform
    public DEBUG = false
    public path : PathData
    //public slerpData: SlerpData

    constructor(
        public letter: string,
        public initRotation
    ){
        this.order = CharNode.COUNT
        CharNode.COUNT++
    }

    public isLast(){
        if(!this.next){
            return true
        }
    }

    public place(
      position: Vector3
    ){
        this.position = position
        this.entity.addComponent(new BoxShape)
        this.entity.addComponent(
            new Transform({ position: position })
        )
        this.transform = this.entity.getComponent(Transform)
        this.entity.addComponent(TRANSPARENT_MATERIAL)
        if(this.DEBUG){
            let material = new Material
            material.albedoColor = new Color4(1, 1, 1,0.8)
            this.entity.addComponent(material)
            material.albedoColor = new Color4(1 - (0.1 * this.order), 0.1 * this.order,  0.8, 0.8)
        }
        /** Letter */

        let textShapeEntity = new Entity()
        let textShape = new TextShape(this.letter)
        textShape.fontSize = 37
        // textShape.outlineWidth = 0.1
        // textShape.outlineColor = Color3.Black()
        textShape.color = Color3.White()
        textShape.shadowColor = Color3.Black()
        textShape.shadowOffsetX = 50
        textShape.shadowOffsetY = -50
        textShape.font = new Font(Fonts.SansSerif_Heavy)
        textShapeEntity.addComponent(textShape)
        textShapeEntity.setParent(this.entity)
        textShapeEntity.addComponent(new Transform({
            position: new Vector3(-1, 0, 0),
            rotation : Quaternion.Euler(0, this.initRotation ,0),
        }))

        engine.addEntity(this.entity)
    }

    public move(fraction:number, step: number){
        this.transform.position = Vector3.Lerp(
           this.transform.position,
           new Vector3(
             this.transform.position.x,
             this.transform.position.y,
             this.transform.position.z + step,
           ),
           fraction
        )
    }

    public follow( fraction : number ){
        this.transform.position = Vector3.Lerp(
           this.transform.position, this.next.transform.position, fraction
        )
    }

    /** Imitate rotatation */
    public rotar(fraction:number){
        let originalRot = this.entity.getComponent(Transform).rotation.eulerAngles
        // target deberia ser tail?
        let targetRot = this.next.entity.getComponent(Transform).rotation.eulerAngles

        let slerpRot = Quaternion.Slerp(
          Quaternion.Euler(originalRot.x,originalRot.y,originalRot.z),
          Quaternion.Euler(targetRot.x,targetRot.y,targetRot.z), 
          fraction
        )
        this.transform.rotation = slerpRot
        //fraction += dt / 5
    }


}