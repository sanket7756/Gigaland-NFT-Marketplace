const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const NFT_CATEGORIES = require("./MultipleCategories");

const createNFTSchema = new Schema({
  //   _id: { type: Schema.ObjectId, auto: true },
  Name: {
    type: String,
    required: true,
  },

  Description: {
    type: String,
    required: true,
  },

  ImageLink: {
    type: String,
    required: true,
  },

  FixedPrice: {
    fixedPurchase: {
      type: Boolean,
    },
    price: {
      type: Number,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  TimedAuction: {
    onAuction: {
      type: Boolean,
      required: true,
    },
    minimumBid: {
      type: Number,
    },
    startingDate: {
      type: Date,
      default: new Date(),
    },
    expirationDate: {
      type: Date,
      default: new Date(),
    },
  },

  Title: {
    type: String,
    required: true,
  },

  Royalties: {
    type: Number,
    required: true,
  },

  Creator: {
    type: String,
    required: true,
  },

  Owner: {
    type: String,
    required: true,
  },

  Category: {
    type: String,
    enum: NFT_CATEGORIES,
    default: NFT_CATEGORIES.Art,
    required: true,
  },
  OrderStatus: {
    onSale: {
      type: Boolean,
    },
    purchased: {
      type: Boolean,
    },
  },
  GetCollectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NftCollection",
  },
});

module.exports = mongoose.model("NFTS", createNFTSchema);
