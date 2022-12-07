@Component("pathData")
export class PathData {
  /**
   * 
   * @param pathData 
   */
  constructor(
    private pathData: Path3D
  ){

  }
    origin: Vector3 = this.pathData.path[0]
    target: Vector3 = this.pathData.path[1]
    fraction: number = 0
    nextPathIndex: number = 1
}

// @Component("slerpData")
// export class SlerpData {
//   originRot: Quaternion = Quaternion.Euler(0, 90, 0)
//   targetRot: Quaternion = Quaternion.Euler(0, 0, 0)
//   fraction: number = 0
// }