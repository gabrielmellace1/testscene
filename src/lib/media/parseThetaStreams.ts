const DEBUG : Boolean = false

export function parseThetaStreams(json:any){
  if(!json){
    throw new Error('no response')  
  }
  else{
    if( DEBUG ) log(json.body)
    let thetaStream = {
      status : json.body.status === 'on' ? true : false,
      name : json.body.name ? json.body.name : undefined,
      image : json.body ? json.body.live_stream.game.thumbnail_url : undefined,
      video_url : json.body ? json.body.live_stream.video_urls[0].url : undefined
    }
    return thetaStream;
  }
}