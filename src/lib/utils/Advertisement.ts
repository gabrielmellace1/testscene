/** ARENA DG lib
 *  
 * 2022 Novaworks.
 */

export enum AspectRatio {
    horizontal, // 16:9 --> scale(12, -7, 1)
    vertical    // 9:16 --> scale(2.62, 4.62, 1)
}

/** Creates an Advertisement */
export class Advertisement {
    private advertisementFrame: Entity
    private advertisementContent = new Entity()

    // NO HACER ESTO:
    // private static readonly PLANE = new PlaneShape()

    /**
    * @param {Vector3} position         - Advertisement plasement.
    * @param {Vector3} scale            - Advertisement size.
    * @param {Vector3} rotation         - Advertisement orientation.
    * @param {GLTFShape} frame          - Advertisement shape for framing content.
    * @param {Material} content         - Advertisement poster material.
    * @param {Entity} parent            - Advertisement respective parent for positioning. 
    * @param {Number} size              - Advertisement size
    * @param {AspectRatio} AspectRatio  - Advertisement aspect ratio
    */
    constructor(
        private position: Vector3,
        private scale: Vector3 = new Vector3(1,1,1),
        private rotation: Vector3,
        private frame: GLTFShape,
        private content: Material,
        private parent?: Entity,
        private size: number = 1,      
        private aspectRatio = AspectRatio.vertical    
    ){
        if(this.aspectRatio == AspectRatio.horizontal) this.scale = new Vector3(12, -7, 1)
        if(this.aspectRatio == AspectRatio.vertical) this.scale = new Vector3(2.62, 4.62, 1)

        this.addFrame(position, rotation,scale, frame, parent)
        this.addContent(position, scale, rotation,
            // this.content,
            parent)
    }

    /** Creates Advertisement frame */
    private addFrame(
        position: Vector3,
        scale: Vector3,
        rotation: Vector3,
        frame: GLTFShape,
        parent?: Entity,
    ){
        this.advertisementFrame = new Entity();
        this.advertisementFrame.addComponent(new Transform({
          position: position,
          scale: new Vector3(1 * this.size, 1 * this.size, 1 * this.size),
        }))
        this.advertisementFrame.getComponent(Transform).rotation.eulerAngles = this.rotation//new Vector3(0,90,0)
        this.advertisementFrame.addComponent(frame)
        if (typeof parent !== 'undefined') {
            this.advertisementFrame.setParent(parent)
        } else {
            engine.addEntity(this.advertisementFrame)
        }
    }
    
    /** Adds Advertisement poster */
    private addContent(
        position: Vector3,
        scale: Vector3,
        rotation: Vector3,
        // content: Material,
        parent?: Entity,
    ){
        this.advertisementContent.addComponent(new Transform({
            position: position,
            scale: new Vector3(
                this.scale.x * this.size,
                this.scale.y * this.size,
                this.scale.z * this.size
            ),
        }))

        this.advertisementContent.getComponent(Transform).rotation.eulerAngles = rotation
        this.advertisementContent.addComponent(new PlaneShape())
        this.advertisementContent.addComponent(this.content)
        
        if (typeof parent !== 'undefined') {
            this.advertisementContent.setParent(parent)
        } else {
            engine.addEntity(this.advertisementContent)
        }
    }

    public removeAdvertisement(){
        engine.removeEntity(this.advertisementFrame)
        engine.removeEntity(this.advertisementContent)
    }
}