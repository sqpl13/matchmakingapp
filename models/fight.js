const mongoose = require("mongoose");

const FightSchema = new mongoose.Schema({
  fighters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fighter",
    },
  ],
  weight_class: {
    type: String,
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  result: {
    type: String,
    default: "No result yet",
  },
});

module.exports = mongoose.model("Fight", FightSchema);
