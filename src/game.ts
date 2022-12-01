// import DgWorldMarketplace from "dg-world-marketplace-sdk";
import {
  DgWorldMarketplace,
  MarketplaceOptions,
} from "dg-world-marketplace-sdk";

const opts: MarketplaceOptions = {
  previewEnv: "prod" as any,
  network: "MATIC" as any,
  engine,
  zoneId: 34,
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
    purchaseFailed: "Purchased failed.\nPlease try again.",
    wait: "Wait",
    buy: "Buy",
    openPaymentLink: "Open Payment Link",
    nftNotAvailable: "NFT not available",
  },
};

const dgMarketplace = new DgWorldMarketplace(opts);