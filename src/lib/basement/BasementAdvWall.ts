
/** ARENA DG AdvWall
 *  
 * 2022 Novaworks.
 */

import { Advertisement } from "../utils/Advertisement"

/** Creates and place de AdvWall */
export class BasementAdvWall {

    private ADV_WALL_REF: Entity
    private ADV_WALL_TRANSFORM: Transform
    public ads = []

    /**
    * @param {Vector3} position     - AdvWall center.
    * @param {Vector3} rotation     - AdvWall orientation.
    * @param {GLTFShape} advFrame   - AdvWall shape for framing Ads.
    * @param {Material} advContent  - AdvWall poster material.
    * @param {number} size          - AdvWall poster size.
    */
    constructor(
        private position: Vector3,
        private rotation: Vector3,
        private advFrame: GLTFShape,
        private advContent: Material,
        private modules: number
    ){
        this.ADV_WALL_REF = new Entity();
        this.ADV_WALL_REF.addComponent(new Transform({
            position: position,
        }))
        this.ADV_WALL_TRANSFORM = this.ADV_WALL_REF.getComponent(
            Transform
        )
        this.ADV_WALL_TRANSFORM.rotation.eulerAngles = rotation
        engine.addEntity(this.ADV_WALL_REF)

        this.addAds( advFrame, advContent, this.ADV_WALL_REF)

    }
    
    private addAds(
        advFrame: GLTFShape,
        advContent: Material,
        reference: Entity
    ){
        let counter = 0
        for(let i = 0; i < this.modules; i++) { 
            let module = 8 * i
            for(let j = 0; j < 4; j++) {
                this.ads.push(
                    new Advertisement(
                        new Vector3(0, 1.93, 0 + (1.5 * j) + module),
                        new Vector3(.1,.1,.1),
                        new Vector3(0, -90, 180),
                        advFrame,
                        advContent[counter],
                        reference,
                        0.5
                    )
                )
                counter++
            }
       }
    }

    public removeAds(){
        this.ads.forEach(element => {
            element.removeAdvertisement()
        });
    }
}