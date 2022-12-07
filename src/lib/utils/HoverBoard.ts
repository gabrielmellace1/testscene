/** ARENA DG Boards
 *  
 * 2022 Novaworks.
 */

const sceneMessageBus = new MessageBus();
import * as ecsUtils from "@dcl/ecs-scene-utils";

const hoverglb = new GLTFShape("models/hoverboard.glb");

//export const HOVER_BOX_SHAPE = new BoxShape()
//export const HOVER_BOX_MATERIAL = new Material()
//HOVER_BOX_MATERIAL.albedoColor = new Color4(1, 1, 1, 0)

@Component("hoverBoardFlag")
export class HoverBoardFlag {
  initialTransform: Transform;
  lastUpdate: number = 0;
  //box: BoxShape;
  constructor(
    initialTransform: Transform,
    //box: BoxShape
    ) {
    this.initialTransform = initialTransform;
    //this.box = box;
  }
}

export class HoverBoard {
  actived: Entity | undefined; // Active board
  timeUpdate: number = 0;
  awayTimer: number = 0.0
  timep2p: number = 0; // Unused 
  boards: Entity[] = [];
  showHelp: boolean = true;
  updateSpeed = 1/3;
  movementSpeed : number = .4;
  rotationSpeed : number = .5;

  helpBox: UIContainerRect;
  uiAnimation: boolean[] = [true, false]; // Animation finished, ui opened

  constructor() {

    const canvas = new UICanvas();
    this.helpBox = new UIContainerRect(canvas);
    this.helpBox.color = new Color4(0, 0, 0, 0.7);
    this.helpBox.hAlign = "center";
    this.helpBox.vAlign = "top";
    this.helpBox.width = 350;
    this.helpBox.height = 100;
    this.helpBox.positionY = 0;
    this.helpBox.visible = false;
    this.helpBox.opacity = 0;
    this.helpBox.isPointerBlocker = false;

    const text = new UIText(this.helpBox);
    text.value = `Hold click in the direction you want to go\nPress E to go up\nPress F to go down`;
    text.fontSize = 16;
    text.hTextAlign = "center";
    text.vTextAlign = "center";
    text.visible = true;

    // listen "hoverMove"
    sceneMessageBus.on("hoverMove", (value, sender) => {
      if (sender != "self") {
        if (this.boards[value.index] &&
          this.boards[value.index] != this.actived
        ) {
          const currPos = value.position;
          // refresh lastUpdate
          this.boards[value.index].getComponent(HoverBoardFlag).lastUpdate = +new Date();
          // move board 
          this.boards[value.index].addComponentOrReplace(
            // https://github.com/decentraland/decentraland-ecs-utils#move-an-entity
            new ecsUtils.MoveTransformComponent(
              this.boards[value.index].getComponent(Transform).position,
              new Vector3(currPos.x, currPos.y, currPos.z),
              this.updateSpeed 
            )
          );
        }
      }
    });

  }

  //show/hide ui
  hideAndShow(show: boolean): void {
    this.uiAnimation[0] = false;
    if (show) {
      this.uiAnimation[1] = true;
    } else {
      this.uiAnimation[1] = false;
    }
  }

  async update(dt: number): Promise<void> {

    //Update Timer
    this.timeUpdate += dt;
    
    // fade in/out ui help 
    if (!this.uiAnimation[0]) {
      if (this.uiAnimation[1]) {
        this.helpBox.visible = true;
        this.helpBox.opacity += dt * 5;
        if (this.helpBox.opacity > 1) {
          this.uiAnimation[0] = true;
        }
      } else {
        this.helpBox.opacity -= dt * 5;
        if (this.helpBox.opacity < 0) {
          this.helpBox.visible = false;
          this.uiAnimation[0] = true;
        }
      }
    }

    // Unused block
    if (this.timep2p > this.updateSpeed) {
      this.timep2p = 0;
      if (this.actived) {
        this.actived.getComponent(HoverBoardFlag).lastUpdate = + new Date();
        sceneMessageBus.emit(`hoverMove`, {
          index: this.boards.indexOf(this.actived),
          position: this.actived.getComponent(Transform).position,
        });
      }
    }

    //Update the AwayTimer, causing the hover to reset its position, if certain conditions are met
    if(typeof this.actived =='undefined')
    {
      this.awayTimer += dt
    }

    if (this.timeUpdate > .25) {
      
      //Reset Global Timer
      this.timeUpdate = 0;

      for (const board of this.boards) {
        var boardFlag = board.getComponent(HoverBoardFlag)

        if (
          boardFlag.lastUpdate != 0 &&
          board != this.actived &&
          this.awayTimer > 2
        ){
          //log("Reset HoverBoard to initial Pos and rot")
          //log("Initial Pos: " + boardFlag.initialTransform.position)
          //log("Initial Rot: " + boardFlag.initialTransform.rotation)

          boardFlag.lastUpdate = 0
          var transform = board.getComponent(Transform)
          board.addComponentOrReplace(
            new ecsUtils.MoveTransformComponent(
              transform.position,
              boardFlag.initialTransform.position,
              5
            )
          );

          // board rotation
          board.addComponentOrReplace(
            new ecsUtils.RotateTransformComponent(
              transform.rotation,
              boardFlag.initialTransform.rotation,
              2
            )
          );
        }
      }
        
      const feetPos = Camera.instance.feetPosition;

      //Update the lastUpdate variable && broadcast id and postion of board moving && set the entity to undefined if the user is far
      if (this.actived) {
        //log("Currently Active")

        //Update the lastUpdate variable
        this.actived.getComponent(HoverBoardFlag).lastUpdate = +new Date();

        // broadcast id and postion of board moving
        sceneMessageBus.emit(`hoverMove`, {
          index: this.boards.indexOf(this.actived),
          position: this.actived.getComponent(Transform).position,
        });

        //set the entity to undefined if the user is far
        if (distance(this.actived.getComponent(Transform).position, Camera.instance.feetPosition) > 1.5 ||
            feetPos.y - this.actived.getComponent(Transform).position.y > 2 ||
            feetPos.y - this.actived.getComponent(Transform).position.y < 0) {
          //log("Setting the Actived variable as undefined")
          this.actived = undefined
          this.awayTimer = 0
        }
      }
      
      // If the HoverBoard is near the User,
      // it proceeds set the entity to the actived variable 
      if (this.actived == undefined){
        for (const board of this.boards) {
          const boardPos = board.getComponent(Transform).position;

          if (distance(boardPos, Camera.instance.feetPosition) < 0.8 &&
              feetPos.y - boardPos.y < 2 &&
              feetPos.y - boardPos.y > 0) {
            //log("Setting the Actived variable with a value")
            this.actived = board; // asigna este board como "activa" 
            this.displayHelp();
            break;
          }
        }
      }
    }

    // Player Input and Hover Movement
    if (this.actived) {

      //Set Hover's Rotation
      this.actived.getComponent(Transform).rotation.setEuler(
        0, Camera.instance.rotation.eulerAngles.y - 180, 0
      );

      //Get Hover Position
      const position = this.actived.getComponent(Transform).position;

      // Move Forward
      if (Input.instance.isButtonPressed(ActionButton.POINTER).BUTTON_DOWN) {
        const rot = (Camera.instance.rotation.eulerAngles.y * Math.PI) / 180;
        // where camera is pointing
        position.addInPlace(new Vector3(
          Math.sin(rot) * this.rotationSpeed, 0, Math.cos(rot) *this.rotationSpeed
        ));
      }
      
      // Move Up
      if (
        Input.instance.isButtonPressed(ActionButton.PRIMARY).BUTTON_DOWN
        && position.y < 200
      ) {
        position.addInPlace(new Vector3(0, this.movementSpeed, 0));
      }

      // Move Down 
      if (
        Input.instance.isButtonPressed(ActionButton.SECONDARY).BUTTON_DOWN
        && position.y > 0.2
      ) {
        position.addInPlace(new Vector3(0, -this.movementSpeed, 0));
      }
    }
  }

  addBoard(position: Vector3, rotate: number): Entity {
    const board = new Entity();

    const transform = new Transform({
      position,
      scale: new Vector3(1.5, 1, 1.5),
      rotation: Quaternion.Euler(0, rotate, 0),
    });

    board.addComponent(transform);
    //  board.getComponentOrCreate(Material).albedoColor = new Color4(
    //    Math.random(), Math.random(), Math.random(), 0.8
    //  )
    board.addComponent(hoverglb);

    // add collition mask
    //let mask = this.addBox(
    //    transform.position.clone(),
    //    transform.scale.clone(),
    //    transform.rotation.clone()
    //)

    board.addComponent(
      new HoverBoardFlag( 
        new Transform({
          scale: transform.scale.clone(),
          position: transform.position.clone(),
          rotation: transform.rotation.clone(),
        })
        //mask
      )
    );

    engine.addEntity(board);
    this.boards.push(board);
    return board;
  }


  displayHelp = async () => {
    if (!this.showHelp) return;
    this.showHelp = false;
    this.uiAnimation = [false, true];
    await this.delay(5000);
    this.uiAnimation = [false, false];
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


function distance(pos1: Vector3, pos2: Vector3): number {
  const a = pos1.x - pos2.x;
  const b = pos1.z - pos2.z;
  return Math.sqrt(a * a + b * b);
}

export function initHoverBoards(){
  executeTask(async () => {
    const hoverBoard = new HoverBoard();
    engine.addSystem(hoverBoard);

    hoverBoard.addBoard(new Vector3(69.1, .5, 92.0), 180);
    hoverBoard.addBoard(new Vector3(74.80, .5, 92.0), 180);

    hoverBoard.addBoard(new Vector3(3.1, .5, 54.8), 90);
    hoverBoard.addBoard(new Vector3(3.1, .5, 60.4), 90);

    hoverBoard.addBoard(new Vector3(53.31, .5, 2.8), 0);
    hoverBoard.addBoard(new Vector3(59.05, .5, 2.8), 0);

    hoverBoard.addBoard(new Vector3(125, .5, 37.5), 270);
    hoverBoard.addBoard(new Vector3(125, .5, 43.25), 270);
});
}