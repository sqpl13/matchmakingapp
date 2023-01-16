const mongoose = require("mongoose");

const FighterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  weight_class: {
    type: String,
    required: true,
  },
  hometown: {
    type: String,
    required: true,
  },
  team: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  height: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  record: {
    wins: {
      type: Number,
      default: 0,
    },
    losses: {
      type: Number,
      default: 0,
    },
    draws: {
      type: Number,
      default: 0,
    },
    no_decision: {
      type: Number,
      default: 0,
    },
  },
});

module.exports = mongoose.model("Fighter", FighterSchema);
