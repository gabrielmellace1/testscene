
export function parseVideos(json:any){
  const path = "https://business.dglive.org//upload//";  
  const parsedOuput = {}

  if(json.media.length == 0){
    throw new Error(json)  
  }
  else{
    json.media.forEach( e => {
      let s = e.source
      let n = e.name
      parsedOuput[n] = path + s
    });
    return parsedOuput;
  }
}