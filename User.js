const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  Name: {
    type: String,
    required: true,
    trim: true,
  },
  EmailId: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  PublicKey: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
});

module.exports = mongoose.model("User", userSchema);
