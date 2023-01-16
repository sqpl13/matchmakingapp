const express = require("express");
const router = express.Router();
const db = require("../services/db");
const Fighter = require("../models/fighter");
const Fight = require("../models/fight");
const Event = require("../models/event");
const { ObjectId } = require("mongodb");

router.delete("/:id", async (req, res) => {
  try {
    const deletedFight = await db.collection("fights").deleteOne({
      _id: new ObjectId(req.params.id),
    });
    if (deletedFight.deletedCount === 0) {
      res.status(404).json({ message: "Fight not found" });
    } else {
      //Delete the fight from the event's fights array
      await db
        .collection("events")
        .updateOne({}, { $pull: { fights: req.params.id } });

      res.status(200).json({ message: "Fight deleted", deletedFight });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting fight", error: err });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const update = { ...req.body };
    delete update._id;

    const updatedFight = await db.collection("fights").updateOne(
      {
        _id: new ObjectId(req.params.id),
      },
      { $set: update }
    );
    if (updatedFight.matchedCount === 0) {
      res.status(404).json({ message: "Fight not found" });
    } else if (updatedFight.modifiedCount === 0) {
      res.status(404).json({ message: "No changes detected" });
    } else {
      res.status(200).json({ message: "Fight updated", updatedFight });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating fight", error: err });
  }
});

router.post("/", async (req, res) => {
  try {
    // Check if the event exists
    const event = await db
      .collection("events")
      .findOne({ name: req.body.event });
    if (!event) {
      return res.status(400).json({ error: "Event not found" });
    }

    // Check if the fighters exist
    const fighters = await db
      .collection("fighters")
      .find({ name: { $in: req.body.fighters } })
      .toArray();
    if (fighters.length !== req.body.fighters.length) {
      return res.status(400).json({ error: "One or more fighters not found" });
    }

    // Create a new fight
    const fight = new Fight({
      event: event._id,
      fighters: fighters.map((fighter) => fighter._id),
      weight_class: req.body.weight_class,
    });
    await db.collection("fights").insertOne(fight);

    // Adding the fight to the event.fights
    await db
      .collection("events")
      .updateOne({ _id: event._id }, { $push: { fights: fight } });

    res.json(fight);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const data = await db
      .collection("fights")
      .findOne({ _id: ObjectId(req.params.id) });
    if (!data) {
      res.status(404).json({ message: "Fight not found" });
    } else {
      res.json(data);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await db.collection("fights").find().toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
