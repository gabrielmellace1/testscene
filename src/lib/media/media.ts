const DEBUG = false

export function loadClip(
  material: Material,
  src: string,
){
  let clip = new VideoClip(src)
  let texture = new VideoTexture(clip)
  material.albedoTexture = texture

  texture.volume = 0.5
  texture.loop = true
  texture.playing = true
  texture.play()

  return texture
}

export function loadImg(
  material: Material,
  src: string,
){
  let texture = new Texture( src)
  material.albedoTexture = texture
  return texture
}

export async function fetchMedia(url:string) {
  // "https://business.dglive.org/api/getGroupAssets/34");
  let response = await fetch(url)
  if(DEBUG){
    log("status: " + response.status)
    log("statusText: " + response.statusText)
    log("type: " + response.type)
    log("url: " + response.url)
  }
  
  if(response.ok){
    let json = await response.json()
    return json
  }
}

export async function fetchMarqueeText(){
  let response = await fetch('https://business.dglive.org/api/getvariablevalue/47/marqueeText')
  let jsonResponse = await response.json()
  return jsonResponse && jsonResponse[0].value ? jsonResponse[0].value : ""
}