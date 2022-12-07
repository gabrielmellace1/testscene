/** ARENA DG lib
 *  
 * 2022 Novaworks.
 */

import { resfreshStreaming } from "lib/utils/sharedAssets";

//import { defaultMaterial } from "src/assets";

/** Creates a video screen*/
export class Screen {

    // TODO: Img falback
    // TODO: Complete final doc 

    private static DEFAULT_MATERIAL = new Material();
    private screenContent = new Entity;
    private screenFrame = new Entity;

    private playingDefault = false;
     

    /**
    * @param {Vector3} position - Screen plasement.
    * @param {Vector3} rotation - Screen orientation.
    * @param {GLTFShape} frame  - Screen Shape for framing content.
    * @param {Material} content  - Screen image material.exture 
    * @param {Entity}  [parent] Optional parent reference.
    * @param {Vector3} [scale] - Optional content size.
    */
    constructor(
        private position: Vector3,
        private rotation: Vector3,
        private frame: GLTFShape,
        private content: Material,
        private parent?: Entity,
        private size?: number ,
        private autoplay: boolean = false,
        private scale: Vector3 = new Vector3(8.29, 4.69, 1)
    ){
        Screen.DEFAULT_MATERIAL.albedoColor = new Color4(0,0,0,0.8)
        size = size ? size : 1 
        this.addFrame(
            position,
            new Vector3(1 * size, 1 * size, 1 * size),
            rotation,
            frame,
            parent
        )
        this.addContent(
            position,
            new Vector3(scale.x * size, scale.y * size, 1),// new Vector3(8.29, 4.69, 1)
            rotation,
            content,
            parent
        )
    }

    /** Creates screen frame */
    private addFrame(
        position: Vector3,
        scale: Vector3,
        rotation: Vector3,
        frame: GLTFShape,
        parent?: Entity,
    ){
        this.screenFrame = new Entity();
        this.screenFrame.addComponent(new Transform({
          position: position,
          scale: scale
        }))
        this.screenFrame.getComponent(Transform).rotation.eulerAngles = rotation
        this.screenFrame.addComponent(frame)
        if (typeof parent !== 'undefined') {
            this.screenFrame.setParent(parent)
        } else {
            engine.addEntity(this.screenFrame)
        }

    }
    
    /** Adds screen content */
    private addContent(
        position: Vector3,
        scale: Vector3,
        rotation: Vector3,
        content: Material,
        parent?: Entity,
    ){
        this.screenContent.addComponent(new Transform({
            position: position,
            scale: scale,
        }))

        this.screenContent.getComponent(Transform).rotation.eulerAngles = rotation

        let plane = new PlaneShape()
        this.screenContent.addComponent(plane)

        if(this.autoplay === true){
            this.showScreen()//.screenContent.addComponent(content);
        }
        else {
            //this.screenContent.addComponent(defaultMaterial)
            this.playingDefault = true;
            this.hideScreen()
        }

        // this.addPointerDownFuctionality()


        if (typeof parent !== 'undefined') {
            this.screenContent.setParent(parent)
        } else {
            engine.addEntity(this.screenContent)
        }
    }

    public removeScreen(){
        engine.removeEntity(this.screenContent)
        engine.removeEntity(this.screenFrame)
    }

    public showScreen(){  
        this.screenContent.addComponentOrReplace(this.content);
        let videoTexture = this.content.albedoTexture as VideoTexture
        if (typeof videoTexture !== 'undefined') {
            videoTexture.pause()
            videoTexture.play()
            //log('Reproduciendo en show')
        }
    }

    public hideScreen(){
        this.screenContent.addComponentOrReplace(Screen.DEFAULT_MATERIAL);
        let videoTexture = this.content.albedoTexture as VideoTexture
        if (typeof videoTexture !== 'undefined') {
            videoTexture.pause()
            videoTexture.play()
            //log('Reproduciendo en hide')
        }
    }

    public pauseScreen(){
        this.screenContent.addComponentOrReplace(Screen.DEFAULT_MATERIAL);
        let videoTexture = this.content.albedoTexture as VideoTexture
        if (typeof videoTexture !== 'undefined') {
            videoTexture.pause()
        }
    }

    public playScreen(){
        this.screenContent.addComponentOrReplace(this.content);
        let videoTexture = this.content.albedoTexture as VideoTexture
        if (typeof videoTexture !== 'undefined') {
            videoTexture.play()
        }
    }
    
    private addPointerDownFuctionality(){
        this.screenContent.addComponent(
            new OnPointerDown(() => {
                let videoTexture = this.content.albedoTexture as VideoTexture
                if(videoTexture.playing){
                    videoTexture.playing = false
                } else {
                    videoTexture.playing = true
                }
            })
        );
    }
}
