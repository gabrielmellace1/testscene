/** ARENA DG lib
 *  
 * 2022 Novaworks.
 */

import * as ecsUtils from "@dcl/ecs-scene-utils";

export class AnimatedCircle implements ISystem {

    private TIMER : number = 0.0
    private POS_TIMER : number = 0.0
    private SCALE_TIMER : number = 0.0
    private INITIAL_DELAY : number = 1000
    private CIRCLE_TRANSFORM: Transform

    constructor(
        private InitialPos : Vector3,
        private POS_FREQUENCY: number,
        private Y_POS_ANIM_LIMITS: Vector2,
        private CENTER_Y_POS : number,
        private SCALE_FREQUENCY: number,
        private SCALE_ANIM_LIMITS: Vector2,
        private startDelay : number,
        private shouldStarExpanded? : boolean){
        
        const Planito_C = new Entity();
        Planito_C.addComponent(new GLTFShape("models/animated-circle.glb"));
        this.CIRCLE_TRANSFORM = (new Transform({ position: InitialPos, scale: new Vector3(1,1,1) }))
        Planito_C.addComponent(this.CIRCLE_TRANSFORM)
        engine.addEntity(Planito_C);

        this.INITIAL_DELAY = startDelay
        this.TIMER = shouldStarExpanded ? Math.PI * .5 : Math.PI * 1.5
        this.POS_TIMER = this.TIMER
        this.SCALE_TIMER = this.TIMER
        this.AddSystemWithDelay()
    }
    
    update(dt: number) {

        //Update Timers
        this.TIMER += dt
        this.POS_TIMER += dt
        this.SCALE_TIMER += dt 
        
        let scaleT =  ((Math.sin(this.SCALE_TIMER * this.SCALE_FREQUENCY) + 1)/2)// From 0 To 1
        let sinScale =  this.Lerp(this.SCALE_ANIM_LIMITS.x ,this.SCALE_ANIM_LIMITS.y, scaleT)
        this.CIRCLE_TRANSFORM.scale = new Vector3(sinScale, sinScale, sinScale)

        let posT =  ((Math.sin(this.POS_TIMER) + 1)/2)// From 0 To 1
        if(posT > 0.95)
        {
            this.TIMER = this.shouldStarExpanded ? Math.PI * .5 : Math.PI * 1.5
            this.POS_TIMER = this.TIMER
            this.SCALE_TIMER = this.TIMER
        } 
        let sinYPos = this.Lerp(this.Y_POS_ANIM_LIMITS.x ,this.Y_POS_ANIM_LIMITS.y, posT) + this.CENTER_Y_POS
        this.CIRCLE_TRANSFORM.position = new Vector3(this.InitialPos.x, sinYPos, this.InitialPos.z) 
    }

    private Lerp(a: number, b: number,t: number): number
    {
        return a * (1 - t) + b * t
    }

    AddSystemWithDelay = async () => {
        await this.delay(this.INITIAL_DELAY)
        engine.addSystem(this)
    };

    delay = (ms: number): Promise<void> => {
        return new Promise((resolve) => {
          const ent = new Entity();
          engine.addEntity(ent);
          ent.addComponent(
            new ecsUtils.Delay(ms, () => {
              resolve();
              engine.removeEntity(ent);
            })
          );
        });
    };
}

export function initAnimatedCircle(){
    var firstPortalDelay = 0
    var incrementalDelay = 400
    for(let i = 0; i < 4; i++)
    {
        //Go Up
        new AnimatedCircle(
            new Vector3(64.25, 6.25, 48),
            1,
            new Vector2(0,3),
            3,
            1,
            new Vector2(0.2,1.1),
            firstPortalDelay + incrementalDelay * i,
            false
        )

        //Go Down
        new AnimatedCircle(
            new Vector3(64.25, 6.25, 48),
            1,
            new Vector2(0,-3),
            3,
            1,
            new Vector2(0.2,1.25),
            firstPortalDelay + incrementalDelay * i,
            false
        )
    }
}
