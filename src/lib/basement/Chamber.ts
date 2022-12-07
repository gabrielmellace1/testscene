/** ARENA DG Basement Chamber
 *  
 * 2022 Novaworks.
 */

import { Screen } from "utils/Screen"
import { TABLE_MODEL } from "lib/utils/sharedAssets"
import { Store } from "./Store";

/** Creates and place de Chamber */
export class Chamber {

    private MODULE_REF: Entity
    public chamberScreen : Screen
    public tables = []

    /**
    * @param {Vector3} position      - Chamber center.
    * @param {Quaternion} rotation   - Chamber orientation.
    * @param {GLTFShape} screeFrame  - Chamber shape for framing content.
    * @param {Material} screeContent - Chamber poster material.
    */

    constructor(
        private position: Vector3,
        private rotation: Quaternion,
        private screenFrame: GLTFShape,
        private screenContent: Material,
    ){
        this.MODULE_REF = new Entity();
        this.MODULE_REF.addComponent(new Transform({
            position: position,
            rotation: rotation
        }))
        engine.addEntity(this.MODULE_REF)

        this.addScreen(screenFrame, screenContent, this.MODULE_REF)
        this.addTables(this.MODULE_REF)
        this.addNFTStores()
    }
    

    private addScreen(
        screenFrame: GLTFShape,
        screenContent: Material,
        reference: Entity,
    ){
        this.chamberScreen = new Screen(
            new Vector3(0, 0, 0),
            new Vector3(0, 0, 0),
            screenFrame,
            screenContent, 
            reference,
            1,
            true,
        );
        
    }

    public removeScreen(){
        this.chamberScreen.removeScreen()
    }
   
    public addTables(
        reference: Entity
    ){
      const basamentTable0 = new Entity()
      basamentTable0.addComponent(new Transform({position: new Vector3(-0.8,-3.13,4)}))
      basamentTable0.addComponent(TABLE_MODEL)
      basamentTable0.setParent(reference)
      this.tables.push(basamentTable0)
      
      const basamentTable1 = new Entity()
      basamentTable1.addComponent(new Transform({position: new Vector3(7.2,-3.13,4)}))
      basamentTable1.addComponent(TABLE_MODEL)
      basamentTable1.setParent(reference)
      this.tables.push(basamentTable1)
      
      const basamentTable2 = new Entity()
      basamentTable2.addComponent(new Transform({position: new Vector3(-8.8,-3.13,4)}))
      basamentTable2.addComponent(TABLE_MODEL)
      basamentTable2.setParent(reference)
      this.tables.push(basamentTable2)
      
      const basamentTable3 = new Entity()
      basamentTable3.addComponent(new Transform({position: new Vector3(3.2,-3.13,12)}))
      basamentTable3.addComponent(TABLE_MODEL)
      basamentTable3.setParent(reference)
      this.tables.push(basamentTable3)
      
      const basamentTable4 = new Entity()
      basamentTable4.addComponent(new Transform({position: new Vector3(-4.8,-3.13,12)}))
      basamentTable4.addComponent(TABLE_MODEL)
      basamentTable4.setParent(reference)
      this.tables.push(basamentTable4)
   }

   public removeTables(){
        this.tables.forEach(element => {
            engine.removeEntity(element)
        });
   }

   public removeChamber(){
       this.removeScreen()
       this.removeTables()
   }

   private addNFTStores(){

        let nftY = 1.8;
    //nfts store twitch and theta buildings 
        let positionsTwitchAndTheta:Array<Vector3> = [
            //1 a 10 
            new Vector3(27.05,0,-11.31),
            new Vector3(20.63,0,-11.07),
            new Vector3(17.82,0,-11.07),
            new Vector3(11.08,0,-11.31),
            new Vector3(5.42,0,-11.07),
            new Vector3(2.61,0,-11.07),
            new Vector3(-2.84,0,-11.31),
            new Vector3(-9.18,0,-11.07),
            new Vector3(-12,0,-11.07),
            new Vector3(-17,0,-11.31),
            //11-15
            new Vector3(-20.15,0,-6.93),
            new Vector3(-20.15,0,-4.11),
            new Vector3(-20.39,0,0.18),
            new Vector3(-20.15,0,4.50),
            new Vector3(-20.15,0,7.31),
            //16-23
            new Vector3(-16.65,0,11.44),
            new Vector3(-11.99,0,11.20),
            new Vector3(-9.16,0,11.20),
            new Vector3(-3.54,0,11.44),
            new Vector3(1.73,0,11.20),
            new Vector3(4.54,0,11.20),
            new Vector3(10,0,11.20),
            //23-24
            new Vector3(10.72,0,-1.40),
            new Vector3(10.72,0,1.40),
            //25-26
            new Vector3(0,0,-1.40),
            new Vector3(0,0,1.40),
            //27-28
            new Vector3(-10.22,0,-1.40),
            new Vector3(-10.22,0,1.40)
          
        ]
        let twitchStore = new Store(positionsTwitchAndTheta,new Vector3(41.95,nftY,81.7),new Vector3(0,180,0))
        let thetaStore = new Store(positionsTwitchAndTheta,new Vector3(86.1,nftY,14.4),new Vector3(0,0,0))
      
    //nfts store oec1 and oec2 buildings 
    let positionsOec:Array<Vector3> = [
        //1-7
        new Vector3(11.72,0,16.78),
        new Vector3(11.48,0,10.78),
        new Vector3(11.48,0,7.95),
        new Vector3(11.72,0,2.39),
        new Vector3(11.48,0,-3.15),
        new Vector3(11.48,0,-5.98),
        new Vector3(11.72,0,-11.02),
        //8-13
        new Vector3(7.94,0,-15.03),
        new Vector3(5.11,0,-15.03),
        new Vector3(0.44,0,-15.03),
        new Vector3(-4.53,0,-15.03),
        new Vector3(-7.36,0,-15.03),
        //14-18
        new Vector3(-11.42,0,-11.44),
        new Vector3(-11.30,0,-6.60),     
        new Vector3(-11.30,0,-3.77),
        new Vector3(-11.42,0,1.05),
        //19-20
        new Vector3(1.41,0,5.42),
        new Vector3(-1.41,0,5.42),
        //21-22
        new Vector3(1.41,0,-5.42),
        new Vector3(-1.41,0,-5.42),       
        ]
        let oec1Store = new Store(positionsOec,new Vector3(14.45,nftY,31.18),new Vector3(0,180,0))
        let oec2Store = new Store(positionsOec,new Vector3(113.4,nftY,64.74),new Vector3(0,0,0))
   }
}