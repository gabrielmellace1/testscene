/** ARENA DG Building Linin Alternator
 * 
 * Novaworks 2022
 */

import {
    TRANSPARENT_MATERIAL,
} from "lib/utils/sharedAssets"
import * as utils from '@dcl/ecs-scene-utils'

const DEBUG = false

export function buildingTrigger(
    parent: Entity,
    interiorLinin: Entity,
    exteriroLinin: Entity,  
    boxPosition : Vector3,
    boxSize : Vector3,
    boxRotation: Vector3,
    triggerOffset: Vector3,
){
    let box = new Entity()
    box.addComponent(new BoxShape())
    box.getComponent(BoxShape).withCollisions = false
    box.addComponent(new Transform({
        position: boxPosition,
        scale: boxSize
    }))
    box.getComponent(Transform).rotation.eulerAngles = boxRotation

    box.addComponent(TRANSPARENT_MATERIAL)
    //let material = new Material()
    //material.albedoColor = new Color4(0,1,0,0.8)
    //box.addComponent(material)

    let triggerBox = new utils.TriggerBoxShape()
    triggerBox.size = boxSize
    triggerBox.position = triggerOffset
    box.addComponent(
        new utils.TriggerComponent(
            triggerBox,
            {
                onCameraEnter : () => {
                    alternateLining(
                        operator.in,
                        interiorLinin,
                        exteriroLinin,
                    )
                },
                onCameraExit: () => {
                    alternateLining(
                        operator.out,
                        interiorLinin,
                        exteriroLinin,
                    )
                },
                //enableDebug: true // show/hide trigger 
            }
           
        )
    )
    box.setParent(parent)
    //engine.addEntity(box)
}

enum operator{
    off = 0,
    in =  1,
    out = 2
} 

function alternateLining(
    estado : operator, 
    interior : Entity,
    exterior : Entity
) {
    switch( estado ){
        case operator.off : {
            break;
        }
        
        case operator.out: {
            let interioAdded = exterior.isAddedToEngine;
            if( interioAdded ){
                if (DEBUG) { log('Remove Interiror') }
                engine.removeEntity(interior)
                engine.addEntity(exterior)
            }
            break
        }

        case operator.in: {
            let exteriorAdded = exterior.isAddedToEngine;
            if( exteriorAdded ){
                if (DEBUG) {  log('Remove Exterior') }
                engine.removeEntity(exterior)
                engine.addEntity(interior)
            }
            break
        }

        default: {
            if (DEBUG) { log('operator undefined execution') }
            break
        }
    }
}