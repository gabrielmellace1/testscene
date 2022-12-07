import { PathData,
//  SlerpData
} from "./PathData"
import { CharNode } from "./CharNode"

export class Chain implements ISystem {

  //private marqueeCharacters : CharNode[] = []
  //public facePath : PathData
  public size = 0
  public spacing = 3
  public tail = null
  public pos: Vector3
  public transform: Transform
  public path: PathData // facePath
  public head  = null

  constructor(
    public boxPath: Path3D,
    public DEBUG : Boolean = false,
    public initRotation : number
  ){
  }

  /** Adds an element at the end of list */ 
  add( element : string ){
    let node = new CharNode(element, this.initRotation);
    let current: CharNode;
    if (this.head == null){
        this.head = node;
    } else {
        current = this.head;
        while (current.next) {
            current = current.next;
        }
        current.next = node;
    }
    this.size++;
  }

  place( initPos: Vector3 ){
    let current = this.head;
    this.pos = initPos
    while (current) {
        current.place(
          new Vector3(
            this.pos.x,
            this.pos.y,
            this.pos.z + this.spacing * current.order
          )
        )
        if(current.isLast()){
          this.tail = current
          this.tail.entity.addComponent(new PathData(this.boxPath))
          //this.tail.entity.addComponent(new SlerpData())
        } 
        current = current.next;
    }
  }

  /** Move chain from the last (tail) node */
// update(dt: number) {}
update(dt: number) {
  this.transform = this.tail.entity.getComponent(Transform)
  this.path = this.tail.entity.getComponent(PathData)
  //let slerp = this.tail.entity.getComponent(SlerpData)

  let spacing = 0.1
  let distance = Math.floor( Vector3.Distance(this.path.origin, this.path.target) )
  let speed = Math.floor( distance * spacing )

  if (this.path.fraction < 1) {
    // Move "Tail"
    this.transform.position = Vector3.Lerp(this.path.origin, this.path.target, this.path.fraction)
    this.path.fraction += dt / speed
  } else {
    this.path.nextPathIndex += 1
    //** Rotate */
    this.transform.rotate(new Vector3(0, 1, 0), 90 ) // TODO: Make this gradual

    if (this.path.nextPathIndex >= this.boxPath.path.length) {
      this.path.nextPathIndex = 0
    }
    this.path.origin = this.path.target
    this.path.target = this.boxPath.path[ this.path.nextPathIndex ]
    distance = Vector3.Distance(this.path.origin, this.path.target)
    speed = Math.floor( distance * spacing )
    this.path.fraction = 0

  }
  let current = this.head;
  // if(this.DEBUG)log(this.name, this.transform.position)
  while (current) {
      if(current.next){
        current.follow(spacing)
        current.rotar(spacing)
      }
      current = current.next;
  }
}

  public logChain() {
    let curr = this.head;
    let str = "";
    while (curr) {
        str += curr.letter
        curr = curr.next;
    }
    log('ARRANCO EN')
    log(str);
    log(this.pos);
  }

}