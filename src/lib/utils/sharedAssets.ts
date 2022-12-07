/** ARENA DG Shared assets
 *  
 * 2022 Novaworks.
*/

import { parseThetaStreams } from "lib/media/parseThetaStreams"
import { parseVideos } from "lib/media/parseVideos"
import { parseAdvs } from "lib/media/parseAdvs"
import {
  fetchMedia,
  loadClip,
  loadImg
} from "lib/media/media"

const DEBUG = false

export const AERIAL_SCREEN_FRAME = new GLTFShape("models/aerial-screen-frame.glb")

export const TABLE_MODEL = new GLTFShape("models/mesa-poker.glb")

export const PORTAL_MASK_SHAPE_DEFAULT = new BoxShape()
export const PORTAL_MASK_SHAPE_CIRCLE = new CircleShape()
export const TRANSPARENT_MATERIAL = new Material()
TRANSPARENT_MATERIAL.albedoColor = new Color4(1, 1, 1, 0)

export const BILLBOARD_OKEX = new GLTFShape("models/okex-billboard.glb")
export const BILLBOARD_THETA = new GLTFShape("models/theta-billboard.glb")
export const BILLBOARD_TWITCH = new GLTFShape("models/twitch-billboard.glb")

export var PORTAL_NUMBERS_WHITE: GLTFShape[];
PORTAL_NUMBERS_WHITE = [
    new GLTFShape("models/numero-portal-hall.glb"),
    new GLTFShape("models/numero-portal-01.glb"),
    new GLTFShape("models/numero-portal-02.glb"),
    new GLTFShape("models/numero-portal-03.glb"),
    new GLTFShape("models/numero-portal-04.glb"),
]
export const PORTAL_RED_GLB = new GLTFShape("models/red-portal.glb")

// Twich assets 
export const TWITCH_PORTAL_GLB = new GLTFShape("models/twitch-portal.glb")
export const TWITCH_SCREEN_FRAME = new GLTFShape("models/twitch-screen-frame.glb")
export const TWITCH_ADV_FRAME = new GLTFShape("models/twitch-adv-frame.glb")
let twitchAdvContent = new Texture("images/Publi_Twitch.jpg")
export const TWITCH_ADV_MATERIAL = new Material()
TWITCH_ADV_MATERIAL.albedoTexture = twitchAdvContent
export const TWITCH_DEF_MATERIAL = new Material()
TWITCH_DEF_MATERIAL.albedoTexture = twitchAdvContent

// Theta assets 
export const THETA_PORTAL_GLB = new GLTFShape("models/theta-portal.glb")
export const THETA_SCREEN_FRAME = new GLTFShape("models/theta-screen-frame.glb")
export const THETA_ADV_FRAME = new GLTFShape("models/theta-adv-frame.glb")
let thetaAdvContent = new Texture("images/Publi_Theta.jpg")
export const THETA_ADV_MATERIAL = new Material()
THETA_ADV_MATERIAL.albedoTexture = thetaAdvContent
export const THETA_DEF_MATERIAL = new Material()
THETA_DEF_MATERIAL.albedoTexture = thetaAdvContent

// Okex assets
export const OKEX_PORTAL_GLB = new GLTFShape( "models/okex-portal.glb")
export const OKEX_SCREEN_FRAME = new GLTFShape("models/okex-screen-frame.glb")
export const OKEX_ADV_FRAME = new GLTFShape("models/okex-adv-frame.glb")
let okexAdvContent = new Texture("images/Publi_OKEx.jpg")
export const OKEX_DEF_MATERIAL = new Material()
OKEX_DEF_MATERIAL.albedoTexture = okexAdvContent
export const OKEX_ADV_MATERIAL = new Material()
OKEX_ADV_MATERIAL.albedoTexture = okexAdvContent

// const marquee = new Entity();
// marquee.addComponent(new GLTFShape("models/animated-marquee.glb"));
// engine.addEntity(marquee);

/** Fetch and asing remote content */
let createAndSettingMaterial = () => {
  let newMaterial = new Material();
  newMaterial.roughness = 1
  newMaterial.specularIntensity = 0
  newMaterial.metallic = 0
  return newMaterial;
}

export const okexScreenContent = createAndSettingMaterial();
export const thetaScreenContent = createAndSettingMaterial();
export const twitchScreenContent = createAndSettingMaterial();

export const streamContent = createAndSettingMaterial();

export const defaultMaterial = createAndSettingMaterial();
let fallbackVideoClip = new VideoClip("videos/visuals.mp4");
let fallbackVideoTexture = new VideoTexture(fallbackVideoClip);

// async function fetchAlias() {
//   let dgResponse = await fetch('https://business.dglive.org/api/getZone/22')
//   let json = await dgResponse.json()
//   let alias = json['banners'][0].name
//   return alias
// }

// fetchAlias().then( res => {
//   log('alias')
//   log(res)
// })

export async function fetchStreamingURL(zone: number){
  let dgResponse = await fetch('https://business.dglive.org/api/getZone/' + zone)
  let json = await dgResponse.json()
  let response = await fetchMedia("https://api.theta.tv/v1/channel?alias=" + json['banners'][0].name)
  //let response = await fetchMedia("https://api.theta.tv/v1/channel?alias=dglive")
  let parsedReponse = await parseThetaStreams(response)
  if(response.status){
    return parsedReponse.video_url
  }
}


let streamingTexture : VideoTexture
let clip : VideoClip

fetchStreamingURL(22).then(
  URL => {

    clip = new VideoClip(URL)
    streamingTexture = new VideoTexture(clip)
    resfreshStreaming()
  }, error => {
    loadImg(streamContent, 'images/no-signal.png');
  }
)

export function resfreshStreaming(){
  streamContent.albedoTexture = streamingTexture
  streamingTexture.reset()
}

// fetchMedia("https://api.theta.tv/v1/channel?alias=nasa")
//   .then(parseThetaStreams)
//   .then(
//     resolve => {
//       if(DEBUG)log(resolve)
//       if(resolve.status){
//         if(DEBUG)log('Tunning in... ' + resolve.name);
//         loadClip(streamContent, resolve.video_url);
//       }else{
//         loadImg(streamContent, resolve.image);
//       }
//       return resolve // este return estaba de mas
//     },
//     reason => {
//       log("fetch stream error: " + reason)
//       loadImg(streamContent, 'images/no-signal.png');
//     }
//   )

fetchMedia(
  "https://business.dglive.org/api/getGroupAssets/34"
)
.then( parseVideos )
.then(
  resolve => {
    loadClip(twitchScreenContent, resolve['TWITCH']);
    loadClip(okexScreenContent,   resolve['OKEX']);
    loadClip(thetaScreenContent,  resolve['THETA']);
    return resolve 
  },
  reason => {
    if(DEBUG) log("fetch video error: " + reason)
    twitchScreenContent.albedoTexture = fallbackVideoTexture
    okexScreenContent.albedoTexture   = fallbackVideoTexture
    thetaScreenContent.albedoTexture  = fallbackVideoTexture
    fallbackVideoTexture.loop = true
    fallbackVideoTexture.play()
  }
)

export async function fetchAdsMaterials(group: number){
  let response = await fetchMedia("https://business.dglive.org/api/getGroupAssets/" + group)
  let parsedOuput = await(parseAdvs(response))
  
  let advsMaterials = []
  let counter = 0
  for(let key in parsedOuput){
    let texture = new Texture(parsedOuput[key])
    let material = new Material()
    material.albedoTexture = texture
    advsMaterials.push(material)
    counter++
  }
  
  return advsMaterials
}

executeTask(async () => {
  const estacionesHover = new Entity();
  engine.addEntity(estacionesHover);
  onSceneReadyObservable.add(() => {
    estacionesHover.addComponent(new GLTFShape(
        "models/hoverboard-stations.glb"
    ));
  });
});