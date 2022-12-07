
/** ARENA DG NTFs Store
 *  
 * 2022 Novaworks.
 */

import { clamp } from "@dcl/ecs-scene-utils"

/** Creates and place de Store */
export class Store {
    private NFT_CONTAINERS : Entity[]

    /**
    * @param {Array<Entity>} nftPositions   - Store nftPositions.
    * @param {Vector3} position     - Store center.
    * @param {Vector3} rotation     - Store orientation.
    */
    constructor(
        private nftPositions: Array<Vector3>,
        private position: Vector3,
        private rotation: Vector3
    ){
        this.addNFTs(
            this.nftPositions,
            this.position,
            this.rotation
        )
    }   
    
    /** This method creates a parent entity to add child entities for each position in the array.
     * 
     * @param positions - positions 
     * @param centerPosition - center position of store
     * @param centerRotation - rotation of store
     */
    private addNFTs(
        positions:Array<Vector3>, 
        centerPosition:Vector3,
        centerRotation:Vector3
    ){
        let center  = new Entity()
        center.addComponent(new Transform({position:centerPosition}))
        center.getComponent(Transform).rotation.eulerAngles = centerRotation  
        engine.addEntity(center)

        this.NFT_CONTAINERS = new Array(positions.length)

        for(let i = 0; i < positions.length; i++){
            let nft  = new Entity() 
            nft.addComponent(new Transform({position:positions[i]}))
            nft.setParent(center)

            this.NFT_CONTAINERS[i] = nft // guardo las entidades en una lista para luego, pode accederlas desde otro metodo
        }
    }

    /**This method returns an entity to be used as a parent for the NFT to be instantiated.
     * @param index - index of nft container "NFT_CONTAINERS"
    */
    public getNFTPosition(index:number){    
        let desiredIndex = index;
        if(index > this.NFT_CONTAINERS.length-1){
            desiredIndex = this.NFT_CONTAINERS.length - 1
        }else if(index < 0){
            desiredIndex = 0 
        }

        return this.NFT_CONTAINERS[desiredIndex];
    }
}

//how to add an nft using the method getNFTPosition

//let newStore = new Store(positions,new Vector3(1,1,1),new Vector3(0,0,0))

// let ent = new Entity()
// let newNft= new NFT()
        
// ent.addComponent(newNft);
// ent.addComponent(new Transform())
// ent.setParent(newStore.getNFTPosition(0)) 