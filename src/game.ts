/** ARENA DG 
 * Main script 
 * Novaworks 2022
 */

import {
    OKEX_PORTAL_GLB,
    OKEX_SCREEN_FRAME,
    OKEX_ADV_FRAME,
    OKEX_ADV_MATERIAL,
    okexScreenContent,

    THETA_PORTAL_GLB,
    THETA_SCREEN_FRAME,
    thetaScreenContent,
    THETA_ADV_FRAME,
    THETA_ADV_MATERIAL,

    TWITCH_PORTAL_GLB,
    TWITCH_SCREEN_FRAME,
    twitchScreenContent,
    TWITCH_ADV_FRAME,
    TWITCH_DEF_MATERIAL,
    TWITCH_ADV_MATERIAL,

    AERIAL_SCREEN_FRAME,
    fetchAdsMaterials,

    streamContent
} from "lib/utils/sharedAssets"

import { Building } from "./lib/building/Building"
import { Central } from './lib/building/Central'
import { Basement } from "./lib/basement/Basement"
import { initHoverBoards } from "./lib/utils/HoverBoard"
import { AerialAdWall } from "./lib/utils/AerialAdvWall"

export let basement = new Basement()
let buildingCentral = new Central()
buildingCentral.addMarquee()
initHoverBoards()

new Building(
    'okex1',
    new Vector3(14.5, 0, 36.2),
    new Vector3(0, 0, 0),
    OKEX_PORTAL_GLB,
    OKEX_SCREEN_FRAME,
    okexScreenContent,
    OKEX_ADV_FRAME,
    streamContent,
    OKEX_ADV_MATERIAL,
    new Vector3(0, 27, -10),
    new Vector3(21, 75, 44),
    new Vector3(0, 0, 0),
    0
)

new Building(
    'okex2',
    new Vector3(113, 0, 59.8),
    new Vector3(0, 180, 0),
    OKEX_PORTAL_GLB,
    OKEX_SCREEN_FRAME,
    okexScreenContent,
    OKEX_ADV_FRAME,
    streamContent,
    OKEX_ADV_MATERIAL,
    new Vector3(0, 27, -10),
    new Vector3(21, 75, 44),
    new Vector3(0, 180, 0),
    0
)

new Building(
    'theta',
    new Vector3(75, 0, 15),
    new Vector3(0, -90, 0),
    THETA_PORTAL_GLB,
    THETA_SCREEN_FRAME,
    thetaScreenContent,
    THETA_ADV_FRAME,
    streamContent,
    THETA_ADV_MATERIAL,
    new Vector3(0, 27, -20),
    new Vector3(60, 75, 21),
    new Vector3(0, 270, 0),
    0.99,
    1.2,
    new Vector3(64, 5, 22),
    new Vector3(0, -1.1,-20)
)

new Building(
    'twitch',
    new Vector3(53, 0, 81.45),
    new Vector3(0, 90, 0),
    TWITCH_PORTAL_GLB,
    TWITCH_SCREEN_FRAME,
    twitchScreenContent,
    TWITCH_ADV_FRAME,
    streamContent,
    TWITCH_ADV_MATERIAL,
    new Vector3(0, 27, -20),
    new Vector3(60, 75, 21),
    new Vector3(0, 90, 0),
    0.99,
    1.2,
    new Vector3(64, 5, 22),
    new Vector3(0, -1.1, -20)
)

fetchAdsMaterials(35).then(
    response => {
        new AerialAdWall(
            new Vector3(52, 19, 0.3),
            new Vector3(0, 180),
            AERIAL_SCREEN_FRAME,
            response,
            3,
            2
        )

        new AerialAdWall(
            new Vector3(76, 19,95),
            new Vector3(0, 0),
            AERIAL_SCREEN_FRAME,
            response,
            3,
            2
        )
    }
)

fetchAdsMaterials(36).then(
    response => {
        new AerialAdWall(
            new Vector3(127, 19, 36),
            new Vector3(0, 90),
            AERIAL_SCREEN_FRAME,
            response,
            2,
            2
        )

        new AerialAdWall(
            new Vector3(0.08, 19, 62),
            new Vector3(0, -90),
            AERIAL_SCREEN_FRAME,
            response,
            2,
            2   
        )
    }
)



// import DgWorldMarketplace from "dg-world-marketplace-sdk";
import {
  DgWorldMarketplace,
  MarketplaceOptions,
} from "dg-world-marketplace-sdk";

const opts: MarketplaceOptions = {
  previewEnv: "prod" as any,
  network: "MATIC" as any,
  engine,
  zoneId: 32,
  // Notice that DCL doesn't support more than one canvas, so if you want to use your canvas, you need to set it here.
  // if you don't set it, the sdk will create a new canvas for you :). The canvas will  be exposed by the SDK eg: dgMarketplace.canvas
  // canvas: youCanvasInstanceHere
  // If you want to log debug messages uncomment the line below
  // debug: true,
  lang: {
    noFundsTitle: "No Funds",
    noFundsDesc: "Sorry, you do not have enough ICE",
    noFundsButton: "No Funds",
    approveIceTitle: "Approve ICE",
    approveIceDesc:
      "Authorize the Store contract to operate ICE on your behalf",
    approveIceWait: "Please wait.\nThe transaction is being processed",
    approveIceRejected:
      "You need to authorize the Store contract to be able to buy this item",
    buyFor: "Buy for:",
    authorize: "Authorize",
    reject: "Reject",
    transactionProccessing: "Please wait.\nThe transaction is being processed",
    purchaseSucceed:
      "Purchased succeed!\nYou will need to refresh the page to see the wearable in your backpack.",
    purchaseFailed: "Purchased failed  .\nPlease try again.",
    wait: "Wait",
    buy: "Buy",
    openPaymentLink: "Open Payment Link",
    nftNotAvailable: "NFT not available",
  },
};

const dgMarketplace = new DgWorldMarketplace(opts);



const streamSource = new Entity()
streamSource.addComponent(
  new AudioStream(
    "https://ipfs.io/ipfs/QmNYCWYbBsZdGhngP64BTYcsV8WmYpn3rnt3oUVQPxps86"
  )
)
engine.addEntity(streamSource)

streamSource.getComponent(AudioStream).playing = true