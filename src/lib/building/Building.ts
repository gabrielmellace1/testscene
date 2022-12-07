/** ARENA DG Building
 *  
 * 2022 Novaworks.
 */

import { Hall } from "./Hall"
import { Floor } from "./Floor"
import { placeBillboards } from "../utils/Billboard"
import { buildingTrigger } from "./triggers"

export class Building{
    private EXTERIOR : Entity
    private INTERIOR : Entity
    private HALL : Hall
    private TOWER_POSITION : Vector3
    private TOWER_ROTATION : Vector3
    public  floors: Floor[]

    constructor(
        private name : string,
        private POSITION : Vector3,
        private ROTATION : Vector3,
        private PORTAL_GLB : GLTFShape,
        private SCREEN_FRAME : GLTFShape,
        private FLOOR_SREEN_CONTET : Material,
        private ADV_FRAME : GLTFShape,
        private STREAM_CONTENT : Material,
        private DEF_MATERIAL : Material,
        private BUILDING_TRIGGER_POSITION : Vector3,
        private BUILDING_TRIGGER_SIZE : Vector3,
        private BUILDING_TRIGGER_ROTATION : Vector3,
        private BILLBOARD_Z_OFFSET : number,
        private FLOOR_LENGTH? : Number,
        private TRIGGER_SCALE? : Vector3,
        private TRIGGER_OFFSET? : Vector3,
    ){ 
        this.buiildBasement()
        this.loadBuildingModels()
        this.loadHall()
        this.setPositionAndRotation(this.POSITION, this.ROTATION)
        this.buildHall(this.PORTAL_GLB, this.SCREEN_FRAME, this.FLOOR_SREEN_CONTET, this.ADV_FRAME, this.DEF_MATERIAL) 
        this.builidFloors(this.PORTAL_GLB, this.SCREEN_FRAME, this.STREAM_CONTENT, this.ADV_FRAME, this.DEF_MATERIAL, this.FLOOR_LENGTH, this.TRIGGER_SCALE, this.TRIGGER_OFFSET)
        this.buildTriggers(this.BUILDING_TRIGGER_POSITION, this.BUILDING_TRIGGER_SIZE, this.BUILDING_TRIGGER_ROTATION)
        placeBillboards(this.HALL.ref, this.BILLBOARD_Z_OFFSET, this.name)
    }

    setPositionAndRotation(position, rotation){
        this.TOWER_POSITION = position
        this.TOWER_ROTATION = rotation
    }

    loadBuildingModels(){
        this.EXTERIOR = new Entity();
        this.EXTERIOR.addComponent( new GLTFShape("models/" + this.name + "-exterior.glb") );
        engine.addEntity(this.EXTERIOR);

        this.INTERIOR = new Entity();
        this.INTERIOR.addComponent( new GLTFShape("models/" + this.name + "-interior.glb"));
        engine.addEntity(this.INTERIOR)

        const LOGO_INTERIOR = new Entity();
        LOGO_INTERIOR.addComponent(new GLTFShape("models/" + this.name + "-floor-numbers.glb"));
        engine.addEntity(LOGO_INTERIOR);
    }

    buiildBasement(){
        const WATER_TOP = new Entity();
        WATER_TOP.addComponent(new GLTFShape("models/" + this.name + "-agua-top.glb"));
        engine.addEntity(WATER_TOP);

        const WATER_BOT = new Entity();
        WATER_BOT.addComponent(new GLTFShape("models/" + this.name + "-agua-bot.glb"));
        engine.addEntity(WATER_BOT);

        const NFT_SANTDS = new Entity();
        engine.addEntity(NFT_SANTDS);
        NFT_SANTDS.addComponent(new GLTFShape("models/" + this.name + "-nft-stands.glb"));
    }


    loadHall(){
        const HALL = new Entity();
        HALL.addComponent(new GLTFShape("models/" + this.name + "-hall.glb"));
        engine.addEntity(HALL);

        const HALL_ROTATING = new Entity();
        HALL_ROTATING.addComponent(new GLTFShape("models/" + this.name + "-rotating-welcome.glb"));
        engine.addEntity(HALL_ROTATING);
    }

    buildTriggers(boxPosition, boxSize, boxRotation){
        buildingTrigger(
            this.HALL.ref,
            this.INTERIOR,
            this.EXTERIOR, 
            boxPosition,
            boxSize,
            boxRotation,
            new Vector3(0, 27, 0),
        )
    }
    
    buildHall(portalGLB, screenFrame, screenContent, advFrame, defMaterial){
        this.HALL = new Hall(
            this.TOWER_POSITION,
            this.TOWER_ROTATION,
            portalGLB,
            screenFrame,
            screenContent,
            advFrame,
            defMaterial,
            this.INTERIOR,
            this.EXTERIOR,
            true
        )
    }

    builidFloors(portalGLB, screenFrame, screenContent, advFrame, defMaterial, floorLength, triggerScale?, triggerOffset?){
        for(let k = 0; k < 4; k ++){
            let floor = new Floor(
                k,
                new Vector3(
                    this.TOWER_POSITION.x, 
                    20.5 + (12.1 * k),
                    this.TOWER_POSITION.z 
                ),
                this.TOWER_ROTATION,
                portalGLB,
                screenFrame,
                screenContent,
                advFrame,
                defMaterial,
                this.INTERIOR,
                this.EXTERIOR,
                this.name,
                floorLength,
                true,
                triggerScale,
                triggerOffset
            )
        }
    }
}