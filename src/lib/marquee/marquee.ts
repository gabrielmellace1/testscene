import { PathData } from "./PathData"
// https://docs.decentraland.org/development-guide/utils/#action-sequence
import { Chain } from "./Chain"

const defaultMarqueeText : string = "Conference"

export class Marquee {
  // https://www.npmjs.com/package/decentraland-ecs-utils#iaction
  public boxPath: any
  public boxPathB: any
  public corners: Vector3[] = []
  public chain : Chain
  public chainB: Chain

  /**
   * 
   * @param input 
   * @param position 
   * @param scale 
   * @param showDebugEntity 
   */
  
  constructor(
    private input: string,
    private position: Vector3,
    private scale: Vector3,
    private showDebugEntity: boolean = false
  ){
    this.setPath()
    this.initChain()
    this.debugEntity()
  }

  private debugEntity(){
    if(this.showDebugEntity){
      let debugEntity = new Entity()
      debugEntity.addComponent(new BoxShape)
      let material = new Material
      material.albedoColor = new Color4(1, 0, 0, 0.8)
      debugEntity.addComponent(material)
      debugEntity.addComponent(new Transform({
        position: this.position,
        scale: this.scale
      }))
      engine.addEntity(debugEntity)
    }
  }

  private setPath(){ 
    this.corners.push(new Vector3(this.position.x - this.scale.x/2, this.position.y, this.position.z - this.scale.z/2))
    this.corners.push(new Vector3(this.position.x - this.scale.x/2, this.position.y, this.position.z + this.scale.z/2))
    this.corners.push(new Vector3(this.position.x + this.scale.x/2, this.position.y, this.position.z + this.scale.z/2))
    this.corners.push(new Vector3(this.position.x + this.scale.x/2, this.position.y, this.position.z - this.scale.z/2))
  
    this.boxPath = new Path3D([
      this.corners[0],
      this.corners[1],
      this.corners[2],
      this.corners[3]
    ])
    this.boxPathB = new Path3D([
      this.corners[2],
      this.corners[3],
      this.corners[0],
      this.corners[1]
    ])
  }

  public initChain(){
    if (!this.input){
      this.input = defaultMarqueeText
    }
    this.input = this.input.toUpperCase()
    let splittedInput = this.input.split('').reverse()
    //this.chain = new Chain( this.boxPath, true, 'A',  )
    // this.chainB = new Chain( this.boxPath, true, 'B' )
    this.chain = new Chain( this.boxPath, true, 90  )
    this.chainB = new Chain( this.boxPathB, true, 270 )
    for( let i = 0 ; i < this.input.length ; i++ ){
      this.chain.add(splittedInput[i])
      this.chainB.add(splittedInput[i])
    }

    this.chain.place(this.boxPath.path[0])
    this.chainB.place(this.boxPath.path[2]) // otra esquina
  
    // this.chain.logChain()
    // this.chainB.logChain()

    engine.addSystem(this.chain)
    engine.addSystem(this.chainB)
  }


}