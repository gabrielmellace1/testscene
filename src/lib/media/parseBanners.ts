export function parseBanners(json:any){
  const parsedOuput = {}
  json.banners.forEach( e => {
    let s = e.ref_image_url
    let n = e.name
    parsedOuput[n] = s
  });
  return parsedOuput;
}
