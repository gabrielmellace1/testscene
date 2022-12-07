export function parseAdvs(json: any){
    const path = "https://business.dglive.org//upload//";  
    const parsedOuput = {}
  
    if(json.media.length == 0){
      throw new Error(json)  
    }
    else{
      json.media.forEach( e => {
        let s = e.ref_image
        let n = e.name.toString()
        parsedOuput[n] = path + s
      });
    //   log(parsedOuput)
      return parsedOuput;
    }
}