
/** ARENA DG AdvWall
 *  
 * 2022 Novaworks.
 */

import { Advertisement, AspectRatio } from "./Advertisement"


/** Creates and place de big screens */
export class AerialAdWall {

    private SCREEN_WALL_REF: Entity
    private SCREEN_WALL_TRANSFORM: Transform
    private SCREEN_SIZE = 1.35;

    /**
    * @param {Vector3} position         - ScreenWall center.
    * @param {Vector3} rotation         - ScreenWall orientation.
    * @param {number} screenSize        - ScreenWall  size.
    * @param {GLTFShape} screenFrame    - ScreenWall shape for framing content.
    * @param {Material} screenContent   - ScreenWall  material. // va a tener que ser un array de content
    * @param {number} screensX          - ScreenWall  amount columns.
    * @param {number} screensY          - ScreenWall  amount rows.
    */
    constructor(
        private position: Vector3,
        private rotation: Vector3,
        private screenFrame: GLTFShape,
        public screenContent: Material[],
        private screensX: number,
        private screensY: number,
    ){
        this.SCREEN_WALL_REF = new Entity();
        this.SCREEN_WALL_REF.addComponent(new Transform({
            position: position,
        }))
        this.SCREEN_WALL_TRANSFORM = this.SCREEN_WALL_REF.getComponent(
            Transform
        )
        this.SCREEN_WALL_TRANSFORM.rotation.eulerAngles = rotation
        engine.addEntity(this.SCREEN_WALL_REF)

        this.addScreens(this.screenFrame, this.screenContent, this.SCREEN_WALL_REF)
    }
    
    private addScreens(
        advFrame: GLTFShape,
        advContent: Material[],
        reference: Entity
    ){
        let gridSpacingOffset = 14 * this.SCREEN_SIZE;
        let counter = 0 
        for(let i = 0; i < this.screensX; i++) {
            for(let j = 0; j < this.screensY; j++) {
                let pos = new Vector3(i * gridSpacingOffset, j * gridSpacingOffset / 1.6, 0) 
                new Advertisement(
                    pos,
                    new Vector3(1, 1, 1),
                    new Vector3(0, 180, 0),
                    advFrame,
                    advContent[counter],
                    reference,
                    this.SCREEN_SIZE,
                    AspectRatio.horizontal
                );
                counter++
            }
        }      
    }
}