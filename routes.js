const express = require("express");
const router = express.Router({ mergeParams: true });
const user = require("../model/User");
const nft = require("../model/CreateNft");
const nftCollection = require("../model/NftCollection");

let getCollectionName = async () => {
  let result = await nftCollection.find({
    CollectionName: "Abstraction",
  });
  return result;
};

// APIS
router.post("/createUser", async (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let publicKey = req.body.publicKey;

  try {
    const result = await user.create({
      Name: name,
      EmailId: email,
      PublicKey: publicKey,
    });
    res.json(result);
  } catch (e) {
    console.log("Error: " + e);
  }
});

router.get("/getUserDetails/:publicKey", async (req, res) => {
  try {
    let getUserInfo = await user.find({ PublicKey: req.params.publicKey });
    res.json(getUserInfo);
  } catch (e) {
    console.log("Error: " + e);
  }
});

router.get("/getNFTCollection/:collectionId", async (req, res) => {
  try {
    const getNftAsPerCollectionId = await nft.find({
      GetCollectionId: req.params.collectionId,
    });
    res.json(getNftAsPerCollectionId);
  } catch (e) {
    res.send("Error: " + e);
  }
});

router.post("/createNFT", async (req, res) => {
  let resultCollectionName = await getCollectionName();
  let collectionId = resultCollectionName[0]._id;

  let name = req.body.name;
  let description = req.body.description;
  let imageUrl = req.body.imageUrl;
  let price = req.body.price;
  let title = req.body.title;
  let royalties = req.body.royalties;
  let creator = req.body.creator;
  let owner = req.body.owner;
  let category = req.body.catgeory;
  let minimumBid = req.body.minimumBid;

  try {
    let result = await nft.create({
      Name: name,
      Description: description,
      ImageLink: imageUrl,
      FixedPrice: {
        fixedPurchase: true,
        price: price,
      },
      TimedAuction: {
        onAuction: true,
        minimumBid: minimumBid,
      },
      Title: title,
      Royalties: royalties,
      Creator: creator,
      Owner: owner,
      Category: category,
      OrderStatus: {
        onSale: false,
        purchased: true,
      },
      GetCollectionId: collectionId,
    });

    res.send(`NFT: ${result}`);
  } catch (e) {
    res.send("Error: " + e);
  }
});

router.get("/nft/:nftid", async (req, res) => {
  try {
    const result = await nft.findOne({
      _id: req.params.nftid,
    });
    res.json(result);
  } catch (e) {
    res.send("Error: " + e);
  }
});

router.get("/:category", async (req, res) => {
  try {
    const getNFTOfCategory = await nft.find({
      Category: req.params.category,
    });
    res.send(getNFTOfCategory);
  } catch (e) {
    res.send("Error: " + e);
  }
});

router.get("/:category/:orderStatus", async (req, res) => {
  try {
    let result = await nft.aggregate([
      {
        $match: {
          $or: [
            { Category: req.params.category },
            { "TimedAuction.onAuction": req.params.OrderStatus },
          ],
        },
      },
    ]);
    res.json(result);
  } catch (e) {
    console.log("Error: " + e);
  }
});

let searchNft = async () => {
  let result = await nft.find({
    // Name: { $regex: /nftName/i },
    Name: { $regex: "First NFT", $options: "i" },
    // options part is not working for mongoose
    // $options: "i",
  });
  console.log(result);
};

// searchNft();

router.get("/:Name", async (req, res) => {
  try {
    console.log("working");
    let getUserInfo = await nft.find({ Name: req.params.Name });
    res.json(getUserInfo);
  } catch (e) {
    console.log("Error: " + e);
  }
  //   try {
  //     let nftName = req.params.nftName;
  //     console.log("working", nftName);
  //     let result = await this.nft.find({ Name: nftName });
  //     console.log(result);
  //     // let result = await nft.find({
  //     //   // Name: { $regex: /nftName/i },
  //     //   Name: { $regex: nftName, $options: "i" },
  //     //   // options part is not working for mongoose
  //     //   // $options: "i",
  //     // });
  //     res.json(result);
  //   } catch (e) {
  //     console.log("Error: " + e);
  //   }
});

router.get("/:name/:category/:orderStatus", async (req, res) => {
  try {
    let nftName = req.params.name;
    let result = await nft.find({
      $and: [
        { Name: { $regex: nftName, $options: "i" } },
        { Category: req.params.category },
        { "TimedAuction.onAuction": req.params.orderStatus },
      ],
    });
    res.json(result);
  } catch (e) {
    console.log("Error: " + e);
  }
});

router.get("/topSeller/:creator", async (req, res) => {
  try {
    const result = await nft.aggregate([
      {
        $match: { Creator: req.params.creator },
      },
      {
        $lookup: {
          from: "users",
          localField: "Creator",
          foreignField: "PublicKey",
          as: "Result",
        },
      },
    ]);
    // res.send(result);
    res.json(result);
  } catch (e) {
    res.send("Error: " + e);
  }
});

router.get("/onsale/:creator", async (req, res) => {
  try {
    const inProgressNfts = await nft.find({
      $and: [{ "OrderStatus.onSale": true }, { Creator: req.params.creator }],
    });
    res.json(inProgressNfts);
  } catch (e) {
    res.send("Error: " + e);
  }
});

router.get("/PurchasedNfts/:purchased", async (req, res) => {
  try {
    const purchasedNFTS = await nft.find({
      "OrderStatus.purchased": req.params.purchased,
    });
    res.json(purchasedNFTS);
  } catch (e) {
    console.log("Error: " + e);
  }
});

router.get("/artwork/:id", async (req, res) => {
  res.send("endpoint working");
  //   try {
  //     let getNftArtwork = await createNFT.findOne({ _id: req.params.id });
  //     res.send(getNftArtwork);
  //     // res.json(result);
  //   } catch (e) {
  //     res.send("Error: " + e);
  //   }
});

module.exports = router;
