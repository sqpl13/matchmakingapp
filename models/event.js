const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value > new Date();
      },
      message: "Event date cannot be in the past",
    },
  },
  location: {
    type: String,
    required: true,
  },
  fights: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Fight",
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model("Event", EventSchema);
