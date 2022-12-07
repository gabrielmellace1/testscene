# Welcome to arena-dg

This repo contains all the models and classes of Arena project

## Running this project
Clone this repo, and then run:
```
dcl start
```

## Project sctructure
- Project classes are in `src/lib`
- Classes initialization is done in `src/lib/game.ts`
- All the assets are initialized in `src/lib/utils/sharedAssets.ts`

### Elements in this project
- **Buildings**: This towers contains differents **floors** with **tables** and **screens**, you can navigate them using **portals** that are located in the **halls**
- **Basement**: This place is in the zero level of the scene, and contains tables, and screens. On the bottom of each building, you will find an NFT store
- **Central**: In the center of the scene, it's located the main building. There you will find the same content that the building have, and arround there is a marquee that fetchs the string content from DG Live 
- **Advertisements**: this are located inside buildings, basement and in the perimeter of the scene, and fetchs the data from DG Live
- **Billboard**: Shows the ammount of players inside each building and allows them to teleport
- **Hoverboards**: Vehicles docked in the side of the buildings that allows you to fly and navigate arround the scene